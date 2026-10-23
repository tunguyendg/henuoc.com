"use client";

import { Music, VolumeX } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { MusicController } from "./use-music";

export interface MusicToggleProps {
  music: MusicController;
  /** Render nothing (no music track, or preview). */
  hidden?: boolean;
  className?: string;
  /** Icon slots; default ♪ when playing, muted speaker otherwise. */
  icon?: ReactNode;
  offIcon?: ReactNode;
}

/** Floating ♪ button, bottom-right, clear of the notch / home indicator. */
export function MusicToggle({ music, hidden, className, icon, offIcon }: MusicToggleProps) {
  if (hidden) return null;
  const on = music.isPlaying;
  return (
    <button
      type="button"
      onClick={music.toggle}
      aria-pressed={on}
      aria-label={on ? "Tắt nhạc" : "Bật nhạc"}
      className={cn(
        "fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40",
        "inline-flex size-12 items-center justify-center rounded-full border border-border bg-surface/90 text-rose-700 shadow-card backdrop-blur",
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
  );
}
