import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getTracks } from "@/data/music";
import { isAllowedImageUrl, isAllowedMapUrl, isAllowedMusicUrl } from "@/lib/url-allowlist";
import { crc16Ccitt } from "@/lib/vietqr";
import { demoContent, demoGuests, getDemoContent } from "./_demo/content";
import { thanksLine } from "./_shared/invitation-wording";
import { getThemeEntry, themeRegistry, themeSlugs } from "./registry";
import type {
  EventView,
  FamilySide,
  GuestContext,
  InvitationKind,
  ThemeProps,
  WeddingContent,
} from "./types";

// The envelope overlay renders only after hydration (useHydrated). Tests that check the envelope
// text flip `hydration.on`; every other test sees the server render (no overlay).
const hydration = vi.hoisted(() => ({ on: false }));
vi.mock("./_shared/use-client-env", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./_shared/use-client-env")>()),
  useHydrated: () => hydration.on,
}));
afterEach(() => {
  hydration.on = false;
});

// "server-only" only means something inside the Next bundler → empty module in Vitest
vi.mock("server-only", () => ({}));
// next/font/google only works inside the Next compiler; here it is replaced by empty class names.
vi.mock("./blush-rose/fonts", () => ({ fontVariables: "" }));

const entries = Object.entries(themeRegistry);
const sides: FamilySide[] = ["nha-gai", "nha-trai"];
const kinds: InvitationKind[] = ["nha-gai", "nha-trai", "bao-hy"];

async function renderBlush(
  side: InvitationKind,
  contentPatch: Partial<WeddingContent> = {},
  guest?: GuestContext,
) {
  const { default: Theme } = await themeRegistry["blush-rose"]!.load();
  const content = { ...(await getDemoContent(side)), ...contentPatch };
  return renderToStaticMarkup(
    createElement(Theme, { content, options: {}, mode: "demo", side, guest }),
  );
}

