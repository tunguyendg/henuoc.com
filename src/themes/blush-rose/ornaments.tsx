import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { s } from "./styles";

export const FLOWER_SRC = "/images/ornaments/redoute/rosa-carolina-corymbosa.webp";
const FLOWER_W = 828;
const FLOWER_H = 1200;

// Where the interesting part of the painting sits, as a fraction of the image.
const FOCUS = {
  bloom: { x: 0.5, y: 0.28 }, // the three open roses
  leaves: { x: 0.3, y: 0.62 }, // the lower leafy branch
} as const;

interface FlowerSprigProps {
  /** Which corner of the (position: relative, overflow-hidden) parent the sprig hangs from. */
  corner: "tl" | "tr" | "bl" | "br";
  /** Distance in px from that corner to the focus point of the painting. */
  inset?: readonly [number, number];
  /** Rendered image width in px; height follows the 828×1200 ratio. */
  width?: number;
  focus?: keyof typeof FOCUS;
  rotate?: number;
  flip?: boolean;
  opacity?: number;
  className?: string;
}

/**
 * One cropped branch of the single Redouté painting. The crop is a soft radial mask around the focus
 * point, applied on the <img> itself: mix-blend-mode: multiply (drops the old paper colour on a cream
 * background) only works when no ancestor between the image and the paper creates a stacking context
 * or isolates the group. Rotate/flip use transform-origin = focus point so the roses stay put.
 * Never place this on a wine-coloured surface (multiply would turn it black).
 */
export function FlowerSprig({
  corner,
  inset = [24, 24],
  width = 180,
  focus = "bloom",
  rotate = 0,
  flip = false,
  opacity = 1,
  className,
}: FlowerSprigProps) {
  const height = Math.round((width * FLOWER_H) / FLOWER_W);
  const fx = FOCUS[focus].x;
  const fy = FOCUS[focus].y;
  const [ix, iy] = inset;
  const mask = `radial-gradient(circle ${Math.round(width * 0.42)}px at ${fx * 100}% ${fy * 100}%, #000 42%, transparent 100%)`;

  const style: CSSProperties = {
    width,
    height,
    opacity,
    transformOrigin: `${fx * 100}% ${fy * 100}%`,
    transform: `rotate(${rotate}deg)${flip ? " scaleX(-1)" : ""}`,
    maskImage: mask,
    WebkitMaskImage: mask,
    mixBlendMode: "multiply",
    // The scan's paper is darker than ours; lift it to ~white so multiply leaves no grey patch.
    filter: "brightness(1.15)",
  };
  if (corner === "tl" || corner === "bl") style.left = ix - fx * width;
  else style.right = ix - (1 - fx) * width;
  if (corner === "tl" || corner === "tr") style.top = iy - fy * height;
  else style.bottom = iy - (1 - fy) * height;

  return (
    <Image
      src={FLOWER_SRC}
      alt=""
      aria-hidden="true"
      width={FLOWER_W}
      height={FLOWER_H}
      sizes={`${width}px`}
      style={style}
      className={cn("pointer-events-none absolute max-w-none select-none", className)}
    />
  );
}

/** Wax seal: an irregular round blob (not a heart) with the couple's initials in gold. */
export function WaxSeal({
  initials,
  className,
}: {
  initials: readonly [string, string];
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M50 4 C66 3 80 10 90 22 C98 33 97 48 95 58 C93 72 84 84 70 91 C58 97 44 97 32 92 C18 86 8 74 5 60 C2 46 6 30 16 19 C26 8 38 5 50 4 Z"
        className="fill-(--br-wine)"
      />
      <path
        d="M50 4 C66 3 80 10 90 22 C98 33 97 48 95 58 C93 72 84 84 70 91 C58 97 44 97 32 92 C18 86 8 74 5 60 C2 46 6 30 16 19 C26 8 38 5 50 4 Z"
        className="fill-none stroke-(color:--br-gold) opacity-50"
        strokeWidth="1.2"
        transform="translate(1.5 1.5) scale(.97)"
      />
      <circle
        cx="50"
        cy="50"
        r="33"
        className="fill-none stroke-(color:--br-gold)"
        strokeWidth="1.2"
      />
      <ellipse
        cx="36"
        cy="26"
        rx="14"
        ry="6"
        transform="rotate(-30 36 26)"
        className="fill-(--br-gold) opacity-20"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        className={cn(s.title, "fill-(--br-gold)")}
        style={{ fontSize: 26, fontWeight: 600 }}
      >
        {initials[0]}
        <tspan style={{ fontSize: 14 }} dx="1" dy="-4">
          &amp;
        </tspan>
        <tspan dx="1" dy="4">
          {initials[1]}
        </tspan>
      </text>
    </svg>
  );
}

/** Thin gold rule with a dot, used under section headings. Decorative only. */
export function GoldRule({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 8"
      aria-hidden="true"
      focusable="false"
      className={cn("h-2 w-30", className)}
    >
      <path d="M0 4 H50 M70 4 H120" className="stroke-(color:--br-gold)" strokeWidth="1" />
      <circle cx="60" cy="4" r="2.2" className="fill-(--br-gold)" />
    </svg>
  );
}

export function SectionHeading({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h2 id={id} className={cn(s.title, "text-sm font-semibold tracking-[0.22em] uppercase")}>
        {children}
      </h2>
      <GoldRule />
    </div>
  );
}
