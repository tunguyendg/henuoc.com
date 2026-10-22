import "server-only";
import { NotFoundError } from "@/lib/errors";
import { deepFreeze } from "../mock-freeze";
import type { WeddingRepo } from "./repo";
import type { EventSummary, Plan, WeddingDraft, WeddingStatus } from "./types";

// SAMPLE DATA ONLY — every person, address and id below is fictional. Static on purpose: no
// Date.now()/new Date(), so renders and tests are deterministic. Names and dates match
// src/themes/_demo/content.ts. Rows are shaped like DB rows (they carry weddingId, tableSize…);
// the repo maps them to DTOs, exactly like the future Prisma repo will.

export const MOCK_WEDDING_ID = "demo-wedding-1";
// Second wedding that belongs to "someone else": exists only so tests can prove nothing leaks
// across weddings (IDOR habit).
export const MOCK_OTHER_WEDDING_ID = "demo-wedding-2";

export interface MockWeddingRow {
  id: string;
  slug: string;
  status: WeddingStatus;
  plan: Plan;
  themeSlug: string;
  brideName: string;
  groomName: string;
  brideShortName?: string;
  groomShortName?: string;
  brideFirst: boolean;
  brideParents?: string;
  groomParents?: string;
  brideFamilyAddr?: string;
  groomFamilyAddr?: string;
  inviteMessage?: string;
  tableSize: number;
  weddingDate?: string;
}

export interface MockEventRow extends EventSummary {
  weddingId: string;
}

const mockWeddingRows: readonly MockWeddingRow[] = deepFreeze([
  {
    id: MOCK_WEDDING_ID,
    slug: "minhanh-hoangnam",
    status: "PUBLISHED",
    plan: "FREE",
    themeSlug: "placeholder",
    brideName: "Nguyễn Minh Anh",
    groomName: "Trần Hoàng Nam",
    brideShortName: "Minh Anh",
    groomShortName: "Hoàng Nam",
    brideFirst: true,
    brideParents: "Ông Nguyễn Văn Hùng · Bà Lê Thị Thu",
    groomParents: "Ông Trần Quốc Bảo · Bà Phạm Thị Lan",
    brideFamilyAddr: "12 Đường Hoa Sen, Phường Mẫu, TP. Demo",
    groomFamilyAddr: "45 Đường Cúc Vàng, Phường Mẫu, TP. Demo",
    inviteMessage:
      "Trân trọng kính mời bạn đến chung vui cùng gia đình chúng mình trong ngày trọng đại. Sự hiện diện của bạn là niềm vui lớn nhất với chúng mình.",
    tableSize: 10,
    weddingDate: "2027-10-17T11:00:00.000Z",
  },
  {
    id: MOCK_OTHER_WEDDING_ID,
    slug: "thuha-ducminh",
    status: "DRAFT",
    plan: "FREE",
    themeSlug: "placeholder",
    brideName: "Lê Thu Hà",
    groomName: "Phạm Đức Minh",
    brideShortName: "Thu Hà",
    groomShortName: "Đức Minh",
    brideFirst: true,
    tableSize: 10,
    weddingDate: "2027-12-05T11:00:00.000Z",
  },
]);

export const mockEventRows: readonly MockEventRow[] = deepFreeze([
  {
    id: "demo-evt-vu-quy",
    weddingId: MOCK_WEDDING_ID,
    type: "VU_QUY",
    side: "NHA_GAI",
    title: "Lễ Vu Quy",
    startsAt: "2027-10-16T02:00:00.000Z",
    venue: "Tư gia nhà gái",
    address: "12 Đường Hoa Sen, Phường Mẫu, TP. Demo",
  },
  {
    id: "demo-evt-thanh-hon",
    weddingId: MOCK_WEDDING_ID,
    type: "THANH_HON",
    side: "NHA_TRAI",
    title: "Lễ Thành Hôn",
    startsAt: "2027-10-17T02:00:00.000Z",
    venue: "Tư gia nhà trai",
    address: "45 Đường Cúc Vàng, Phường Mẫu, TP. Demo",
  },
  {
    id: "demo-evt-tiec",
    weddingId: MOCK_WEDDING_ID,
    type: "TIEC",
    side: "CHUNG",
    title: "Tiệc Cưới",
    startsAt: "2027-10-17T11:00:00.000Z",
    venue: "Trung tâm tiệc cưới Mẫu",
    address: "88 Đại lộ Hạnh Phúc, Phường Thử, TP. Demo",
  },
  {
    id: "demo2-evt-tiec",
    weddingId: MOCK_OTHER_WEDDING_ID,
    type: "TIEC",
    side: "CHUNG",
    title: "Tiệc Cưới",
    startsAt: "2027-12-05T11:00:00.000Z",
    venue: "Nhà hàng Mẫu",
    address: "1 Đường Thử Nghiệm, TP. Demo",
  },
]);

export function findMockWedding(weddingId: string): MockWeddingRow | undefined {
  return mockWeddingRows.find((w) => w.id === weddingId);
}

function toEventSummary({ id, type, side, title, startsAt, venue, address }: MockEventRow) {
  // Explicit pick: weddingId (and any future internal column) never reaches the UI.
  return { id, type, side, title, startsAt, venue, address } satisfies EventSummary;
}

function eventsOf(weddingId: string): EventSummary[] {
  return mockEventRows
    .filter((e) => e.weddingId === weddingId)
    .toSorted((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map(toEventSummary);
}

export const mockWeddingRepo: WeddingRepo = {
  async getCurrentWedding() {
    // Prisma version: find the wedding where WeddingMember.userId === session.user.id.
    const w = findMockWedding(MOCK_WEDDING_ID);
    if (!w) throw new NotFoundError("Wedding");
    const [first, second] = w.brideFirst
      ? [w.brideShortName ?? w.brideName, w.groomShortName ?? w.groomName]
      : [w.groomShortName ?? w.groomName, w.brideShortName ?? w.brideName];
    return structuredClone({
      id: w.id,
      slug: w.slug,
      coupleNames: `${first} & ${second}`,
      brideName: w.brideName,
      groomName: w.groomName,
      weddingDate: w.weddingDate,
      themeSlug: w.themeSlug,
      status: w.status,
      plan: w.plan,
    });
  },

  async listEvents(weddingId) {
    return structuredClone(eventsOf(weddingId));
  },

  async getDraft(weddingId) {
    const w = findMockWedding(weddingId);
    if (!w) throw new NotFoundError("Wedding");
    const draft: WeddingDraft = {
      themeSlug: w.themeSlug,
      brideName: w.brideName,
      groomName: w.groomName,
      brideShortName: w.brideShortName,
      groomShortName: w.groomShortName,
      brideFirst: w.brideFirst,
      brideParents: w.brideParents,
      groomParents: w.groomParents,
      brideFamilyAddr: w.brideFamilyAddr,
      groomFamilyAddr: w.groomFamilyAddr,
      inviteMessage: w.inviteMessage,
      weddingDate: w.weddingDate,
      events: eventsOf(weddingId),
    };
    return structuredClone(draft);
  },
};
