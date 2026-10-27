import { afterEach, describe, expect, it, vi } from "vitest";
import { statSync } from "node:fs";
import { join } from "node:path";
import { articles } from "@/data/articles";
import imageManifest from "@/content/cam-nang/images.json";
import { articleImageSrc, parseArticleImages } from "@/lib/article-images";
import {
  articleTopics,
  ARTICLES_PER_PAGE,
  articlesInTopic,
  articlesOnPage,
  articlesPagePath,
  getTopic,
  pageCount,
  sortedArticles,
  topicPath,
} from "@/data/article-topics";
import { breadcrumbTrail, getSeoPage, seoPages } from "@/lib/seo/pages";

/**
 * "Cảnh sát SEO": chạy cùng `npm test` và CI. Sửa sổ SEO sai luật → CI đỏ, không lên production.
 * Luật chi tiết: docs/08-SEO.md §2.
 */
const paths = new Set(seoPages.map((p) => p.path));
const lower = (s: string) => s.toLocaleLowerCase("vi");

describe("Sổ SEO (src/lib/seo/pages.ts)", () => {
  it("path không trùng", () => {
    expect(paths.size).toBe(seoPages.length);
  });

  it.each(seoPages)("$path: title ≤ 60 ký tự và không trùng", (p) => {
    expect(p.title.length).toBeLessThanOrEqual(60);
    expect(seoPages.filter((o) => o.title === p.title)).toHaveLength(1);
  });

  it.each(seoPages)("$path: description 100–160 ký tự và không trùng", (p) => {
    expect(p.description.length).toBeGreaterThanOrEqual(100);
    expect(p.description.length).toBeLessThanOrEqual(160);
    expect(seoPages.filter((o) => o.description === p.description)).toHaveLength(1);
  });

  it.each(seoPages)("$path: H1 và title chứa từ khoá chính", (p) => {
    expect(lower(p.h1)).toContain(lower(p.keyword));
    expect(lower(p.title)).toContain(lower(p.keyword));
  });

  it.each(seoPages)("$path: parent + related đều là trang có thật", (p) => {
    if (p.path !== "/") expect(p.parent && paths.has(p.parent)).toBe(true);
    for (const r of p.related) expect(paths.has(r), `link gãy: ${r}`).toBe(true);
    expect(p.related).not.toContain(p.path);
  });

  it.each(seoPages.filter((p) => p.index))("$path (index): có ≥ 1 link nội bộ", (p) => {
    expect(p.related.length).toBeGreaterThan(0);
  });

  it("breadcrumb luôn bắt đầu từ trang chủ", () => {
    for (const p of seoPages) expect(breadcrumbTrail(p.path)[0]?.path).toBe("/");
  });
});

describe("Metadata ảnh và robots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("chỉ cho phép preview ảnh lớn khi trang thực sự được index", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    const { pageMetadata } = await import("@/lib/seo/metadata");
    for (const page of seoPages) {
      expect(pageMetadata(page.path).robots).toEqual(
        page.index
          ? { index: true, follow: true, "max-image-preview": "large" }
          : { index: false, follow: true },
      );
    }
  });

  it("giữ noindex trước launch, không bật preview ảnh lớn", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "false");
    const { pageMetadata } = await import("@/lib/seo/metadata");
    expect(pageMetadata("/cam-nang").robots).toEqual({ index: false, follow: true });
  });

  it("mọi bài dùng ảnh bìa 1600px và URL tuyệt đối cho OG và Twitter", async () => {
    const { generateMetadata } = await import("@/app/(marketing)/cam-nang/[slug]/page");
    const { site } = await import("@/lib/site");
    for (const article of articles) {
      const cover = parseArticleImages(imageManifest).find(
        (image) => image.slug === article.slug && image.role === "cover",
      )!;
      const url = new URL(articleImageSrc(cover), site.url).toString();
      const metadata = await generateMetadata({ params: Promise.resolve({ slug: article.slug }) });
      expect(metadata.openGraph).toMatchObject({
        images: [{ url, width: 1600, alt: cover.alt }],
      });
      expect(metadata.twitter).toMatchObject({
        card: "summary_large_image",
        images: [{ url, alt: cover.alt }],
      });
    }
  });
});

describe("Cẩm nang (src/data/articles.ts)", () => {
  const images = parseArticleImages(imageManifest);
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  const isRealDate = (d: string) => new Date(`${d}T00:00:00Z`).toISOString().startsWith(d);

  it("slug không trùng", () => {
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
  });

  it.each(articles)("$slug: có ảnh role cover và file WebP trong public", (article) => {
    const covers = images.filter((image) => image.slug === article.slug && image.role === "cover");
    expect(covers, `images.json: ${article.slug} cần đúng một ảnh role cover`).toHaveLength(1);
    const cover = covers[0]!;
    const file = join(process.cwd(), "public", articleImageSrc(cover).slice(1));
    expect(statSync(file, { throwIfNoEntry: false })?.isFile(), `Thiếu file ảnh bìa: ${file}`).toBe(
      true,
    );
  });

  // Agent từng chép file ảnh bài cũ sang bài mới → cùng một ảnh hiện ở hai bài (docs/11 §Nguồn ảnh).
  it("mỗi ảnh Unsplash chỉ dùng một lần trong manifest (bìa không trùng bìa hay ảnh trong bài)", () => {
    const seen = new Map<string, string>();
    for (const image of images) {
      if (image.source === "own") continue;
      const where = `${image.slug}/${image.file}`;
      const first = seen.get(image.cdnPath);
      expect(first, `${where} trùng ảnh với ${first} (${image.cdnPath})`).toBeUndefined();
      seen.set(image.cdnPath, where);
    }
  });

  it.each(articles)("$slug: publishedAt / updatedAt đúng YYYY-MM-DD", (a) => {
    expect(a.publishedAt).toMatch(isoDate);
    expect(isRealDate(a.publishedAt)).toBe(true);
    if (a.updatedAt) {
      expect(a.updatedAt).toMatch(isoDate);
      expect(a.updatedAt >= a.publishedAt).toBe(true);
    }
  });
});

