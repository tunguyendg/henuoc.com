import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ArticleImage, createArticleImage } from "@/components/articles/article-image";
import { articleImageSrc, parseArticleImages } from "@/lib/article-images";
import fixture from "./fixtures/cam-nang-images.json";

it("keeps manifest order for covers and renders captions with both credit links", () => {
  const images = parseArticleImages(fixture);
  const cover = images[0]!;
  if (cover.source !== "unsplash") throw new Error("Fixture cover must be Unsplash");
  const html = renderToStaticMarkup(createElement(ArticleImage, { image: cover, card: true }));
  expect(articleImageSrc(cover)).toBe("/images/cam-nang/cach-ghi-thiep-cuoi/anh-bia.webp");
  expect(html).toContain("<figure");
  expect(html).toContain("<figcaption");
  expect(html).toContain(cover.alt);
  expect(html).toContain(`href="${cover.photographerUrl}"`);
  expect(html).toContain(`href="${cover.unsplashUrl}"`);
  expect(html).toContain('data-nimg="fill"');
  expect(html).toContain('sizes="');
});

it("resolves the MDX file within its article and reports unknown files", () => {
  const images = parseArticleImages(fixture);
  const InlineImage = createArticleImage(images);
  const html = renderToStaticMarkup(createElement(InlineImage, { file: "thiep-moi" }));
  expect(html).toContain(encodeURIComponent("/images/cam-nang/cach-ghi-thiep-cuoi/thiep-moi.webp"));
  expect(() => renderToStaticMarkup(createElement(InlineImage, { file: "missing" }))).toThrow(
    "không tìm thấy ảnh",
  );
});

it("rejects invalid manifest paths, credit URLs and duplicates", () => {
  expect(() => parseArticleImages([{ ...fixture[0], file: "../escape" }])).toThrow();
  expect(() =>
    parseArticleImages([{ ...fixture[0], photographerUrl: "javascript:alert(1)" }]),
  ).toThrow();
  expect(() => parseArticleImages([fixture[0], fixture[0]])).toThrow("trùng");
});

it("supports full editorial paths in both the manifest and MDX", () => {
  const images = parseArticleImages(
    fixture.map((image) => ({
      ...image,
      file: `cam-nang/${image.slug}/${image.file}.webp`,
    })),
  );
  expect(images[0]?.file).toBe("anh-bia");
  const InlineImage = createArticleImage(images);
  const html = renderToStaticMarkup(
    createElement(InlineImage, {
      file: "cam-nang/cach-ghi-thiep-cuoi/thiep-moi.webp",
    }),
  );
  expect(html).toContain(fixture[1]!.alt);
});

it("renders own screenshots with their caption and without Unsplash credit", () => {
  const own = {
    slug: "bai-thu",
    file: "screenshot.webp",
    source: "own",
    role: "inline",
    alt: "Form xác nhận minh hoạ",
    caption: "Ảnh: Hẹn Ước — dữ liệu demo.",
  };
  const [image] = parseArticleImages([own]);
  const html = renderToStaticMarkup(createElement(ArticleImage, { image: image! }));
  expect(html).toContain(own.caption);
  expect(html).toContain(own.alt);
  expect(html).toContain("object-contain");
  expect(html).not.toContain("unsplash.com");
  expect(() => parseArticleImages([{ ...own, caption: "" }])).toThrow();
  expect(() => parseArticleImages([{ ...own, cdnPath: "photo-invalid" }])).toThrow();
});
