import "server-only";
import type { RsvpStatus } from "../rsvp/types";
import { NotFoundError } from "@/lib/errors";
import { deepFreeze } from "../mock-freeze";
import { MOCK_OTHER_WEDDING_ID, MOCK_WEDDING_ID, findMockWedding } from "../wedding/mock-repo";
import type { Side } from "../wedding/types";
import type { GuestRepo } from "./repo";
import type { DeliveryStatus, GuestGroup, GuestView } from "./types";

// SAMPLE DATA ONLY — guests are generic Vietnamese forms of address, no real people, no phone
// numbers, no tokens. Static ISO strings (no Date.now()) so output is deterministic.
// Each invitation row embeds its RSVP like Prisma's `include: { rsvp: true }` (1–1 relation);
// rsvp/mock-repo.ts reads these rows, so there is a single source of truth and no import cycle.

export interface MockRsvpRow {
  status: RsvpStatus;
  attendeeCount: number;
  eventIds: string[];
  message?: string;
  respondedAt: string;
}

export interface MockInvitationRow {
  id: string;
  weddingId: string;
  groupId?: string;
  side: Side;
  salutationPrefix: string;
  displayName: string;
  salutationSuffix?: string;
  maxAttendees: number;
  invitedEventIds: string[];
  deliveryStatus: DeliveryStatus;
  firstOpenedAt?: string;
  revokedAt?: string;
  rsvp?: MockRsvpRow;
}

interface MockGroupRow extends GuestGroup {
  weddingId: string;
}

const VQ = "demo-evt-vu-quy";
const TH = "demo-evt-thanh-hon";
const TIEC = "demo-evt-tiec";
const SENT: DeliveryStatus = "MARKED_SENT";
const NOT_SENT: DeliveryStatus = "NOT_SENT";
const W = MOCK_WEDDING_ID;

const mockGroupRows: readonly MockGroupRow[] = deepFreeze([
  { id: "demo-grp-gai-ho-hang", weddingId: W, side: "NHA_GAI", name: "Họ hàng" },
  { id: "demo-grp-gai-dai-hoc", weddingId: W, side: "NHA_GAI", name: "Bạn đại học" },
  { id: "demo-grp-gai-dong-nghiep", weddingId: W, side: "NHA_GAI", name: "Đồng nghiệp" },
  { id: "demo-grp-trai-ho-hang", weddingId: W, side: "NHA_TRAI", name: "Họ hàng" },
  { id: "demo-grp-trai-cap-3", weddingId: W, side: "NHA_TRAI", name: "Bạn cấp 3" },
  { id: "demo-grp-trai-dong-nghiep", weddingId: W, side: "NHA_TRAI", name: "Đồng nghiệp" },
  { id: "demo-grp-chung-ban-be", weddingId: W, side: "CHUNG", name: "Bạn chung" },
  { id: "demo2-grp-ban-be", weddingId: MOCK_OTHER_WEDDING_ID, side: "CHUNG", name: "Bạn bè" },
]);

const attending = (
  attendeeCount: number,
  eventIds: string[],
  respondedAt: string,
  message?: string,
): MockRsvpRow => ({ status: "ATTENDING", attendeeCount, eventIds, respondedAt, message });

const declined = (respondedAt: string, message?: string): MockRsvpRow => ({
  status: "DECLINED",
  attendeeCount: 0,
  eventIds: [],
  respondedAt,
  message,
});

