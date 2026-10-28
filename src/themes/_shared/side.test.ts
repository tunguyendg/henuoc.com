import { describe, expect, it } from "vitest";
import type { EventView, TimelineItem, WeddingContent } from "../types";
import {
  eventsForSide,
  eventTitle,
  otherSide,
  partiesInSideOrder,
  timelineForEvents,
  visibleEvents,
} from "./side";

const ev = (
  id: string,
  kind: EventView["kind"],
  side: EventView["side"],
  title = id,
): EventView => ({
  id,
  kind,
  title,
  startsAt: "2027-10-16T02:00:00.000Z",
  dateLabel: "16.10.2027",
  timeLabel: "09:00",
  venue: "v",
  address: "a",
  side,
});

const events = [
  ev("vq", "vu-quy", "nha-gai", "Vu quy gốc"),
  ev("tg", "tiec", "nha-gai", "Tiệc nhà gái"),
  ev("ch", "an-hoi", "chung", "Ăn hỏi chung"),
  ev("th", "tan-hon", "nha-trai", "Tân hôn gốc"),
  ev("tt", "tiec", "nha-trai", "Tiệc nhà trai"),
];

const content = {
  couple: {
    bride: { fullName: "A", shortName: "A", parents: "Bố mẹ cô dâu (person)" },
    groom: { fullName: "B", shortName: "B", parents: "Bố mẹ chú rể (person)" },
  },
  families: { brideParents: "Họ gái", groomParents: "Họ trai", brideAddr: "Đ gái" },
} as unknown as WeddingContent;

describe("otherSide", () => {
  it("đảo nhà trai thành nhà gái và ngược lại", () => {
    expect(otherSide("nha-gai")).toBe("nha-trai");
    expect(otherSide("nha-trai")).toBe("nha-gai");
  });
});

describe("partiesInSideOrder", () => {
  it("thiệp nhà gái: cô dâu đứng trước, thiệp nhà trai: chú rể đứng trước", () => {
    expect(partiesInSideOrder(content, "nha-gai").map((p) => p.label)).toEqual([
      "Cô dâu",
      "Chú rể",
    ]);
    expect(partiesInSideOrder(content, "nha-trai").map((p) => p.label)).toEqual([
      "Chú rể",
      "Cô dâu",
    ]);
  });

  it("mỗi bên mang đúng họ và địa chỉ của mình", () => {
    const [bride, groom] = partiesInSideOrder(content, "nha-gai");
    expect(bride).toMatchObject({ side: "nha-gai", parents: "Họ gái", addr: "Đ gái" });
    expect(groom).toMatchObject({ side: "nha-trai", parents: "Họ trai", addr: undefined });
  });

  it("thiếu thông tin gia đình thì lấy bố mẹ ghi trên người", () => {
    const bare = { ...content, families: {} } as WeddingContent;
    const [bride, groom] = partiesInSideOrder(bare, "nha-gai");
    expect(bride.parents).toBe("Bố mẹ cô dâu (person)");
    expect(groom.parents).toBe("Bố mẹ chú rể (person)");
  });
});

describe("eventsForSide", () => {
  it.each([
    ["nha-gai", ["vq", "tg", "ch"]],
    ["nha-trai", ["ch", "th", "tt"]],
  ] as const)("thiệp %s giữ sự kiện của mình và chung, đúng thứ tự gốc", (side, ids) => {
    expect(eventsForSide(events, side).map((e) => e.id)).toEqual(ids);
  });
});

describe("visibleEvents", () => {
  it("không có khách thì thấy mọi sự kiện của bên mình", () => {
    expect(visibleEvents(events, "nha-trai").map((e) => e.id)).toEqual(["ch", "th", "tt"]);
  });

  it("khách chỉ thấy sự kiện được mời, vẫn giữ thứ tự", () => {
    const guest = { invitedEventIds: ["tg", "vq"] };
    expect(visibleEvents(events, "nha-gai", guest).map((e) => e.id)).toEqual(["vq", "tg"]);
  });

  it("sự kiện bên kia mà khách được mời vẫn bị ẩn", () => {
    const guest = { invitedEventIds: ["th", "vq"] };
    expect(visibleEvents(events, "nha-gai", guest).map((e) => e.id)).toEqual(["vq"]);
  });

  it("khách không được mời sự kiện nào thì danh sách rỗng", () => {
    expect(visibleEvents(events, "nha-gai", { invitedEventIds: [] })).toEqual([]);
  });
});

describe("eventTitle", () => {
  it.each([
    ["nha-gai", "vq", "Lễ Vu Quy"],
    ["nha-trai", "th", "Lễ Tân Hôn"],
  ] as const)("lễ chính của nhà mình (thiệp %s) gọi theo bên", (side, id, title) => {
    expect(
      eventTitle(
        events.find((e) => e.id === id)!,
        side,
      ),
    ).toBe(title);
  });

  it("lễ thành hôn của nhà mình cũng gọi theo bên", () => {
    const e = ev("x", "thanh-hon", "nha-gai", "Thành hôn gốc");
    expect(eventTitle(e, "nha-gai")).toBe("Lễ Vu Quy");
  });

  it("lễ của bên kia giữ nguyên tên gốc", () => {
    expect(eventTitle(events[0]!, "nha-trai")).toBe("Vu quy gốc");
    expect(eventTitle(events[3]!, "nha-gai")).toBe("Tân hôn gốc");
  });

  it("tiệc và ăn hỏi giữ nguyên tên dù là của nhà mình hay chung", () => {
    expect(eventTitle(events[1]!, "nha-gai")).toBe("Tiệc nhà gái");
    expect(eventTitle(events[2]!, "nha-gai")).toBe("Ăn hỏi chung");
  });
});

describe("timelineForEvents", () => {
  const items: TimelineItem[] = [
    { id: "1", timeLabel: "1", title: "gái", eventId: "tg" },
    { id: "2", timeLabel: "2", title: "trai", eventId: "tt" },
    { id: "3", timeLabel: "3", title: "chung" },
  ];

  it("giữ bước gắn với sự kiện đang hiện và bước không gắn sự kiện nào", () => {
    const shown = [events[1]!];
    expect(timelineForEvents(items, shown).map((i) => i.id)).toEqual(["1", "3"]);
  });

  it("bỏ bước của sự kiện không hiện", () => {
    expect(timelineForEvents(items, []).map((i) => i.id)).toEqual(["3"]);
  });
});
