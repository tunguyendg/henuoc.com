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
// next/font/google only works inside the Next compiler; here it is replaced by empty class names.
vi.mock("./blush-rose/fonts", () => ({ fontVariables: "" }));

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

describe("blush-rose theme", () => {
  async function render(options: unknown = {}, contentPatch: Partial<WeddingContent> = {}) {
    const entry = themeRegistry["blush-rose"];
    if (!entry) throw new Error("blush-rose theme missing");
    const { default: Theme } = await entry.load();
    const content = { ...(await getDemoContent()), ...contentPatch };
    return renderToStaticMarkup(createElement(Theme, { content, options, mode: "demo" }));
  }

  it("11 section có data-section đúng thứ tự", async () => {
    const html = await render({ dressCode: ["#4A161A"] });
    const names = [...html.matchAll(/data-section="([a-z-]+)"/g)].map((m) => m[1]);
    expect(names).toEqual([
      "cover",
      "names",
      "ceremony",
      "album",
      "reception",
      "timeline",
      "venue",
      "dress-code",
      "rsvp",
      "gift",
      "thanks",
    ]);
    expect(html).toContain('id="xac-nhan"');
    expect(html).toContain('href="#xac-nhan"');
  });

  it("palette mặc định do-do; hong-nhat được áp lên wrapper; không có dressCode thì ẩn section", async () => {
    expect(await render({})).toContain('data-palette="do-do"');
    const pink = await render({ palette: "hong-nhat" });
    expect(pink).toContain('data-palette="hong-nhat"');
    expect(pink).not.toContain('data-section="dress-code"');
  });

  it("luôn có credit Redouté; lịch trái tim khoanh đúng ngày tiệc", async () => {
    const html = await render({});
    expect(html).toContain("Pierre-Joseph Redouté");
    expect(html).toContain("Tháng 10 năm 2027, ngày 17 được khoanh");
  });

  it("thẻ lễ cưới: thứ bậc, âm lịch tính từ startsAt", async () => {
    const html = await render({});
    expect(html).toContain("Trưởng nam");
    expect(html).toContain("Út nữ");
    expect(html).toContain("(Tức ngày 17 tháng 9 năm Đinh Mùi)");
    expect(html).toContain("(Tức ngày 18 tháng 9 năm Đinh Mùi)");
    expect(html).toContain("Trân trọng báo tin lễ thành hôn của con chúng tôi");
    expect(html).toContain("Đón khách");
    expect(html).toContain("Khai tiệc");
  });

  it("dress code chỉ có chấm màu, không in mã hex, có aria-label tên màu", async () => {
    const html = await render({ dressCode: ["#4A161A", "#E8B9C3", "#F3EDE3"] });
    expect(html).not.toContain(">#4A161A<");
    expect(html).toContain('aria-label="Gợi ý màu trang phục: đỏ đô, hồng nhạt, kem"');
    expect(html).toContain('aria-label="hồng nhạt"');
  });

  it("sections.dressCode=false ẩn dress code; sections.timeline=false ẩn lịch trình", async () => {
    const base = await getDemoContent();
    const noDress = await render(
      { dressCode: ["#4A161A"] },
      { sections: { ...base.sections, dressCode: false } },
    );
    expect(noDress).not.toContain('data-section="dress-code"');
    const noTimeline = await render({}, { sections: { ...base.sections, timeline: false } });
    expect(noTimeline).not.toContain('data-section="timeline"');
    expect(await render({})).toContain("Giao lưu &amp; tiễn khách");
  });

  it("không có key Maps thì không nhúng iframe, vẫn có nút Chỉ đường", async () => {
    const html = await render({});
    expect(html).not.toContain("<iframe");
    expect(html).toContain("Chỉ đường");
  });
});

describe("demoContent", () => {
  it("có đúng 3 sự kiện: vu quy, thành hôn, tiệc", () => {
    expect(demoContent.events).toHaveLength(3);
    expect(demoContent.events.map((e) => e.kind)).toEqual(["vu-quy", "thanh-hon", "tiec"]);
  });

  it("có ít nhất 3 ảnh album, mỗi ảnh có alt không rỗng và kích thước dương", () => {
    expect(demoContent.album.length).toBeGreaterThanOrEqual(3);
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
