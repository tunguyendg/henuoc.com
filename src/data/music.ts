import { z } from "zod";
import library from "@/content/music/library.json";

const trackSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  artist: z.string().min(1),
  mood: z.enum(["trang-trong", "lang-man", "vui-tuoi"]),
  license: z.string().min(1),
  licenseUrl: z.url(),
  sourceUrl: z.url(),
  downloadUrl: z.url().nullable(),
  contentId: z.boolean(),
  credit: z.string().optional(),
  hasVocals: z.boolean(),
  enabled: z.boolean(),
});

export type Track = z.infer<typeof trackSchema> & { src: string };

// Static JSON import: no filesystem reads or network requests during rendering.
const tracks: Track[] = z
  .array(trackSchema)
  .parse(library)
  .map((track) => ({
    ...track,
    src: `/audio/library/${track.slug}.m4a`,
  }));

export function getTracks({ enabled }: { enabled?: boolean } = {}): Track[] {
  return tracks.filter((track) => enabled === undefined || track.enabled === enabled);
}

export function getTrack(slug: string): Track | undefined {
  return tracks.find((track) => track.slug === slug);
}

export const musicSlugSchema = z.string().refine((slug) => getTrack(slug)?.enabled === true, {
  message: "Bài nhạc không có trong kho hoặc chưa được bật.",
});
