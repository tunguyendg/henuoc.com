import { z } from "zod";
import { musicSlugSchema } from "@/data/music";
import { dressCodeSchema } from "../_shared/dress-code";
import type { ThemeManifest } from "../types";

export const paletteSchema = z.enum(["do-do", "hong-nhat"]);
export type BlushRosePalette = z.infer<typeof paletteSchema>;

export const optionsSchema = z.object({
  musicSlug: musicSlugSchema.optional(),
  dressCode: dressCodeSchema.optional(),
  // Missing → "do-do" (resolved in index.tsx). The palette is applied purely in CSS (theme.css).
  palette: paletteSchema.optional(),
});

export type BlushRoseOptions = z.infer<typeof optionsSchema>;

export const manifest: ThemeManifest<BlushRoseOptions> = {
  slug: "blush-rose",
  version: 1,
  name: "Blush Rose",
  styles: ["lang-man-hoa-la"],
  tier: "free",
  status: "published",
  description:
    "Mở phong bì giấy ngà có con dấu sáp, bên trong là tranh hoa hồng thế kỷ 19, đỏ đô trầm và ánh vàng cũ. Có lịch trái tim khoanh ngày cưới, album coverflow và bao lì xì gửi quà mừng.",
  thumbnail: "/themes/blush-rose/thumb.webp",
  ogImage: "/themes/blush-rose/og.webp",
  supportedSections: [
    "cover",
    "invitation",
    "couple",
    "events",
    "album",
    "timeline",
    "dressCode",
    "rsvp",
    "gift",
    "thanks",
  ],
  optionsSchema,
  defaultOptions: {
    musicSlug: "canon-in-d-usaf",
    palette: "do-do",
    dressCode: ["#4A161A", "#E8B9C3", "#F3EDE3"],
  },
  assets: [
    {
      file: "/images/ornaments/redoute/rosa-carolina-corymbosa.webp",
      source: "https://clevelandart.org/art/1959.15",
      license: "CC0",
    },
  ],
};
