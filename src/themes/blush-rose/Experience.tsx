"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type KeyboardEvent } from "react";
import { MusicToggle } from "../_shared/MusicToggle";
import { useHydrated } from "../_shared/use-client-env";
import { useEnvelope } from "../_shared/use-envelope";
import { useMusic } from "../_shared/use-music";
import type { ImageView, ThemeProps } from "../types";
import { FlowerSprig, WaxSeal } from "./ornaments";
import { s } from "./styles";
import { cn } from "@/lib/utils";

// The one client leaf of the theme. `music.unlock` is a function and cannot cross the Server → Client
// boundary, so useMusic, the hand-drawn envelope and the ♪ button share this tree. Everything the
// cover needs arrives as plain serialisable props.

interface ExperienceProps {
  musicSrc?: string;
  mode: ThemeProps["mode"];
  names: string;
  initials: readonly [string, string];
  dateLabel?: string;
  salutation?: string;
  photo?: ImageView;
}

const OPEN_MS = 1100;
const FOCUSABLE_AFTER_OPEN = "main";

export function Experience({
  musicSrc,
  mode,
  names,
  initials,
  dateLabel,
  salutation,
  photo,
}: ExperienceProps) {
  // preview = builder: no music at all (docs/07 §10).
  const music = useMusic(musicSrc, { disabled: mode === "preview" });
  const hydrated = useHydrated();
  const envelope = useEnvelope({ onOpen: music.unlock, durationMs: OPEN_MS });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasShown = useRef(false);

  // Progressive enhancement: the overlay exists only after hydration, so without JS the guest just
  // reads the page. Focus goes to the "Mở thiệp" button as soon as it appears.
  useEffect(() => {
    if (!hydrated) return;
    wasShown.current = true;
    buttonRef.current?.focus({ preventScroll: true });
  }, [hydrated]);

  // Overlay gone → move focus to <main> instead of dropping it on <body>.
  const { isOpen } = envelope;
  useEffect(() => {
    if (!isOpen || !wasShown.current) return;
    const target = document.querySelector<HTMLElement>(FOCUSABLE_AFTER_OPEN);
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }, [isOpen]);

  // Focus trap: a single real control in the dialog (the seal is a pointer shortcut, tabIndex -1).
  function trapFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      buttonRef.current?.focus();
    }
  }

  const musicToggle = <MusicToggle music={music} hidden={!musicSrc || mode === "preview"} />;
  if (!hydrated || envelope.isOpen) return musicToggle;

  const opening = envelope.state === "opening";
  const { reducedMotion } = envelope;
  const duration = envelope.durationMs;
  // Full motion: envelope animates for ~55% of the time, then the overlay fades out. Reduced: 200ms fade.
  const flapMs = reducedMotion ? 0 : Math.round(duration * 0.55);
  const fadeMs = reducedMotion ? duration : duration - flapMs;
  const sealPosition: CSSProperties = photo
    ? { left: "68%", top: "80%" }
    : { left: "50%", top: "62%" };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Thiệp mời"
        data-state={envelope.state}
        onKeyDown={trapFocus}
        className={cn(
          s.overlay,
          s.paper,
          "fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-x-hidden overflow-y-auto px-6 py-10 text-center",
          "pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]",
          "transition-opacity ease-out",
          opening && "pointer-events-none opacity-0",
        )}
        style={
          {
            "--br-open-ms": `${duration}ms`,
            transitionDuration: `${fadeMs}ms`,
            transitionDelay: opening ? `${flapMs}ms` : "0ms",
          } as CSSProperties
        }
      >
        <div className="relative z-10 flex max-w-full flex-col items-center gap-1">
          <p className={cn(s.title, "text-xs font-semibold tracking-[0.24em] uppercase")}>
            Thiệp cưới
          </p>
          <p className={cn(s.script, "max-w-full text-5xl")}>{names}</p>
          {dateLabel && <p className="text-lg">{dateLabel}</p>}
          {salutation && <p className="mt-2 max-w-full font-semibold break-words">{salutation}</p>}
        </div>

        <div className={s.stage}>
          {/* Behind the envelope, peeking out of its top-right. No ancestor may create a stacking
              context between this image and the overlay paper, or multiply stops working. */}
          <FlowerSprig corner="tr" inset={[-10, 30]} width={200} rotate={18} className="-z-10" />
          <svg
            viewBox="0 0 400 290"
            aria-hidden="true"
            focusable="false"
            className={cn(s.layer, s.envBack)}
          >
            <rect
              x="8"
              y="70"
              width="384"
              height="212"
              rx="6"
              className="fill-(--br-card) stroke-(color:--br-gold)"
              strokeWidth="1.2"
            />
          </svg>

          {photo && (
            <div className={cn(s.photo, "z-[4]")}>
              <div className="relative size-full overflow-hidden border-[5px] border-[color-mix(in_srgb,var(--br-paper)_50%,white)] shadow-[0_6px_18px_color-mix(in_srgb,var(--br-wine)_30%,transparent)]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 480px) 40vw, 160px"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <svg
            viewBox="0 0 400 290"
            aria-hidden="true"
            focusable="false"
            className={cn(s.layer, s.envFront, "z-[2]")}
          >
            <path
              d="M8 70 L200 188 L8 282 Z"
              className="fill-(--br-card) stroke-(color:--br-gold)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M392 70 L200 188 L392 282 Z"
              className="fill-(--br-card) stroke-(color:--br-gold)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M8 282 L200 168 L392 282 Z"
              className="fill-(--br-card) stroke-(color:--br-gold)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>

          <svg
            viewBox="0 0 400 290"
            aria-hidden="true"
            focusable="false"
            className={cn(s.layer, s.flap, "z-[3]")}
            style={{ pointerEvents: "none" }}
          >
            <path
              d="M8 70 H392 L200 190 Z"
              className="fill-(--br-card) stroke-(color:--br-gold)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>

          <button
            type="button"
            tabIndex={-1}
            aria-label="Mở thiệp"
            onClick={envelope.open}
            disabled={opening}
            className={cn(
              s.seal,
              "z-[5] aspect-square cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--br-wine)",
            )}
            style={sealPosition}
          >
            <WaxSeal initials={initials} className="size-full drop-shadow-md" />
          </button>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={envelope.open}
          disabled={opening}
          className={cn(
            s.title,
            "relative z-10 inline-flex h-12 min-w-44 items-center justify-center rounded-(--radius-btn) bg-(--br-wine) px-7 text-base font-semibold text-(--br-paper) transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--br-wine)_85%,white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--br-wine)",
          )}
        >
          Mở thiệp
        </button>
      </div>
      {musicToggle}
    </>
  );
}
