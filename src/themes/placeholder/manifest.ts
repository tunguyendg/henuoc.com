import { z } from "zod";
import { musicSlugSchema } from "@/data/music";
import { dressCodeSchema } from "../_shared/dress-code";
import type { ThemeManifest } from "../types";

export const optionsSchema = z.object({
  musicSlug: musicSlugSchema.optional(),
  dressCode: dressCodeSchema.optional(),
});

export type PlaceholderOptions = z.infer<typeof optionsSchema>;

export const manifest: ThemeManifest<PlaceholderOptions> = {
  slug: "placeholder",
  version: 1,
  name: "Khung kiểm tra",
  styles: ["toi-gian"],
  tier: "free",
  status: "draft",
  description:
    "Theme khung để kiểm tra route demo và hợp đồng dữ liệu của theme engine. Chỉ hiển thị nội dung thô và ghép đủ các thành phần dùng chung, không dành cho khách thật.",
  thumbnail: "/themes/placeholder/thumb.webp",
  ogImage: "/themes/placeholder/og.webp",
  supportedSections: [
    "cover",
    "invitation",
    "couple",
    "events",
    "countdown",
    "album",
    "rsvp",
    "gift",
    "thanks",
  ],
  optionsSchema,
  defaultOptions: { musicSlug: "canon-in-d-usaf" },
  assets: [],
};