async function renderPlaceholder(
  side: InvitationKind,
  overrides: Partial<ThemeProps> = {},
  contentPatch: Partial<WeddingContent> = {},
) {
  const { default: Theme } = await themeRegistry["placeholder"]!.load();
  const content = { ...(await getDemoContent(side)), ...contentPatch };
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

  it("không có khách lẫn inviteMessage: ẩn hẳn mục Lời mời", async () => {
    expect(await render()).not.toContain(">Lời mời<");
    expect(await render({}, { inviteMessage: "Lời nhắn thử" })).toContain("Lời nhắn thử");
  });

  it("các phần xuất hiện đúng thứ tự §10", async () => {
    const html = await render({}, { inviteMessage: "Lời nhắn thử" });
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
      honorific: "Anh",
      name: "Minh",
      companion: "& Gia đình",
      invitedEventIds: ["demo-vu-quy"],
      maxAttendees: 2,
      token: "tok_SECRET_123",
    };
    hydration.on = true;
    const html = await render({ guest, mode: "live" });
    expect(html).toContain("Kính gửi: Anh Minh");
    expect(html).toContain("Trân trọng kính mời: Anh Minh &amp; Gia đình");
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
    side: InvitationKind = "nha-gai",
    guest?: GuestContext,
  ) {
    const entry = themeRegistry["blush-rose"];
    if (!entry) throw new Error("blush-rose theme missing");
    const { default: Theme } = await entry.load();
    const content = { ...(await getDemoContent()), ...contentPatch };
    return renderToStaticMarkup(
      createElement(Theme, { content, options, mode: "demo", side, guest }),
    );
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
    expect(html).toContain("Trân trọng báo tin Lễ Vu Quy của hai con chúng tôi");
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
    expect(await render({})).toContain("Cắt bánh &amp; nâng ly");
  });

  describe("lời mời trên trang bìa", () => {
    const coverOf = (html: string) =>
      html.match(/data-section="cover"[\s\S]*?(?=data-section="ceremony")/)?.[0] ?? "";
    const esc = (text: string) => text.replace(/&/g, "&amp;");

    it("phần cảm ơn: hoa nằm trước Reveal, không có overflow-hidden bọc hoa", async () => {
      const html = await renderBlush("nha-gai");
      const thanks = html.slice(html.indexOf('data-section="thanks"'));
      expect(thanks.slice(0, thanks.indexOf("Cảm ơn"))).toContain("rosa-carolina-corymbosa");
      expect(thanks.slice(0, thanks.indexOf("Cảm ơn"))).not.toContain("overflow-hidden");
    });

    it.each(kinds)("%s: câu cảm ơn theo loại thiệp, xưng 'chúng tôi' toàn thiệp", async (kind) => {
      const html = await renderBlush(kind, {}, demoGuests[kind]);
      const thanks = html.slice(html.indexOf('data-section="thanks"'));
      expect(thanks).toContain(thanksLine(kind));
      // Split so a repo-wide grep for the banned wording stays clean.
      const banned = ["chúng", "mình"].join(" ");
      expect(html.normalize("NFC").toLocaleLowerCase("vi")).not.toContain(banned);
    });

    it("không có khách: không có dòng mời, dòng tới dự, phong bì, inviteMessage", async () => {
      // Báo hỷ is the demo that has a message: it must stay hidden without a guest.
      const message = (await getDemoContent("bao-hy")).inviteMessage!;
      const html = await renderBlush("bao-hy");
      expect(html).not.toContain(message);
      expect(html).not.toContain("Trân trọng kính mời:");
      expect(html).not.toContain("tới dự Lễ");
      expect(html).not.toContain("Kính gửi:");
    });

    it.each(kinds)(
      "có khách (%s): dòng mời rồi dòng tới dự ngay sau h1, rồi inviteMessage",
      async (kind) => {
        const guest = demoGuests[kind];
        hydration.on = true;
        const html = await renderBlush(kind, {}, guest);
        const afterH1 = coverOf(html).slice(coverOf(html).indexOf("</h1>"));
        const invite = esc(
          `Trân trọng kính mời: ${[guest.honorific, guest.name, guest.companion].filter(Boolean).join(" ")}`,
        );
        const attend = {
          "nha-gai": "tới dự Lễ Vu Quy của hai con chúng tôi",
          "nha-trai": "tới dự Lễ Thành Hôn của hai con chúng tôi",
          "bao-hy": "tới dự Lễ Thành Hôn của chúng tôi",
        }[kind];
        const i = afterH1.indexOf(invite);
        expect(i).toBeGreaterThan(-1);
        expect(afterH1.indexOf(attend)).toBeGreaterThan(i);
        const message = (await getDemoContent(kind)).inviteMessage;
        if (kind === "bao-hy") {
          expect(afterH1.indexOf(message!)).toBeGreaterThan(afterH1.indexOf(attend));
        } else {
          expect(message).toBeUndefined();
          // Nothing follows the attend line in the cover.
          expect(afterH1.slice(afterH1.indexOf(attend)).match(/<p/g)).toBeNull();
        }
        // envelope line has no companion
        expect(html).toContain(`Kính gửi: ${guest.honorific} ${guest.name}<`);
        expect(html).not.toContain(
          `Kính gửi: ${guest.honorific} ${guest.name} ${esc(guest.companion ?? "x")}`,
        );
        expect(html).not.toContain(guest.token);
      },
    );

    it("có khách nhưng sections.invitation=false: bìa không có dòng mời lẫn inviteMessage", async () => {
      const base = await getDemoContent("bao-hy");
      const html = await renderBlush(
        "bao-hy",
        { sections: { ...base.sections, invitation: false } },
        demoGuests["bao-hy"],
      );
      const cover = coverOf(html);
      expect(cover).not.toContain("Trân trọng kính mời:");
      expect(cover).not.toContain("tới dự Lễ");
      expect(cover).not.toContain(base.inviteMessage);
    });
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
        announcement: "Trân trọng báo tin Lễ Vu Quy của hai con chúng tôi",
        otherAnnouncement: "Lễ Tân Hôn",
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
        announcement: "Trân trọng báo tin Lễ Tân Hôn của hai con chúng tôi",
        otherAnnouncement: "Lễ Vu Quy",
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

  it("báo hỷ không in ông bà; thiệp theo bên vẫn in đủ hai họ", async () => {
    const baoHy = await renderPlaceholder("bao-hy");
    expect(baoHy).not.toContain("Ông Nguyễn Văn Hùng");
    expect(baoHy).not.toContain("Ông Trần Quốc Bảo");
    const nhaGai = await renderPlaceholder("nha-gai");
    expect(nhaGai).toContain("Ông Nguyễn Văn Hùng");
    expect(nhaGai).toContain("Ông Trần Quốc Bảo");
  });

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
      honorific: "Anh",
      name: "Bình",
      invitedEventIds: ["demo-vu-quy", "demo-tan-hon"],
      maxAttendees: 2,
      token: "tok_X",
    };
    const html = await renderPlaceholder("nha-gai", { guest });
    expect(eventsOf(html)).toEqual(["Lễ Vu Quy"]);
    expect(html).not.toContain("Lễ Tân Hôn");
  });
});

