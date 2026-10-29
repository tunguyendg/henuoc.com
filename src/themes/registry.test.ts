import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getTracks } from "@/data/music";
import { isAllowedImageUrl, isAllowedMapUrl, isAllowedMusicUrl } from "@/lib/url-allowlist";
import { crc16Ccitt } from "@/lib/vietqr";
import { demoContent, getDemoContent } from "./_demo/content";
import { getThemeEntry, themeRegistry, themeSlugs } from "./registry";
import type { EventView, FamilySide, GuestContext, ThemeProps, WeddingContent } from "./types";

// "server-only" only means something inside the Next bundler → empty module in Vitest
vi.mock("server-only", () => ({}));
// next/font/google only works inside the Next compiler; here it is replaced by empty class names.
vi.mock("./blush-rose/fonts", () => ({ fontVariables: "" }));

const entries = Object.entries(themeRegistry);
const sides: FamilySide[] = ["nha-gai", "nha-trai"];

async function renderBlush(side: FamilySide, contentPatch: Partial<WeddingContent> = {}) {
  const { default: Theme } = await themeRegistry["blush-rose"]!.load();
  const content = { ...(await getDemoContent()), ...contentPatch };
  return renderToStaticMarkup(createElement(Theme, { content, options: {}, mode: "demo", side }));
}

