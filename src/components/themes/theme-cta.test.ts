import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getTheme } from "@/data/themes";
import { ThemeCta } from "./theme-cta";

afterEach(() => {
  vi.unstubAllEnvs();
});

const render = (slug: string) =>
  renderToStaticMarkup(createElement(ThemeCta, { theme: getTheme(slug)! }));

describe("ThemeCta", () => {
  it("live + production: xem demo, nút tạo thiệp bị khoá kèm lời giải thích", () => {
    vi.stubEnv("NODE_ENV", "production");
    const html = render("blush-rose");
    expect(html).toContain('href="/demo/blush-rose"');
    expect(html).toContain("Xem thiệp thực tế");
    expect(html).toMatch(/<button[^>]*disabled[^>]*>Sắp mở tạo thiệp<\/button>/);
    expect(html).toContain(
      "Hẹn Ước đang hoàn thiện phần tạo thiệp, hai bạn xem trước mẫu này nhé.",
    );
    expect(html).toContain('aria-describedby="theme-cta-helper"');
    expect(html).toContain('id="theme-cta-helper"');
    expect(html).not.toContain("/tao-thiep");
    expect(html).not.toContain("Dùng mẫu này");
  });

  it("live + development: có link tạo thiệp theo mẫu, không có helper", () => {
    vi.stubEnv("NODE_ENV", "development");
    const html = render("blush-rose");
    expect(html).toContain('href="/demo/blush-rose"');
    expect(html).toContain('href="/tao-thiep?mau=blush-rose"');
    expect(html).toContain("Dùng mẫu này");
    expect(html).not.toContain("Sắp mở tạo thiệp");
    expect(html).not.toContain("Hẹn Ước đang hoàn thiện");
  });

  it("không live: chỉ nút Sắp ra mắt, không có link demo", () => {
    for (const env of ["production", "development"]) {
      vi.stubEnv("NODE_ENV", env);
      const html = render("botanical-garden");
      expect(html).toContain("Sắp ra mắt");
      expect(html).not.toContain("/demo/");
      expect(html).not.toContain("/tao-thiep");
    }
  });
});
