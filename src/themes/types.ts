import type { ComponentType } from "react";
import type { z } from "zod";

// Contract between the theme engine and every theme. Source of truth: docs/07-THEMES.md §2.

export type StyleSlug =
  "hien-dai" | "toi-gian" | "truyen-thong" | "han-quoc" | "hoa-la" | "vintage" | "sang-trong";

export type SectionKey =
  "cover" | "invitation" | "couple" | "events" | "countdown" | "album" | "gift" | "rsvp" | "thanks";

export type FamilySide = "nha-trai" | "nha-gai";

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
  venue: string;
  address: string;
  // Zod must force https + allowlisted map hosts (Google Maps…); never pass user URLs through raw.
  mapUrl?: string;
  // Internal route only (e.g. /api/…/ics); reject absolute/external URLs.
  icsUrl?: string;
  side?: FamilySide;
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
  couple: { bride: Person; groom: Person; brideFirst: boolean };
  families: {
    brideParents?: string;
    groomParents?: string;
    brideAddr?: string;
    groomAddr?: string;
  };
  events: EventView[];
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
  mode: "live" | "preview" | "demo"; // preview = builder: no music, no RSVP submit
}

export interface ThemeModule<TOptions = unknown> {
  default: ComponentType<ThemeProps<TOptions>>;
}