async function renderPlaceholder(
  side: FamilySide,
  overrides: Partial<ThemeProps> = {},
  contentPatch: Partial<WeddingContent> = {},
) {
  const { default: Theme } = await themeRegistry["placeholder"]!.load();
  const content = { ...(await getDemoContent()), ...contentPatch };
  return renderToStaticMarkup(
    createElement(Theme, { content, options: {}, mode: "demo", side, ...overrides }),
  );
}

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
        createElement(Theme, { content, options: "sai-kieu", mode: "demo", side: "nha-gai" }),
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
      createElement(Theme, { content, options: {}, mode: "demo", side: "nha-gai", ...overrides }),
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
      invitedEventIds: ["demo-vu-quy"],
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
  async function render(
    options: unknown = {},
    contentPatch: Partial<WeddingContent> = {},
    side: FamilySide = "nha-gai",
  ) {
    const entry = themeRegistry["blush-rose"];
    if (!entry) throw new Error("blush-rose theme missing");
    const { default: Theme } = await entry.load();
    const content = { ...(await getDemoContent()), ...contentPatch };
    return renderToStaticMarkup(createElement(Theme, { content, options, mode: "demo", side }));
  }

  it("10 section có data-section đúng thứ tự", async () => {
    const html = await render({ dressCode: ["#4A161A"] });
    const names = [...html.matchAll(/data-section="([a-z-]+)"/g)].map((m) => m[1]);
    expect(names).toEqual([
      "cover",
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

  it("luôn có credit Redouté", async () => {
    expect(await render({})).toContain("Pierre-Joseph Redouté");
  });

  it("thẻ lễ cưới: thứ bậc, âm lịch tính từ startsAt", async () => {
    const html = await render({});
    expect(html).toContain("Trưởng nam");
    expect(html).toContain("Út nữ");
    expect(html).toContain("(Tức ngày 17 tháng 9 năm Đinh Mùi)");
    expect(html).not.toContain("(Tức ngày 18 tháng 9 năm Đinh Mùi)");
    expect(html).toContain("Trân trọng báo tin lễ vu quy của con chúng tôi");
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

describe.each(sides)("blush-rose theme, thiệp %s", (side) => {
  const isGai = side === "nha-gai";
  const render = (patch: Partial<WeddingContent> = {}) => renderBlush(side, patch);
  const own = isGai
    ? {
        hostFirst: "Minh Anh & Hoàng Nam",
        hostParents: "Ông Nguyễn Văn Hùng · Bà Lê Thị Thu",
        otherParents: "Ông Trần Quốc Bảo · Bà Phạm Thị Lan",
        rite: "Lễ Vu Quy",
        otherRite: "Lễ Tân Hôn",
        announcement: "Trân trọng báo tin lễ vu quy của con chúng tôi",
        otherAnnouncement: "lễ tân hôn",
        venue: "Ngọc Lan",
        otherVenue: "Hồng Ngà",
        otherHome: "Tư gia nhà trai",
        day: 16,
      }
    : {
        hostFirst: "Hoàng Nam & Minh Anh",
        hostParents: "Ông Trần Quốc Bảo · Bà Phạm Thị Lan",
        otherParents: "Ông Nguyễn Văn Hùng · Bà Lê Thị Thu",
        rite: "Lễ Tân Hôn",
        otherRite: "Lễ Vu Quy",
        announcement: "Trân trọng báo tin lễ tân hôn của con chúng tôi",
        otherAnnouncement: "lễ vu quy",
        venue: "Hồng Ngà",
        otherVenue: "Ngọc Lan",
        otherHome: "Tư gia nhà gái",
        day: 17,
      };

  it("tên trong <h1> đặt người của nhà mình trước", async () => {
    const html = await render();
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1];
    expect(h1).toBe(own.hostFirst.replace("&", "&amp;"));
  });

  it("cột bố mẹ đặt nhà mình trước nhưng luôn có đủ hai họ", async () => {
    const html = await render();
    // Ceremony card prints each parent on its own line (split on "·"): match the first name.
    const host = html.indexOf(own.hostParents.split(" · ")[0]!);
    const other = html.indexOf(own.otherParents.split(" · ")[0]!);
    expect(host).toBeGreaterThan(-1);
    expect(other).toBeGreaterThan(-1);
    expect(host).toBeLessThan(other);
  });

  it("tên lễ và lời báo tin theo bên mình, không lẫn lễ của bên kia", async () => {
    const html = await render();
    expect(html).toContain(own.rite);
    expect(html).toContain(own.announcement);
    expect(html).not.toContain(own.otherRite);
    expect(html).not.toContain(own.otherAnnouncement);
  });

  it("không lộ nơi tổ chức của bên kia, chỉ có nơi của mình", async () => {
    const html = await render();
    expect(html).toContain(own.venue);
    expect(html).not.toContain(own.otherVenue);
    expect(html).not.toContain(own.otherHome);
  });

  it("lịch trái tim khoanh đúng ngày của bên mình", async () => {
    expect(await render()).toContain(`Tháng 10 năm 2027, ngày ${own.day} được khoanh`);
  });

  it("trang bìa không in dòng ngày tháng", async () => {
    const html = await render();
    const cover = html.match(/data-section="cover"[\s\S]*?(?=data-section="ceremony")/)?.[0] ?? "";
    const text = cover.replace(/<[^>]*>/g, " ");
    expect(text).toContain("Thiệp cưới");
    expect(text).not.toMatch(/2027|Tháng|\d{1,2}[./]\d{1,2}/);
  });
});

describe("placeholder theme theo bên", () => {
  const eventsOf = (html: string) => [...html.matchAll(/<h3[^>]*>([^<]*)<\/h3>/g)].map((m) => m[1]);

  it.each(sides)(
    "thiệp %s hiện đúng sự kiện của mình, đúng thứ tự, không lẫn bên kia",
    async (side) => {
      const html = await renderPlaceholder(side);
      const titles = eventsOf(html);
      expect(titles).toEqual(
        side === "nha-gai"
          ? ["Lễ Vu Quy", "Tiệc Cưới Nhà Gái"]
          : ["Lễ Tân Hôn", "Tiệc Cưới Nhà Trai"],
      );
      expect(html).not.toContain(side === "nha-gai" ? "Hồng Ngà" : "Ngọc Lan");
    },
  );

  it.each(sides)("thiệp %s: tên người nhà mình đứng trước", async (side) => {
    const html = await renderPlaceholder(side);
    const a = html.indexOf("Minh Anh");
    const b = html.indexOf("Hoàng Nam");
    expect(a).toBeGreaterThan(-1);
    expect(b).toBeGreaterThan(-1);
    expect(side === "nha-gai" ? a < b : b < a).toBe(true);
  });

  it.each(sides)("thiệp %s vẫn render khi có sự kiện chung của cả hai họ", async (side) => {
    const base = await getDemoContent();
    const chung: EventView = {
      ...base.events[0]!,
      id: "demo-chung",
      kind: "an-hoi",
      title: "Tiệc Chung Vui",
      side: "chung",
    };
    const html = await renderPlaceholder(side, {}, { events: [...base.events, chung] });
    expect(eventsOf(html)).toContain("Tiệc Chung Vui");
  });

  it("khách chỉ được mời sự kiện của bên kia thì sự kiện đó bị ẩn", async () => {
    const guest: GuestContext = {
      salutation: "Anh Bình",
      invitedEventIds: ["demo-vu-quy", "demo-tan-hon"],
      maxAttendees: 2,
      token: "tok_X",
    };
    const html = await renderPlaceholder("nha-gai", { guest });
    expect(eventsOf(html)).toEqual(["Lễ Vu Quy"]);
    expect(html).not.toContain("Lễ Tân Hôn");
  });
});

describe("demoContent", () => {
  it("có đúng 4 sự kiện: vu quy + tiệc nhà gái, tân hôn + tiệc nhà trai", () => {
    expect(demoContent.events.map((e) => [e.kind, e.side])).toEqual([
      ["vu-quy", "nha-gai"],
      ["tiec", "nha-gai"],
      ["tan-hon", "nha-trai"],
      ["tiec", "nha-trai"],
    ]);
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
