import type { EventSummary, WeddingDraft, WeddingSummary } from "./types";

/**
 * Read side of the wedding feature, as seen by the dashboard.
 * Implementations: mock-repo.ts (sample data, now) · prisma-repo.ts (later).
 * Ownership check (session ↔ WeddingMember) là BẮT BUỘC trước khi dùng bản Prisma — vị trí (service
 * hay repo) Tony sẽ chốt, xem docs/STATUS.md.
 */
export interface WeddingRepo {
  /** Wedding of the signed-in user. Mock: always the sample wedding. Prisma: resolved from session. */
  getCurrentWedding(): Promise<WeddingSummary>;
  /** Events of `weddingId`, sorted by start time. Unknown/foreign wedding → []. */
  listEvents(weddingId: string): Promise<EventSummary[]>;
  /** Form values for the invitation editor. Unknown/foreign wedding → NotFoundError (src/lib/errors.ts). */
  getDraft(weddingId: string): Promise<WeddingDraft>;
}
