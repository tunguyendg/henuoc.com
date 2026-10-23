import type {
  AdminStats,
  AdminThemeSummary,
  AdminUserSummary,
  AdminWeddingFilter,
  AdminWeddingSummary,
} from "./types";

/**
 * Read side of the admin page (/admin). Implementations: mock-repo.ts (now) · prisma-repo.ts (later).
 *
 * READ-ONLY on purpose. Write operations (set a wedding's plan, enable/disable a theme) will be
 * Server Actions that check `session.user.role === "ADMIN"` on the server before touching the DB
 * (docs/01-PRD.md F9) — once auth exists. Until then the UI only has client-side fake buttons.
 * The Prisma version must also be behind that ADMIN check: these methods read across ALL users.
 */
export interface AdminRepo {
  /** All users, newest first. Email is masked; no full email ever. */
  listUsers(): Promise<AdminUserSummary[]>;
  /** All weddings, newest first, optionally filtered. No guest-level data. */
  listWeddings(filter?: AdminWeddingFilter): Promise<AdminWeddingSummary[]>;
  /** Theme catalogue with on/off state and usage count. */
  listThemes(): Promise<AdminThemeSummary[]>;
  /** Totals counted from the same data as the lists above (never hard-coded). */
  getStats(): Promise<AdminStats>;
}
