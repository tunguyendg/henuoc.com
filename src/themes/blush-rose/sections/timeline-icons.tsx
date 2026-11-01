import type { ReactNode } from "react";
import type { TimelineIcon } from "../../types";

// Hand-drawn line icons: 24×24 box, stroke currentColor 1.5, decorative (the title carries the meaning).

const PATHS: Record<TimelineIcon, ReactNode> = {
  camera: (
    <>
      <path d="M4 8.5h3l1.5-2.5h7L17 8.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  rings: (
    <>
      <circle cx="9" cy="14" r="5" />
      <circle cx="15" cy="14" r="5" />
      <path d="m7.5 6.5 1.5-2.5 1.5 2.5-1.5 1.5Z" />
    </>
  ),
  glasses: (
    <>
      <path d="M5 4h6l-.5 6a2.5 2.5 0 0 1-5 0Z" />
      <path d="M8 12.5V20M5.5 20h5" />
      <path d="M14 7.5 18.5 5.5l.8 4.2a3 3 0 0 1-3.6 3.4" />
      <path d="M16.5 13.2V20M14 20h5" />
    </>
  ),
  cake: (
    <>
      <path d="M12 3v3" />
      <path d="M12 3.2c.9.9.9 1.9 0 2.6-.9-.7-.9-1.7 0-2.6Z" />
      <rect x="8" y="6.5" width="8" height="4" rx="1" />
      <rect x="5.5" y="10.5" width="13" height="4" rx="1" />
      <rect x="3" y="14.5" width="18" height="5" rx="1" />
    </>
  ),
  candles: (
    <>
      <path d="M8 3.2c1 1.1 1.2 2.3 0 3.6-1.2-1.3-1-2.5 0-3.6Z" />
      <path d="M8 6.8V10" />
      <rect x="5.5" y="10" width="5" height="10" rx="0.75" />
      <path d="M16 5.7c1 1.1 1.2 2.3 0 3.6-1.2-1.3-1-2.5 0-3.6Z" />
      <path d="M16 9.3v3.2" />
      <rect x="13.5" y="12.5" width="5" height="7.5" rx="0.75" />
      <path d="M3.5 20h17" />
    </>
  ),
};

export function TimelineGlyph({ icon, className }: { icon: TimelineIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {PATHS[icon]}
    </svg>
  );
}