it.each(parseArticleImages(imageManifest))(
  "$slug/$file: mọi ảnh kể cả ảnh tự chụp có file thật",
  (image) => {
    const file = join(process.cwd(), "public", articleImageSrc(image).slice(1));
    expect(statSync(file, { throwIfNoEntry: false })?.isFile(), `Thiếu file ảnh: ${file}`).toBe(
      true,
    );
  },
);

describe("Chủ đề và phân trang cẩm nang", () => {
  it("mọi bài có chủ đề hợp lệ", () => {
    for (const article of articles) {
      expect(articleTopics.map((topic) => topic.slug)).toContain(article.category);
      expect(getSeoPage(`/cam-nang/${article.slug}`).related).toContain(
        topicPath(article.category),
      );
    }
  });

  it.each(articleTopics)("$slug: có bài, intro 80–120 từ và liên kết đủ chủ đề khác", (topic) => {
    const items = articlesInTopic(topic.slug);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((article) => article.category === topic.slug)).toBe(true);
    expect(items.map((article) => article.publishedAt)).toEqual(
      items
        .map((article) => article.publishedAt)
        .sort()
        .reverse(),
    );
    const words = topic.intro.split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(80);
    expect(words).toBeLessThanOrEqual(120);
    expect(getTopic(topic.slug)).toBe(topic);
    const page = getSeoPage(topicPath(topic.slug));
    expect(page).toMatchObject({
      parent: "/cam-nang",
      schema: "CollectionPage",
      index: true,
      priority: 0.6,
    });
    expect(page.related).toEqual([
      ...articleTopics
        .filter((other) => other.slug !== topic.slug)
        .map((other) => topicPath(other.slug)),
      "/cam-nang",
    ]);
    expect(getSeoPage("/cam-nang").related).toContain(topicPath(topic.slug));
  });

  it("phân trang chứa đủ mỗi bài đúng một lần, mới nhất trước", () => {
    expect(ARTICLES_PER_PAGE).toBe(6);
    expect(pageCount()).toBe(Math.ceil(articles.length / 6));
    const pages = Array.from({ length: pageCount() }, (_, i) => articlesOnPage(i + 1));
    for (const page of pages) expect(page.length).toBeLessThanOrEqual(6);
    const all = pages.flat();
    expect(all).toEqual(sortedArticles());
    expect(all.map((article) => article.publishedAt)).toEqual(
      all
        .map((article) => article.publishedAt)
        .sort()
        .reverse(),
    );
    for (const article of articles)
      expect(all.filter((item) => item.slug === article.slug)).toHaveLength(1);
    expect(all).toHaveLength(articles.length);
  });

  it("sổ chỉ có các trang phân trang hợp lệ và đường dẫn trang 1 là /cam-nang", () => {
    expect(articlesPagePath(1)).toBe("/cam-nang");
    expect(paths.has("/cam-nang/trang/1")).toBe(false);
    expect(paths.has(`/cam-nang/trang/${pageCount() + 1}`)).toBe(false);
    for (let n = 2; n <= pageCount(); n++) {
      const page = getSeoPage(articlesPagePath(n));
      expect(page.title).toContain(`Trang ${n}`);
      expect(page).toMatchObject({
        parent: "/cam-nang",
        schema: "CollectionPage",
        index: true,
        priority: 0.5,
      });
      expect(page.related).toEqual([
        "/cam-nang",
        ...articleTopics.map((topic) => topicPath(topic.slug)),
      ]);
    }
    expect(getTopic("khong-co")).toBeUndefined();
  });

  it("route sinh đúng static params và từ chối param sai trong page lẫn metadata", async () => {
    const pagination = await import("@/app/(marketing)/cam-nang/trang/[page]/page");
    const topics = await import("@/app/(marketing)/cam-nang/chu-de/[topic]/page");
    expect(pagination.generateStaticParams()).toEqual(
      Array.from({ length: pageCount() - 1 }, (_, i) => ({ page: String(i + 2) })),
    );
    expect(topics.generateStaticParams()).toEqual(
      articleTopics.map((topic) => ({ topic: topic.slug })),
    );
    for (const value of ["02", "abc", "0", "1", "2.0", "-2", String(pageCount() + 1)]) {
      const props = { params: Promise.resolve({ page: value }) };
      await expect(pagination.generateMetadata(props)).rejects.toThrow(
        "NEXT_HTTP_ERROR_FALLBACK;404",
      );
      await expect(pagination.default(props)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    }
    const props = { params: Promise.resolve({ topic: "khong-co" }) };
    await expect(topics.generateMetadata(props)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    await expect(topics.default(props)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });
});
