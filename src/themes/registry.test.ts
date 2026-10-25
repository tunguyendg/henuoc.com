import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getTracks } from "@/data/music";
import { isAllowedImageUrl, isAllowedMapUrl, isAllowedMusicUrl } from "@/lib/url-allowlist";
import { crc16Ccitt } from "@/lib/vietqr";
import { demoContent, getDemoContent } from "./_demo/content";
import { getThemeEntry, themeRegistry, themeSlugs } from "./registry";
import type { GuestContext, ThemeProps, WeddingContent } from "./types";

// "server-only" only means something inside the Next bundler → empty module in Vitest
vi.mock("server-only", () => ({}));

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
      const content = await getDemoContent();
      const html = renderToStaticMarkup(
        createElement(Theme, { content, options: "sai-kieu", mode: "demo" }),
      );
      expect(html).toContain("Minh Anh");
      // qrPayload never leaves the server; account numbers only appear once the gift sheet opens.
      expect(html).not.toContain("000201");
      for (const gift of content.gifts) {
        expect(html).not.toContain(gift.accountNumber);
      }
    },
  );

  it("getThemeEntry trả undefined với slug lạ", () => {
    expect(getThemeEntry("khong-ton-tai")).toBeUndefined();
    expect(getThemeEntry("toString")).toBeUndefined();
    expect(getThemeEntry("__proto__")).toBeUndefined();
  });
});

describe("placeholder theme: hành trình khách", () => {
  async function render(
    overrides: Partial<ThemeProps> = {},
    contentPatch: Partial<WeddingContent> = {},
  ) {
    const entry = themeRegistry["placeholder"];
    if (!entry) throw new Error("placeholder theme missing");
    const { default: Theme } = await entry.load();
    const content = { ...(await getDemoContent()), ...contentPatch };
    return renderToStaticMarkup(
      createElement(Theme, { content, options: {}, mode: "demo", ...overrides }),
    );
  }

  it("các phần xuất hiện đúng thứ tự §10", async () => {
    const html = await render();
    const marks = [
      ">Lời mời<",
      ">Sự kiện<",
      ">Đếm ngược<",
      ">Album<",
      ">Xác nhận tham dự<",
      ">Mừng cưới<",
      ">Cảm ơn bạn!<",
    ];
    const positions = marks.map((m) => html.indexOf(m));
    for (const [i, pos] of positions.entries()) expect(pos, marks[i]).toBeGreaterThan(-1);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("khách có token: hiện danh xưng, không lộ token", async () => {
    const guest: GuestContext = {
      salutation: "Trân trọng kính mời Anh Minh & Gia đình",
      invitedEventIds: ["demo-thanh-hon"],
      maxAttendees: 2,
      token: "tok_SECRET_123",
    };
    const html = await render({ guest, mode: "live" });
    expect(html).toContain("Anh Minh &amp; Gia đình");
    expect(html).not.toContain("tok_SECRET_123");
    expect(html).not.toContain("SECRET");
  });

  it("showWatermark vẫn hiện khi tắt phần thanks", async () => {
    const base = await getDemoContent();
    const html = await render(
      {},
      { showWatermark: true, sections: { ...base.sections, thanks: false } },
    );
    expect(html).toContain("Thiệp tạo bằng");
    expect(html).not.toContain("Cảm ơn bạn!");
  });

  it("nhạc từ host lạ bị bỏ: không có nút Bật nhạc", async () => {
    const bad = await render({}, { music: { src: "https://evil.com/a.mp3", title: "x" } });
    expect(bad).not.toContain("Bật nhạc");
    const good = await render();
    expect(good).toContain("Bật nhạc");
  });

  it("musicSlug chọn đúng bài và credit CC-BY từ kho", async () => {
    const html = await render({ options: { musicSlug: "kevin-there-is-romance" } });
    expect(html).toContain("There is Romance Kevin MacLeod");
    expect(html).toContain("https://creativecommons.org/licenses/by/4.0/");
    expect(html).not.toContain("Canon in D — United States Air Force Band");
  });

  it.each(getTracks({ enabled: true }))(
    "$slug: chỉ CC-BY-4.0 hiện credit cuối thiệp",
    async (track) => {
      const html = await render({ options: { musicSlug: track.slug } });
      expect(html.includes("Nhạc nền")).toBe(track.license === "CC-BY-4.0");
      if (track.license === "CC-BY-4.0") {
        expect(html).toContain(
          `Nhạc nền (đã chỉnh sửa): ${track.credit!.trim().replace(/\s+/g, " ")}`,
        );
        expect(html.indexOf("Nhạc nền")).toBeGreaterThan(html.indexOf("Thiệp tạo bằng"));
      }
    },
  );

  it("credit CC-BY vẫn hiện khi tắt watermark và thanks", async () => {
    const base = await getDemoContent();
    const html = await render(
      { options: { musicSlug: "kevin-there-is-romance" } },
      { showWatermark: false, sections: { ...base.sections, thanks: false } },
    );
    expect(html).toContain("Nhạc nền (đã chỉnh sửa):");
    expect(html).not.toContain("Thiệp tạo bằng");
    expect(html).not.toContain("Cảm ơn bạn!");
  });

  it("preview không hiện nút nhạc hoặc credit của bài đã chọn", async () => {
    const html = await render({
      mode: "preview",
      options: { musicSlug: "kevin-there-is-romance" },
    });
    expect(html).not.toContain("Bật nhạc");
    expect(html).not.toContain("There is Romance Kevin MacLeod");
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

  it("ảnh, nhạc và link bản đồ đều qua allowlist", () => {
    const images = [...demoContent.album, ...(demoContent.cover ? [demoContent.cover] : [])];
    for (const image of images) expect(isAllowedImageUrl(image.src)).toBe(true);
    expect(demoContent.music).toBeDefined();
    expect(isAllowedMusicUrl(demoContent.music?.src ?? "")).toBe(true);
    const mapUrls = demoContent.events.flatMap((e) => (e.mapUrl ? [e.mapUrl] : []));
    expect(mapUrls.length).toBeGreaterThan(0);
    for (const url of mapUrls) expect(isAllowedMapUrl(url)).toBe(true);
  });

  it("getDemoContent điền qrSvg dạng data URI SVG cho mọi gift", async () => {
    const content = await getDemoContent();
    expect(content.gifts).toHaveLength(demoContent.gifts.length);
    for (const gift of content.gifts) {
      expect(gift.qrSvg?.startsWith("data:image/svg+xml;base64,")).toBe(true);
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
