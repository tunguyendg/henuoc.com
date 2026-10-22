import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { crc16Ccitt } from "@/lib/vietqr";
import { demoContent } from "./_demo/content";
import { getThemeEntry, themeRegistry, themeSlugs } from "./registry";

const entries = Object.entries(themeRegistry);

describe("themeRegistry", () => {
  it("có ít nhất một theme và themeSlugs khớp key registry", () => {
    expect(entries.length).toBeGreaterThan(0);
    expect([...themeSlugs]).toEqual(Object.keys(themeRegistry));
  });

  it.each(entries)("key '%s' trùng manifest.slug và có dạng kebab-case", (key, entry) => {
    expect(entry.manifest.slug).toBe(key);
    expect(key).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it.each(entries)("'%s' có version là số nguyên ≥ 1", (_key, entry) => {
    expect(Number.isInteger(entry.manifest.version)).toBe(true);
    expect(entry.manifest.version).toBeGreaterThanOrEqual(1);
  });

  it.each(entries)("defaultOptions của '%s' parse được qua optionsSchema", (_key, entry) => {
    const result = entry.manifest.optionsSchema.safeParse(entry.manifest.defaultOptions);
    expect(result.success).toBe(true);
  });

  it.each(entries)("load() của '%s' trả default là function", async (_key, entry) => {
    const mod = await entry.load();
    expect(typeof mod.default).toBe("function");
  });

  it.each(entries)(
    "load() của '%s' được memo: hai lần gọi trả cùng component",
    async (_k, entry) => {
      expect((await entry.load()).default).toBe((await entry.load()).default);
    },
  );

  it.each(entries)(
    "'%s' render được với options sai kiểu (fallback defaultOptions, không lộ qrPayload)",
    async (_key, entry) => {
      const { default: Theme } = await entry.load();
      const html = renderToStaticMarkup(
        createElement(Theme, { content: demoContent, options: "sai-kieu", mode: "demo" }),
      );
      expect(html).toContain("Minh Anh");
      expect(html).not.toContain("000201");
    },
  );

  it("getThemeEntry trả undefined với slug lạ", () => {
    expect(getThemeEntry("khong-ton-tai")).toBeUndefined();
    expect(getThemeEntry("toString")).toBeUndefined();
    expect(getThemeEntry("__proto__")).toBeUndefined();
  });
});

describe("demoContent", () => {
  it("có đúng 2 sự kiện: vu quy và thành hôn", () => {
    expect(demoContent.events).toHaveLength(2);
    expect(demoContent.events.map((e) => e.kind)).toEqual(["vu-quy", "thanh-hon"]);
  });

  it("có 8 ảnh album, mỗi ảnh có alt không rỗng và kích thước dương", () => {
    expect(demoContent.album).toHaveLength(8);
    for (const image of demoContent.album) {
      expect(image.alt.trim()).not.toBe("");
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
    }
  });

  it("mọi gift.qrPayload kết thúc bằng CRC hợp lệ", () => {
    expect(demoContent.gifts.length).toBeGreaterThan(0);
    for (const gift of demoContent.gifts) {
      expect(gift.qrPayload.slice(-8, -4)).toBe("6304");
      expect(gift.qrPayload.slice(-4)).toBe(crc16Ccitt(gift.qrPayload.slice(0, -4)));
    }
  });
});
