import { describe, expect, it } from "vitest";
import { themeRegistry } from "@/themes/registry";
import {
  MIN_STYLE_FAQ,
  isStyleIndexable,
  themeStyles,
  themes,
  type Theme,
  type ThemeStyle,
} from "./themes";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Bảng chốt docs/12-THEME-CATALOG.md §2: phong cách → [mẫu 1, mẫu 2] (phong cách chính).
const TABLE: Record<string, [string, string]> = {
  "truyen-thong-viet": ["song-hy-do-son", "dong-duong"],
  "toi-gian": ["ivory-editorial", "black-white"],
  "sang-trong": ["royal-gold", "champagne"],
  "lang-man-hoa-la": ["blush-rose", "botanical-garden"],
  "han-quoc-nhat-ban": ["seoul-romance", "sakura-zen"],
  rustic: ["rustic-garden", "bohemian"],
  "co-dien-hoai-niem": ["sai-gon-xua", "vintage-newspaper"],
  bien: ["ocean-promise", "travel-postcard"],
  "hien-dai-nghe-thuat": ["modern-editorial", "colorful-pop"],
  "de-thuong": ["chibi-couple", "illustrated-love"],
};

// 6 mẫu cũ giữ nguyên mô tả (docs/12 §3) nên có thể ngắn hơn 80 chữ.
const MIGRATED = new Set([
  "song-hy-do-son",
  "blush-rose",
  "modern-editorial",
  "seoul-romance",
  "botanical-garden",
  "sai-gon-xua",
]);

const wordCount = (s: string) => s.trim().split(/\s+/).length;

describe("catalog mẫu thiệp", () => {
  it("slug kebab-case, không trùng trong và giữa hai danh sách", () => {
    const all = [...themeStyles.map((s) => s.slug), ...themes.map((t) => t.slug)];
    for (const slug of all) expect(slug).toMatch(KEBAB);
    expect(new Set(all).size).toBe(all.length);
  });

  it("đúng 10 phong cách và 20 mẫu theo bảng", () => {
    expect(themeStyles.map((s) => s.slug).sort()).toEqual(Object.keys(TABLE).sort());
    expect(themes.map((t) => t.slug).sort()).toEqual(Object.values(TABLE).flat().sort());
  });

  it("styles[0] khớp phong cách chính theo bảng, mọi style tồn tại", () => {
    const styleSlugs = new Set(themeStyles.map((s) => s.slug));
    for (const [style, slugs] of Object.entries(TABLE)) {
      for (const slug of slugs) {
        expect(themes.find((t) => t.slug === slug)?.styles[0]).toBe(style);
      }
    }
    for (const t of themes) {
      expect(t.styles.length).toBeGreaterThan(0);
      expect(new Set(t.styles).size).toBe(t.styles.length);
      for (const s of t.styles) expect(styleSlugs.has(s)).toBe(true);
    }
  });

  it("mô tả 80–150 chữ, palette 3–4 mã hex, có tính năng", () => {
    for (const t of themes) {
      const n = wordCount(t.description);
      expect(n, t.slug).toBeGreaterThanOrEqual(MIGRATED.has(t.slug) ? 50 : 80);
      expect(n, t.slug).toBeLessThanOrEqual(150);
      expect(t.palette.length).toBeGreaterThanOrEqual(3);
      expect(t.palette.length).toBeLessThanOrEqual(4);
      for (const c of t.palette) expect(c).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(t.features.length).toBeGreaterThan(0);
    }
  });

  it("mẫu published phải có trong themeRegistry", () => {
    for (const t of themes.filter((x) => x.status === "published")) {
      expect(themeRegistry[t.slug], t.slug).toBeDefined();
    }
  });
});

describe("từ khoá đã chốt", () => {
  const style = (slug: string) => themeStyles.find((s) => s.slug === slug);

  it("rustic, bien có keyword và từ khoá phụ", () => {
    expect(style("rustic")?.keyword).toBe("thiệp cưới rustic");
    expect(style("rustic")?.secondaryKeywords).toEqual(["mộc mạc", "boho"]);
    expect(style("bien")?.keyword).toBe("thiệp cưới phong cách biển");
    expect(style("bien")?.secondaryKeywords).toEqual(["du lịch", "destination"]);
  });

  it("de-thuong: title và H1 chứa keyword lẫn chibi", () => {
    const s = style("de-thuong");
    expect(s?.keyword).toBe("thiệp cưới dễ thương");
    expect(s?.title).toBe("Thiệp cưới dễ thương, chibi đẹp · Hẹn Ước");
    expect(s?.h1).toBe("Mẫu thiệp cưới dễ thương, chibi");
    for (const text of [s?.title, s?.h1]) {
      expect(text?.toLowerCase()).toContain("dễ thương");
      expect(text?.toLowerCase()).toContain("chibi");
    }
  });
});

describe("isStyleIndexable", () => {
  const style: ThemeStyle = {
    slug: "toi-gian",
    name: "Test",
    keyword: "thiệp cưới test",
    intro: "Giới thiệu.",
    faq: Array.from({ length: MIN_STYLE_FAQ }, (_, i) => ({ q: `Hỏi ${i}`, a: `Đáp ${i}` })),
  };
  const published = (slug: string): Theme => ({
    ...themes[0]!,
    slug,
    styles: ["toi-gian"],
    status: "published",
  });

  it("1 mẫu published (đủ FAQ) → không index", () => {
    expect(isStyleIndexable(style, [published("a")])).toBe(false);
  });
  it("2 mẫu published nhưng thiếu FAQ hoặc intro → không index", () => {
    const two = [published("a"), published("b")];
    expect(isStyleIndexable({ ...style, faq: style.faq.slice(0, 2) }, two)).toBe(false);
    expect(isStyleIndexable({ ...style, intro: " " }, two)).toBe(false);
  });
  it("2 mẫu published + intro + đủ FAQ → index", () => {
    expect(isStyleIndexable(style, [published("a"), published("b")])).toBe(true);
  });
});
