import { describe, expect, it, vi } from "vitest";

// "server-only" only means something inside Next's bundler → replace it with an empty module here
vi.mock("server-only", () => ({}));

const { repos } = await import("./repos");
const { NotFoundError } = await import("@/lib/errors");
const { MOCK_OTHER_WEDDING_ID, MOCK_WEDDING_ID } = await import("./wedding/mock-repo");

const UNKNOWN = "wedding-that-does-not-exist";
const SENSITIVE_KEY = /token|cipher|hash|phone|email|weddingId/i;

function collectKeys(value: unknown, keys: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => collectKeys(v, keys));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      keys.push(k);
      collectKeys(v, keys);
    }
  }
  return keys;
}

describe("wedding repo", () => {
  it("getCurrentWedding trả cặp mẫu khớp _demo/content.ts", async () => {
    const w = await repos.wedding.getCurrentWedding();
    expect(w).toMatchObject({
      id: MOCK_WEDDING_ID,
      slug: "minhanh-hoangnam",
      coupleNames: "Minh Anh & Hoàng Nam",
      weddingDate: "2027-10-17T11:00:00.000Z",
      plan: "FREE",
    });
  });

  it("listEvents chỉ trả sự kiện của wedding đó, sắp theo giờ", async () => {
    const events = await repos.wedding.listEvents(MOCK_WEDDING_ID);
    expect(events.map((e) => e.type)).toEqual(["VU_QUY", "THANH_HON", "TIEC"]);
    expect(collectKeys(events)).not.toContain("weddingId");
    expect(await repos.wedding.listEvents(UNKNOWN)).toEqual([]);
  });

  it("getDraft: wedding lạ → NotFoundError", async () => {
    await expect(repos.wedding.getDraft(UNKNOWN)).rejects.toBeInstanceOf(NotFoundError);
    const draft = await repos.wedding.getDraft(MOCK_WEDDING_ID);
    expect(draft.events).toHaveLength(3);
  });

  it("trả bản sao: sửa kết quả không làm đổi dữ liệu gốc", async () => {
    const draft = await repos.wedding.getDraft(MOCK_WEDDING_ID);
    draft.brideName = "Đã bị sửa";
    draft.events[0]!.title = "Đã bị sửa";
    const again = await repos.wedding.getDraft(MOCK_WEDDING_ID);
    expect(again.brideName).toBe("Nguyễn Minh Anh");
    expect(again.events[0]!.title).toBe("Lễ Vu Quy");
  });
});

