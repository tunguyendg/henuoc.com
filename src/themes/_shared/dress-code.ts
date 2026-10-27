import { z } from "zod";

/** Optional at the theme-options level; when present, require 1–5 RGB colors. */
export const dressCodeSchema = z
  .array(z.string().regex(/^#[0-9a-fA-F]{6}$/, "Màu phải có định dạng #RRGGBB"))
  .min(1, "Chọn ít nhất một màu")
  .max(5, "Chọn tối đa năm màu");

export type DressCode = z.infer<typeof dressCodeSchema>;
