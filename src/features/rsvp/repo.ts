import type { RsvpFilter, RsvpStats, RsvpView } from "./types";

/**
 * Read side of RSVPs for the dashboard. Every method is scoped to `weddingId`.
 * Ownership check (session ↔ WeddingMember) là BẮT BUỘC trước khi dùng bản Prisma — vị trí (service
 * hay repo) Tony sẽ chốt, xem docs/STATUS.md.
 */
export interface RsvpRepo {
  /**
   * Per-event and overall head count, including walk-in answers (see EventRsvpStats/RsvpStats for
   * exact rules). Revoked invitations are excluded. Unknown/foreign wedding → NotFoundError.
   */
  getStats(weddingId: string): Promise<RsvpStats>;
  /**
   * Answers received (invitations + walk-ins; pending guests not included), newest first.
   * Unknown/foreign wedding → [].
   */
  listResponses(weddingId: string, filter?: RsvpFilter): Promise<RsvpView[]>;
}
