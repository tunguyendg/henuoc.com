import type { StaticImageData } from "next/image";
import type { Theme } from "@/data/themes";
import blushRose from "@/themes/blush-rose/thumb.webp";

/**
 * Ảnh bìa thật của mẫu live. Import ảnh nằm ở đây (không phải src/data/themes.ts) vì catalog được
 * src/proxy.ts và src/lib/seo/pages.ts import: import ảnh không được lọt vào bundle proxy.
 */
const thumbnails: Readonly<Record<string, StaticImageData>> = {
  "blush-rose": blushRose,
};

export function getThemeThumbnail(
  theme: Pick<Theme, "slug" | "thumbnail">,
): StaticImageData | undefined {
  return theme.thumbnail ? thumbnails[theme.slug] : undefined;
}
