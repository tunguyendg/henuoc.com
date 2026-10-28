import type { ComponentType } from "react";
import type { z } from "zod";

// Contract between the theme engine and every theme. Source of truth: docs/07-THEMES.md §2.

export type StyleSlug =
  | "truyen-thong-viet"
  | "toi-gian"
  | "sang-trong"
  | "lang-man-hoa-la"
  | "han-quoc-nhat-ban"
  | "rustic"
  | "co-dien-hoai-niem"
  | "bien"
  | "hien-dai-nghe-thuat"
  | "de-thuong";

export type SectionKey =
  | "cover"
  | "invitation"
  | "couple"
  | "events"
  | "countdown"
  | "album"
  | "gift"
  | "rsvp"
  | "thanks"
  | "timeline"
  | "dressCode";

/** Which family's invitation this is. One wedding renders two invitations: nhà trai and nhà gái. */
export type FamilySide = "nha-trai" | "nha-gai";
/** Mirrors the DB `Side` enum (NHA_TRAI | NHA_GAI | CHUNG). "chung" events appear on both invitations. */
export type EventSide = FamilySide | "chung";

export interface ImageView {
  // Zod at the input boundary must force https + an allowlisted host (own CDN/R2 or /public path).
  src: string;
  alt: string;
  width: number;
  height: number;
  credit?: string;
}

export interface Person {
  fullName: string;
  shortName: string;
  parents?: string;
  /** Birth-order line under the name, plain text: "Trưởng nam", "Út nữ"… */
  birthOrder?: string;
  photo?: ImageView;
}

export interface EventView {
  id: string;
  kind: "vu-quy" | "thanh-hon" | "tan-hon" | "an-hoi" | "tiec";
  title: string;
  startsAt: string; // ISO 8601
  dateLabel: string;
  timeLabel: string;
  lunarLabel?: string;
  /** Time guests are welcomed, e.g. "17:30" (reception). */
  arrivalTimeLabel?: string;
  /** Time the banquet starts, e.g. "18:30". */
  banquetTimeLabel?: string;
  venue: string;
  address: string;
  // Zod must force https + allowlisted map hosts (Google Maps…); never pass user URLs through raw.
  mapUrl?: string;
  // Internal route only (e.g. /api/…/ics); reject absolute/external URLs.
  icsUrl?: string;
  side: EventSide;
}

export type TimelineIcon = "camera" | "rings" | "glasses" | "cake" | "music";

export interface TimelineItem {
  id: string;
  timeLabel: string;
  title: string;
  description?: string;
  icon?: TimelineIcon;
  /** The event this step belongs to; the step is hidden when that event is not shown. None → shared. */
  eventId?: string;
}

export interface GiftView {
  id: string;
  side: FamilySide;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrPayload: string; // EMVCo/VietQR payload; never render as text
  // Data URI `data:image/svg+xml;base64,…` produced ONLY on the server by `qrSvgDataUri(qrPayload)`
  // (src/lib/qr.ts); never stored in DB, never accepted from input. Render as <img src>, never as
  // inline SVG / dangerouslySetInnerHTML.
  qrSvg?: string;
}

export interface ThemeManifest<TOptions = unknown> {
  slug: string;
  version: number;
  name: string;
  styles: StyleSlug[];
  tier: "free" | "premium";
  status: "draft" | "review" | "published"; // only "published" goes to gallery + sitemap
  description: string;
  thumbnail: string;
  ogImage: string;
  supportedSections: SectionKey[];
  optionsSchema: z.ZodType<TOptions>;
  defaultOptions: TOptions;
  assets: { file: string; source: string; license: string }[];
}

// Free text (inviteMessage, names, salutation…) is rendered as plain text only:
// dangerouslySetInnerHTML is forbidden anywhere under src/themes/**.
export interface WeddingContent {
  // Display order is never stored here: it follows `ThemeProps.side` (src/themes/_shared/side.ts).
  couple: { bride: Person; groom: Person };
  families: {
    brideParents?: string;
    groomParents?: string;
    brideAddr?: string;
    groomAddr?: string;
  };
  events: EventView[];
  // Wedding-day schedule. Stored in the DB later, together with WeddingEvent.
  timeline?: TimelineItem[];
  inviteMessage: string;
  cover?: ImageView;
  album: ImageView[];
  gifts: GiftView[];
  sections: Record<SectionKey, boolean>;
  music?: { src: string; title: string }; // src: zod must force https + allowlisted host
  weddingDate?: string; // ISO 8601
  showWatermark: boolean;
}

export interface GuestContext {
  salutation: string;
  invitedEventIds: string[];
  maxAttendees: number;
  rsvp?: {
    status: "ATTENDING" | "DECLINED";
    attendeeCount: number;
    eventIds: string[];
    message?: string;
  };
  // Only for submitting RSVP; never render as text. Never pass the whole `guest` object to a
  // "use client" component (props of client components are serialized into the RSC payload):
  // give the client only the fields it needs.
  token: string;
}

export interface ThemeProps<TOptions = unknown> {
  content: WeddingContent;
  guest?: GuestContext; // undefined on /thiepcuoi/[slug] and demo
  options: TOptions;
  /** Whose invitation: decides name/family order, ceremony wording and which events are shown. */
  side: FamilySide;
  mode: "live" | "preview" | "demo"; // preview = builder: no music, no RSVP submit
}

export interface ThemeModule<TOptions = unknown> {
  default: ComponentType<ThemeProps<TOptions>>;
}
