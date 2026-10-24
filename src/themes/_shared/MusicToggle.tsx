"use client";

import { Music, VolumeX } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { MusicController } from "./use-music";

export interface MusicToggleProps {
  music: MusicController;
  credit?: string;
  /** Render nothing (no music track, or preview). */
  hidden?: boolean;
  className?: string;
  /** Icon slots; default ♪ when playing, muted speaker otherwise. */
  icon?: ReactNode;
  offIcon?: ReactNode;
}

/** Floating ♪ button, bottom-right, clear of the notch / home indicator. */
export function MusicToggle({ music, credit, hidden, className, icon, offIcon }: MusicToggleProps) {
  if (hidden) return null;
  const on = music.isPlaying;
  return (
    <div className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex items-end gap-3">
      {credit?.trim() && (
        <small className="max-w-[min(16rem,calc(100vw-6rem))] rounded-xl bg-surface/95 p-2 text-xs leading-snug break-words whitespace-pre-line text-muted shadow-card">
          {credit}
        </small>
      )}
      <button
        type="button"
        onClick={music.toggle}
        aria-pressed={on}
        aria-label={on ? "Tắt nhạc" : "Bật nhạc"}
        className={cn(
          "inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface/90 text-rose-700 shadow-card backdrop-blur",
          "transition-colors duration-200 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600",
          "[&_svg]:size-5",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(on && "motion-safe:animate-[spin_6s_linear_infinite]")}
        >
          {on ? (icon ?? <Music />) : (offIcon ?? <VolumeX />)}
        </span>
      </button>
    </div>
  );
}
