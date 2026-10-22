import type { GuestFilter, GuestGroup, GuestView } from "./types";

/**
 * Read side of guests/invitations for the dashboard.
 * Every method takes `weddingId` and must return ONLY rows of that wedding.
 * Ownership check (session ↔ WeddingMember) là BẮT BUỘC trước khi dùng bản Prisma — vị trí (service
 * hay repo) Tony sẽ chốt, xem docs/STATUS.md.
 */
export interface GuestRepo {
  /** Groups of the wedding. Unknown/foreign wedding → []. */
  listGroups(weddingId: string): Promise<GuestGroup[]>;
  /** Guests of the wedding, optionally filtered. Unknown/foreign wedding → []. */
  listGuests(weddingId: string, filter?: GuestFilter): Promise<GuestView[]>;
  /**
   * Personal invite link (relative path) for one guest.
   * Guest not in this wedding, or invitation revoked → NotFoundError (src/lib/errors.ts).
   * The link contains a secret token: never log it, never put it in analytics/URL query/title.
   */
  getInviteLink(weddingId: string, guestId: string): Promise<string>;
}