// 28 invitations (1 revoked) · 19 RSVPs (15 attending, 4 declined) · 8 pending.
// Exported for rsvp/mock-repo.ts only (it plays the "JOIN"); everything else goes through the repos.
export const mockInvitationRows: readonly MockInvitationRow[] = deepFreeze([
  // ── Nhà gái · Họ hàng (invited to Vu Quy + Tiệc)
  {
    id: "demo-gst-01",
    weddingId: W,
    groupId: "demo-grp-gai-ho-hang",
    side: "NHA_GAI",
    salutationPrefix: "Kính mời",
    displayName: "Ông Bà Ngoại",
    maxAttendees: 2,
    invitedEventIds: [VQ, TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-02T01:15:00.000Z",
    rsvp: attending(2, [VQ, TIEC], "2027-09-02T01:20:00.000Z"),
  },
  {
    id: "demo-gst-02",
    weddingId: W,
    groupId: "demo-grp-gai-ho-hang",
    side: "NHA_GAI",
    salutationPrefix: "Kính mời",
    displayName: "Bác Hai",
    salutationSuffix: "& Gia đình",
    maxAttendees: 4,
    invitedEventIds: [VQ, TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-02T03:40:00.000Z",
    rsvp: attending(4, [VQ, TIEC], "2027-09-02T04:00:00.000Z", "Cả nhà sẽ về sớm phụ một tay."),
  },
  {
    id: "demo-gst-03",
    weddingId: W,
    groupId: "demo-grp-gai-ho-hang",
    side: "NHA_GAI",
    salutationPrefix: "Kính mời",
    displayName: "Cô Chú Ba",
    salutationSuffix: "& Gia đình",
    maxAttendees: 3,
    invitedEventIds: [VQ, TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-03T02:10:00.000Z",
    rsvp: attending(3, [VQ], "2027-09-03T02:30:00.000Z"),
  },
  {
    id: "demo-gst-04",
    weddingId: W,
    groupId: "demo-grp-gai-ho-hang",
    side: "NHA_GAI",
    salutationPrefix: "Kính mời",
    displayName: "Dì Dượng Năm",
    salutationSuffix: "& Gia đình",
    maxAttendees: 3,
    invitedEventIds: [VQ, TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-04T12:00:00.000Z",
    rsvp: declined("2027-09-04T12:05:00.000Z", "Dì dượng bận việc ở xa, gửi lời chúc hai cháu."),
  },
  {
    id: "demo-gst-05",
    weddingId: W,
    groupId: "demo-grp-gai-ho-hang",
    side: "NHA_GAI",
    salutationPrefix: "Kính mời",
    displayName: "Cậu Mợ Út",
    maxAttendees: 2,
    invitedEventIds: [VQ, TIEC],
    deliveryStatus: SENT,
  },
  // ── Nhà gái · Bạn đại học (Tiệc only)
  {
    id: "demo-gst-06",
    weddingId: W,
    groupId: "demo-grp-gai-dai-hoc",
    side: "NHA_GAI",
    salutationPrefix: "Thân mời",
    displayName: "Chị Thảo",
    salutationSuffix: "& Người thương",
    maxAttendees: 2,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-05T13:00:00.000Z",
    rsvp: attending(2, [TIEC], "2027-09-05T13:10:00.000Z", "Chúc mừng hai bạn!"),
  },
  {
    id: "demo-gst-07",
    weddingId: W,
    groupId: "demo-grp-gai-dai-hoc",
    side: "NHA_GAI",
    salutationPrefix: "Thân mời",
    displayName: "Bạn Linh",
    maxAttendees: 1,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-05T14:00:00.000Z",
    rsvp: attending(1, [TIEC], "2027-09-05T14:02:00.000Z"),
  },
  {
    id: "demo-gst-08",
    weddingId: W,
    groupId: "demo-grp-gai-dai-hoc",
    side: "NHA_GAI",
    salutationPrefix: "Thân mời",
    displayName: "Bạn Hương",
    salutationSuffix: "& Bạn đời",
    maxAttendees: 2,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-06T01:00:00.000Z",
    rsvp: attending(2, [TIEC], "2027-09-06T01:05:00.000Z"),
  },
  {
    id: "demo-gst-09",
    weddingId: W,
    groupId: "demo-grp-gai-dai-hoc",
    side: "NHA_GAI",
    salutationPrefix: "Thân mời",
    displayName: "Bạn Quân",
    maxAttendees: 1,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-06T09:00:00.000Z",
    rsvp: declined("2027-09-06T09:03:00.000Z", "Tiếc quá, hôm đó mình đi công tác."),
  },
  {
    id: "demo-gst-10",
    weddingId: W,
    groupId: "demo-grp-gai-dai-hoc",
    side: "NHA_GAI",
    salutationPrefix: "Thân mời",
    displayName: "Bạn Trang",
    maxAttendees: 1,
    invitedEventIds: [TIEC],
    deliveryStatus: NOT_SENT,
  },
  // ── Nhà gái · Đồng nghiệp
  {
    id: "demo-gst-11",
    weddingId: W,
    groupId: "demo-grp-gai-dong-nghiep",
    side: "NHA_GAI",
    salutationPrefix: "Trân trọng kính mời",
    displayName: "Anh Tuấn",
    salutationSuffix: "& Gia đình",
    maxAttendees: 3,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-08T02:00:00.000Z",
    rsvp: attending(3, [TIEC], "2027-09-08T02:15:00.000Z"),
  },
  {
    id: "demo-gst-12",
    weddingId: W,
    groupId: "demo-grp-gai-dong-nghiep",
    side: "NHA_GAI",
    salutationPrefix: "Thân mời",
    displayName: "Chị Hà",
    maxAttendees: 1,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-08T03:00:00.000Z",
  },
  {
    id: "demo-gst-13",
    weddingId: W,
    groupId: "demo-grp-gai-dong-nghiep",
    side: "NHA_GAI",
    salutationPrefix: "Thân mời",
    displayName: "Em Vy",
    maxAttendees: 1,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-08T05:30:00.000Z",
  },
  {
    // Opened but not marked sent: the couple copied the link without ticking "đã gửi".
    // The dashboard must NOT infer "sent" from this.
    id: "demo-gst-14",
    weddingId: W,
    groupId: "demo-grp-gai-dong-nghiep",
    side: "NHA_GAI",
    salutationPrefix: "Trân trọng kính mời",
    displayName: "Chị Mai",
    salutationSuffix: "& Bạn đời",
    maxAttendees: 2,
    invitedEventIds: [TIEC],
    deliveryStatus: NOT_SENT,
    firstOpenedAt: "2027-09-09T07:00:00.000Z",
  },
  // ── Nhà trai · Họ hàng (invited to Thành Hôn + Tiệc)
  {
    id: "demo-gst-15",
    weddingId: W,
    groupId: "demo-grp-trai-ho-hang",
    side: "NHA_TRAI",
    salutationPrefix: "Kính mời",
    displayName: "Ông Bà Nội",
    maxAttendees: 2,
    invitedEventIds: [TH, TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-01T00:30:00.000Z",
    rsvp: attending(2, [TH, TIEC], "2027-09-01T00:45:00.000Z"),
  },
  {
    id: "demo-gst-16",
    weddingId: W,
    groupId: "demo-grp-trai-ho-hang",
    side: "NHA_TRAI",
    salutationPrefix: "Kính mời",
    displayName: "Bác Cả",
    salutationSuffix: "& Gia đình",
    maxAttendees: 4,
    invitedEventIds: [TH, TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-01T02:00:00.000Z",
    rsvp: attending(3, [TH, TIEC], "2027-09-01T02:20:00.000Z"),
  },
  {
    id: "demo-gst-17",
    weddingId: W,
    groupId: "demo-grp-trai-ho-hang",
    side: "NHA_TRAI",
    salutationPrefix: "Kính mời",
    displayName: "Chú Thím Tư",
    salutationSuffix: "& Gia đình",
    maxAttendees: 3,
    invitedEventIds: [TH, TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-02T10:00:00.000Z",
    rsvp: attending(3, [TIEC], "2027-09-02T10:30:00.000Z", "Sáng bận, tối cả nhà qua dự tiệc."),
  },
  {
    id: "demo-gst-18",
    weddingId: W,
    groupId: "demo-grp-trai-ho-hang",
    side: "NHA_TRAI",
    salutationPrefix: "Kính mời",
    displayName: "Cô Sáu",
    maxAttendees: 1,
    invitedEventIds: [TH, TIEC],
    deliveryStatus: SENT,
  },
  {
    id: "demo-gst-19",
    weddingId: W,
    groupId: "demo-grp-trai-ho-hang",
    side: "NHA_TRAI",
    salutationPrefix: "Kính mời",
    displayName: "Anh Chị Hai",
    salutationSuffix: "& Các cháu",
    maxAttendees: 4,
    invitedEventIds: [TH, TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-01T11:00:00.000Z",
    rsvp: attending(4, [TH, TIEC], "2027-09-01T11:05:00.000Z"),
  },
  // ── Nhà trai · Bạn cấp 3
  {
    id: "demo-gst-20",
    weddingId: W,
    groupId: "demo-grp-trai-cap-3",
    side: "NHA_TRAI",
    salutationPrefix: "Thân mời",
    displayName: "Bạn Đức",
    maxAttendees: 1,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-07T12:00:00.000Z",
    rsvp: attending(1, [TIEC], "2027-09-07T12:01:00.000Z"),
  },
  {
    id: "demo-gst-21",
    weddingId: W,
    groupId: "demo-grp-trai-cap-3",
    side: "NHA_TRAI",
    salutationPrefix: "Thân mời",
    displayName: "Bạn Khoa",
    salutationSuffix: "& Người thương",
    maxAttendees: 2,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-07T13:00:00.000Z",
    rsvp: attending(2, [TIEC], "2027-09-07T13:04:00.000Z", "Nhất định có mặt!"),
  },
  {
    id: "demo-gst-22",
    weddingId: W,
    groupId: "demo-grp-trai-cap-3",
    side: "NHA_TRAI",
    salutationPrefix: "Thân mời",
    displayName: "Bạn Phúc",
    maxAttendees: 1,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-07T15:00:00.000Z",
    rsvp: declined("2027-09-07T15:10:00.000Z"),
  },
  {
    id: "demo-gst-23",
    weddingId: W,
    groupId: "demo-grp-trai-cap-3",
    side: "NHA_TRAI",
    salutationPrefix: "Thân mời",
    displayName: "Bạn Long",
    maxAttendees: 1,
    invitedEventIds: [TIEC],
    deliveryStatus: NOT_SENT,
    // Revoked: still listed in the dashboard, but has no working link and is left out of RSVP stats.
    revokedAt: "2027-09-12T03:00:00.000Z",
  },
  // ── Nhà trai · Đồng nghiệp
  {
    id: "demo-gst-24",
    weddingId: W,
    groupId: "demo-grp-trai-dong-nghiep",
    side: "NHA_TRAI",
    salutationPrefix: "Trân trọng kính mời",
    displayName: "Anh Sơn",
    salutationSuffix: "& Gia đình",
    maxAttendees: 3,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-10T02:00:00.000Z",
    rsvp: attending(2, [TIEC], "2027-09-10T02:30:00.000Z"),
  },
  {
    id: "demo-gst-25",
    weddingId: W,
    groupId: "demo-grp-trai-dong-nghiep",
    side: "NHA_TRAI",
    salutationPrefix: "Thân mời",
    displayName: "Anh Huy",
    maxAttendees: 1,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-10T03:00:00.000Z",
  },
  {
    id: "demo-gst-26",
    weddingId: W,
    groupId: "demo-grp-trai-dong-nghiep",
    side: "NHA_TRAI",
    salutationPrefix: "Thân mời",
    displayName: "Chị Ngọc",
    maxAttendees: 1,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
  },
  // ── Bạn chung của cả hai
  {
    id: "demo-gst-27",
    weddingId: W,
    groupId: "demo-grp-chung-ban-be",
    side: "CHUNG",
    salutationPrefix: "Thân mời",
    displayName: "Anh Chị Bình",
    maxAttendees: 2,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-11T12:00:00.000Z",
    rsvp: attending(2, [TIEC], "2027-09-11T12:10:00.000Z"),
  },
  {
    id: "demo-gst-28",
    weddingId: W,
    groupId: "demo-grp-chung-ban-be",
    side: "CHUNG",
    salutationPrefix: "Thân mời",
    displayName: "Bạn Nhi",
    maxAttendees: 1,
    invitedEventIds: [TIEC],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-09-11T14:00:00.000Z",
    rsvp: declined("2027-09-11T14:05:00.000Z", "Chúc hai bạn trăm năm hạnh phúc."),
  },
  // ── Other wedding: must never show up in wedding 1 results
  {
    id: "demo2-gst-01",
    weddingId: MOCK_OTHER_WEDDING_ID,
    groupId: "demo2-grp-ban-be",
    side: "CHUNG",
    salutationPrefix: "Thân mời",
    displayName: "Bạn An",
    maxAttendees: 1,
    invitedEventIds: ["demo2-evt-tiec"],
    deliveryStatus: SENT,
    firstOpenedAt: "2027-11-01T12:00:00.000Z",
    rsvp: attending(1, ["demo2-evt-tiec"], "2027-11-01T12:05:00.000Z"),
  },
  {
    id: "demo2-gst-02",
    weddingId: MOCK_OTHER_WEDDING_ID,
    groupId: "demo2-grp-ban-be",
    side: "CHUNG",
    salutationPrefix: "Thân mời",
    displayName: "Bạn Bảo",
    maxAttendees: 1,
    invitedEventIds: ["demo2-evt-tiec"],
    deliveryStatus: NOT_SENT,
  },
]);

// Explicit field-by-field mapping (not `...row`): a column added to the row later (e.g. tokenCipher,
// phone, note) cannot slip into the DTO by accident.
function toGuestView(row: MockInvitationRow): GuestView {
  return {
    id: row.id,
    salutationPrefix: row.salutationPrefix,
    displayName: row.displayName,
    salutationSuffix: row.salutationSuffix,
    side: row.side,
    groupId: row.groupId,
    invitedEventIds: [...row.invitedEventIds],
    maxAttendees: row.maxAttendees,
    delivery: row.deliveryStatus,
    openedAt: row.firstOpenedAt,
    hasRsvp: row.rsvp !== undefined,
    revoked: row.revokedAt !== undefined,
  };
}

export const mockGuestRepo: GuestRepo = {
  async listGroups(weddingId) {
    return structuredClone(
      mockGroupRows
        .filter((g) => g.weddingId === weddingId)
        .map(({ id, name, side }) => ({ id, name, side })),
    );
  },

  async listGuests(weddingId, filter = {}) {
    // Same semantics as Prisma `contains` + `mode: "insensitive"` (no accent folding).
    const q = filter.q?.trim().toLocaleLowerCase("vi");
    const rows = mockInvitationRows.filter(
      (r) =>
        r.weddingId === weddingId &&
        (filter.side === undefined || r.side === filter.side) &&
        (filter.groupId === undefined || r.groupId === filter.groupId) &&
        (!q || r.displayName.toLocaleLowerCase("vi").includes(q)),
    );
    return structuredClone(rows.map(toGuestView));
  },

  async getInviteLink(weddingId, guestId) {
    const wedding = findMockWedding(weddingId);
    // Lookup by BOTH ids: a guestId from another wedding is treated exactly like a missing one.
    const guest = mockInvitationRows.find((r) => r.id === guestId && r.weddingId === weddingId);
    // Revoked looks exactly like "not found": the old token must be dead everywhere.
    if (!wedding || !guest || guest.revokedAt !== undefined) throw new NotFoundError("Invitation");
    // FAKE LINK for the mock only. The real link is /thiepcuoi/<slug>/<token>, where the token is
    // recovered on the server by decrypting Invitation.tokenCipher (AES-256-GCM, src/lib/crypto.ts).
    // A real link never contains the guest id.
    return `/thiepcuoi/${wedding.slug}/demo-${guest.id}`;
  },
};