describe("blush-rose theme, thiệp báo hỷ", () => {
  const render = (patch: Partial<WeddingContent> = {}) => renderBlush("bao-hy", patch);

  it("thẻ lễ: câu báo tin của chúng tôi, không có cột bố mẹ", async () => {
    const html = await render();
    expect(html).toContain("Trân trọng báo tin Lễ Thành Hôn của chúng tôi");
    for (const name of ["Nguyễn Văn Hùng", "Lê Thị Thu", "Trần Quốc Bảo", "Phạm Thị Lan"]) {
      expect(html).not.toContain(name);
    }
    expect(html).not.toContain("Nhà trai");
    expect(html).not.toContain("Nhà gái");
  });

  it("không có sự kiện của bên nào khác", async () => {
    const html = await render();
    for (const text of ["Lễ Vu Quy", "Lễ Tân Hôn", "Ngọc Lan"]) expect(html).not.toContain(text);
    expect(html).toContain("Lễ Thành Hôn");
    expect(html).toContain("Hồng Ngà");
  });

  it("tên trong <h1> đặt chú rể trước", async () => {
    const h1 = (await render()).match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1];
    expect(h1).toBe("Hoàng Nam &amp; Minh Anh");
  });
});

describe("placeholder theme: ba loại thiệp", () => {
  it.each(kinds)("render được thiệp %s, có khách lẫn không", async (kind) => {
    const plain = await renderPlaceholder(kind);
    expect(plain).toContain("Minh Anh");
    expect(plain).not.toContain("Trân trọng kính mời:");
    hydration.on = true;
    const html = await renderPlaceholder(kind, { guest: demoGuests[kind] });
    expect(html).toContain("Trân trọng kính mời:");
    expect(html).toContain("Kính gửi:");
    expect(html).not.toContain(demoGuests[kind].token);
  });
});

describe("demoContent", () => {
  it("lịch trình đúng 5 mốc ngắn, Khai tiệc khớp giờ khai tiệc trên thẻ", () => {
    for (const eventId of ["demo-tiec-nha-gai", "demo-tiec-nha-trai"]) {
      const steps = demoContent.timeline!.filter((step) => step.eventId === eventId);
      expect(steps.map((step) => step.title)).toEqual([
        "Đón khách",
        "Làm lễ",
        "Trao nhẫn cưới",
        "Khai tiệc",
        "Cắt bánh & nâng ly",
      ]);
      expect(steps.every((step) => step.description === undefined)).toBe(true);
      const banquet = demoContent.events.find((event) => event.id === eventId)?.banquetTimeLabel;
      expect(steps.find((step) => step.title === "Khai tiệc")?.timeLabel).toBe(banquet);
    }
  });

  it("inviteMessage: nhà gái, nhà trai để trống; báo hỷ xưng chúng tôi, gọi khách bạn", async () => {
    expect((await getDemoContent("nha-gai")).inviteMessage).toBeUndefined();
    expect((await getDemoContent("nha-trai")).inviteMessage).toBeUndefined();
    const message = (await getDemoContent("bao-hy")).inviteMessage;
    expect(message).toContain("chúng tôi");
    expect(message).toContain("bạn");
  });

  it("có đúng 4 sự kiện: vu quy + tiệc nhà gái, tân hôn + tiệc nhà trai", () => {
    expect(demoContent.events.map((e) => [e.kind, e.side])).toEqual([
      ["vu-quy", "nha-gai"],
      ["tiec", "nha-gai"],
      ["tan-hon", "nha-trai"],
      ["tiec", "nha-trai"],
    ]);
  });

  it("báo hỷ: chỉ hai sự kiện chung, lịch trình gắn với tiệc chung", async () => {
    const content = await getDemoContent("bao-hy");
    expect(content.events.map((e) => [e.id, e.kind, e.side])).toEqual([
      ["demo-thanh-hon", "thanh-hon", "chung"],
      ["demo-tiec-chung", "tiec", "chung"],
    ]);
    expect(content.timeline?.every((i) => i.eventId === "demo-tiec-chung")).toBe(true);
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
