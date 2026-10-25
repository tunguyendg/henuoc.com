import { afterEach, describe, expect, it, vi } from "vitest";
import { statSync } from "node:fs";
import { join } from "node:path";
import { articles } from "@/data/articles";
import imageManifest from "@/content/cam-nang/images.json";
import { articleImageSrc, parseArticleImages } from "@/lib/article-images";
import { breadcrumbTrail, seoPages } from "@/lib/seo/pages";

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
