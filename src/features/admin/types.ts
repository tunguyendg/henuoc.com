// Admin (/admin, role ADMIN only) DTOs. Overview data only: no guest names, no guest contact data,
// no tokens, and never a user's full email (only `emailMasked`). See docs/01-PRD.md F9.
import type { Plan, WeddingStatus } from "../wedding/types";
import type { ThemeStatus } from "@/data/themes";

export type { Plan, WeddingStatus };
export type UserRole = "USER" | "ADMIN";
export type ThemeTier = "free" | "premium";

export interface AdminUserSummary {
  id: string;
  displayName: string;
  emailMasked: string; // e.g. "mi***@gmail.com" — masked server-side, full email never leaves the repo
  createdAt: string; // ISO 8601 UTC
  weddingCount: number;
  role: UserRole;
}

export interface AdminWeddingSummary {
  id: string;
  slug: string;
  coupleNames: string;
  weddingDate?: string; // ISO 8601 UTC
  status: WeddingStatus;
  plan: Plan;
  themeSlug: string;
  ownerId: string;
  guestCount: number;
  createdAt: string; // ISO 8601 UTC
}

export interface AdminThemeSummary {
  slug: string;
  name: string;
  tier: ThemeTier;
  status: ThemeStatus;
  enabled: boolean;
  weddingCount: number;
}

export interface AdminWeddingFilter {
  plan?: Plan;
  status?: WeddingStatus;
  /** Case-insensitive match on slug or couple names. */
  q?: string;
}

export interface AdminStats {
  users: number;
  weddings: number;
  premiumWeddings: number;
  publishedWeddings: number;
}
