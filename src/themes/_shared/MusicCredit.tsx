import type { Track } from "@/data/music";
import { cn } from "@/lib/utils";

export interface MusicCreditProps {
  track?: Pick<Track, "license" | "credit">;
  /** Preview: no music, so no credit either. */
  hidden?: boolean;
  className?: string;
}

/** Text of the credit line, or null when the track needs none (only CC-BY requires attribution). */
export function musicCreditText(track: MusicCreditProps["track"]): string | null {
  const credit = track?.credit?.trim();
  if (track?.license !== "CC-BY-4.0" || !credit) return null;
  // CC BY 4.0 §3(a)(1)(B): must say the work was modified (cut, fade, loudness — scripts/fetch-music.mjs).
  return `Nhạc nền (đã chỉnh sửa): ${credit.replace(/\s+/g, " ")}`;
}

/** Server Component. CC-BY attribution at the end of the card, independent of Watermark (docs/07 §9). */
export function MusicCredit({ track, hidden, className }: MusicCreditProps) {
  const text = hidden ? null : musicCreditText(track);
  if (!text) return null;
  return <p className={cn("text-center text-xs text-muted", className)}>{text}</p>;
}
