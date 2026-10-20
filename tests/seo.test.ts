import { describe, expect, it } from "vitest";
import { articles } from "@/data/articles";
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

describe("Cẩm nang (src/data/articles.ts)", () => {
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  const isRealDate = (d: string) => new Date(`${d}T00:00:00Z`).toISOString().startsWith(d);

  it("slug không trùng", () => {
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
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
