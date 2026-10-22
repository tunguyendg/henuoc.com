// Dashboard DTOs for the wedding feature. The UI depends on these shapes only — never on Prisma models.
// String unions mirror the Prisma enums in docs/reference/schema.prisma so the UI never has to import
// the generated Prisma client (which is server-only and heavy).

export type Side = "NHA_TRAI" | "NHA_GAI" | "CHUNG";
export type EventType = "AN_HOI" | "VU_QUY" | "THANH_HON" | "TAN_HON" | "TIEC";
export type WeddingStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type Plan = "FREE" | "PREMIUM";

export interface WeddingSummary {
  id: string;
  slug: string;
  coupleNames: string; // short names in display order, e.g. "Minh Anh & Hoàng Nam"
  brideName: string;
  groomName: string;
  weddingDate?: string; // ISO 8601 UTC
  themeSlug: string;
  status: WeddingStatus;
  plan: Plan;
}

export interface EventSummary {
  id: string;
  type: EventType;
  side: Side;
  title: string; // resolved display title (WeddingEvent.title override or a default per type)
  startsAt: string; // ISO 8601 UTC; format in Asia/Ho_Chi_Minh at render time
  venue: string;
  address: string;
}

// Initial values for the "Thiệp" (invitation info) form in the dashboard.
export interface WeddingDraft {
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
  weddingDate?: string; // ISO 8601 UTC
  events: EventSummary[];
}
