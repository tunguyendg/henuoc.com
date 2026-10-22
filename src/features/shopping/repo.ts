import type { ProductCategory, ProductView } from "./types";

/**
 * Curated product suggestions. Products are global, but the call is scoped to `weddingId` so the
 * Prisma version can personalise (e.g. thank-you gift quantity from RSVP count).
 * Ownership check (session ↔ WeddingMember) là BẮT BUỘC trước khi dùng bản Prisma — vị trí (service
 * hay repo) Tony sẽ chốt, xem docs/STATUS.md.
 */
export interface ShoppingRepo {
  /** Active suggestions, optionally one category. Unknown/foreign wedding → []. */
  listSuggestions(weddingId: string, category?: ProductCategory): Promise<ProductView[]>;
}