describe("guest repo", () => {
  it("chỉ trả khách + nhóm của đúng wedding (không lẫn wedding khác)", async () => {
    const guests = await repos.guest.listGuests(MOCK_WEDDING_ID);
    expect(guests).toHaveLength(28);
    expect(guests.every((g) => g.id.startsWith("demo-gst-"))).toBe(true);

    const other = await repos.guest.listGuests(MOCK_OTHER_WEDDING_ID);
    expect(other.map((g) => g.id)).toEqual(["demo2-gst-01", "demo2-gst-02"]);

    expect(await repos.guest.listGuests(UNKNOWN)).toEqual([]);
    expect(await repos.guest.listGroups(UNKNOWN)).toEqual([]);
    const groups = await repos.guest.listGroups(MOCK_WEDDING_ID);
    expect(groups.some((g) => g.id.startsWith("demo2-"))).toBe(false);
  });

  it("DTO (GuestView, RsvpView, WeddingSummary, WeddingDraft) không có key nhạy cảm", async () => {
    const dtos = [
      await repos.guest.listGuests(MOCK_WEDDING_ID),
      await repos.rsvp.listResponses(MOCK_WEDDING_ID),
      await repos.wedding.getCurrentWedding(),
      await repos.wedding.getDraft(MOCK_WEDDING_ID),
    ];
    expect(collectKeys(dtos).filter((k) => SENSITIVE_KEY.test(k))).toEqual([]);
  });

  it("trả bản sao: sửa kết quả guest/rsvp không đổi dữ liệu gốc", async () => {
    const guests = await repos.guest.listGuests(MOCK_WEDDING_ID);
    guests[0]!.displayName = "Đã bị sửa";
    guests[0]!.invitedEventIds.push("x");
    const responses = await repos.rsvp.listResponses(MOCK_WEDDING_ID);
    responses[0]!.attendeeCount = 999;
    responses[0]!.eventIds.length = 0;

    const guestsAgain = await repos.guest.listGuests(MOCK_WEDDING_ID);
    expect(guestsAgain[0]!.displayName).toBe("Ông Bà Ngoại");
    expect(guestsAgain[0]!.invitedEventIds).toEqual(["demo-evt-vu-quy", "demo-evt-tiec"]);
    const responsesAgain = await repos.rsvp.listResponses(MOCK_WEDDING_ID);
    expect(responsesAgain[0]).toEqual(
      expect.objectContaining({ attendeeCount: 0, eventIds: [] }), // newest = walk-in "Anh Dũng"
    );
    expect((await repos.rsvp.getStats(MOCK_WEDDING_ID)).overall.attendeeCount).toBe(38);
  });

  it("lọc theo side, groupId, q (không phân biệt hoa thường)", async () => {
    const nhaGai = await repos.guest.listGuests(MOCK_WEDDING_ID, { side: "NHA_GAI" });
    expect(nhaGai).toHaveLength(14);
    expect(nhaGai.every((g) => g.side === "NHA_GAI")).toBe(true);

    const hoHangTrai = await repos.guest.listGuests(MOCK_WEDDING_ID, {
      groupId: "demo-grp-trai-ho-hang",
    });
    expect(hoHangTrai.map((g) => g.displayName)).toEqual([
      "Ông Bà Nội",
      "Bác Cả",
      "Chú Thím Tư",
      "Cô Sáu",
      "Anh Chị Hai",
    ]);

    const q = await repos.guest.listGuests(MOCK_WEDDING_ID, { q: "BẠN" });
    expect(q.length).toBeGreaterThan(0);
    expect(q.every((g) => g.displayName.toLowerCase().includes("bạn"))).toBe(true);

    // group of wedding 2 used with wedding 1 → nothing
    const cross = await repos.guest.listGuests(MOCK_WEDDING_ID, { groupId: "demo2-grp-ban-be" });
    expect(cross).toEqual([]);
  });

  it("có đúng 1 khách bị thu hồi link; getInviteLink của khách đó → NotFoundError", async () => {
    const guests = await repos.guest.listGuests(MOCK_WEDDING_ID);
    expect(guests.filter((g) => g.revoked).map((g) => g.id)).toEqual(["demo-gst-23"]);
    await expect(repos.guest.getInviteLink(MOCK_WEDDING_ID, "demo-gst-23")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("getInviteLink: khách của wedding khác → NotFoundError (IDOR)", async () => {
    await expect(repos.guest.getInviteLink(MOCK_WEDDING_ID, "demo2-gst-01")).rejects.toBeInstanceOf(
      NotFoundError,
    );
    await expect(repos.guest.getInviteLink(UNKNOWN, "demo-gst-01")).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(await repos.guest.getInviteLink(MOCK_WEDDING_ID, "demo-gst-01")).toBe(
      "/thiepcuoi/minhanh-hoangnam/demo-demo-gst-01",
    );
  });
});

describe("rsvp repo", () => {
  it("số liệu mẫu hợp lệ: không vượt maxAttendees, chỉ chọn sự kiện được mời", async () => {
    const guests = new Map(
      (await repos.guest.listGuests(MOCK_WEDDING_ID)).map((g) => [g.id, g] as const),
    );
    for (const r of await repos.rsvp.listResponses(MOCK_WEDDING_ID)) {
      if (r.status === "DECLINED") expect(r.attendeeCount).toBe(0);
      if (r.source === "WALK_IN") {
        expect(r.guestId).toBeUndefined();
        continue;
      }
      const guest = guests.get(r.guestId ?? "");
      expect(guest).toBeDefined();
      expect(r.attendeeCount).toBeLessThanOrEqual(guest!.maxAttendees);
      for (const id of r.eventIds) expect(guest!.invitedEventIds).toContain(id);
    }
  });

  it("getStats cộng đúng theo từng sự kiện và tổng (gồm walk-in, bỏ thiệp thu hồi)", async () => {
    const stats = await repos.rsvp.getStats(MOCK_WEDDING_ID);
    expect(stats.byEvent).toEqual([
      {
        eventId: "demo-evt-vu-quy",
        title: "Lễ Vu Quy",
        invited: 5,
        attending: 3,
        declined: 1,
        pending: 1,
        walkIn: 0,
        attendeeCount: 9,
        estimatedTables: 1,
      },
      {
        eventId: "demo-evt-thanh-hon",
        title: "Lễ Thành Hôn",
        invited: 5,
        attending: 3,
        declined: 1,
        pending: 1,
        walkIn: 0,
        attendeeCount: 9,
        estimatedTables: 1,
      },
      {
        eventId: "demo-evt-tiec",
        title: "Tiệc Cưới",
        invited: 27,
        attending: 15,
        declined: 5,
        pending: 8,
        walkIn: 1,
        attendeeCount: 35,
        estimatedTables: 4,
      },
    ]);
    expect(stats.overall).toEqual({
      invited: 27,
      attending: 16,
      declined: 5,
      pending: 8,
      walkIn: 2,
      attendeeCount: 38,
      estimatedTables: 4,
    });
    for (const e of stats.byEvent) {
      expect(e.attending - e.walkIn + e.declined + e.pending).toBe(e.invited);
    }
    const o = stats.overall;
    expect(o.attending + o.declined + o.pending).toBe(o.invited + o.walkIn);
  });

  it("getStats wedding lạ → NotFoundError; listResponses wedding lạ → []", async () => {
    await expect(repos.rsvp.getStats(UNKNOWN)).rejects.toBeInstanceOf(NotFoundError);
    expect(await repos.rsvp.listResponses(UNKNOWN)).toEqual([]);
  });

  it("listResponses: khớp hasRsvp của guest, có walk-in, lọc được", async () => {
    const all = await repos.rsvp.listResponses(MOCK_WEDDING_ID);
    const guests = await repos.guest.listGuests(MOCK_WEDDING_ID);
    expect(all).toHaveLength(21);
    const fromInvitations = all.filter((r) => r.source === "INVITATION");
    expect(new Set(fromInvitations.map((r) => r.guestId))).toEqual(
      new Set(guests.filter((g) => g.hasRsvp).map((g) => g.id)),
    );
    expect(all.filter((r) => r.source === "WALK_IN").map((r) => r.displayName)).toEqual([
      "Anh Dũng",
      "Chị Lan (bạn cũ của Minh Anh)",
    ]);

    const declined = await repos.rsvp.listResponses(MOCK_WEDDING_ID, { status: "DECLINED" });
    expect(declined).toHaveLength(5);

    const vuQuy = await repos.rsvp.listResponses(MOCK_WEDDING_ID, { eventId: "demo-evt-vu-quy" });
    expect(vuQuy.map((r) => r.guestId).toSorted()).toEqual([
      "demo-gst-01",
      "demo-gst-02",
      "demo-gst-03",
    ]);

    // side/group filters exclude walk-ins (they have neither)
    const nhaTrai = await repos.rsvp.listResponses(MOCK_WEDDING_ID, { side: "NHA_TRAI" });
    expect(nhaTrai).toHaveLength(8);
    expect(nhaTrai.every((r) => r.source === "INVITATION")).toBe(true);

    const other = await repos.rsvp.listResponses(MOCK_OTHER_WEDDING_ID);
    expect(other.map((r) => r.guestId)).toEqual(["demo2-gst-01"]);
  });
});

describe("shopping repo", () => {
  it("không bịa giá, lọc theo danh mục, wedding lạ → []", async () => {
    const all = await repos.shopping.listSuggestions(MOCK_WEDDING_ID);
    expect(all.length).toBeGreaterThanOrEqual(8);
    expect(all.every((p) => p.priceLabel === undefined || !/\d/.test(p.priceLabel))).toBe(true);

    const anHoi = await repos.shopping.listSuggestions(MOCK_WEDDING_ID, "an-hoi");
    expect(anHoi.length).toBeGreaterThan(0);
    expect(anHoi.every((p) => p.category === "an-hoi")).toBe(true);

    expect(await repos.shopping.listSuggestions(UNKNOWN)).toEqual([]);
  });
});
