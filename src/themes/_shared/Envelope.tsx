"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useHydrated } from "./use-client-env";
import { useEnvelope } from "./use-envelope";

export interface EnvelopeProps {
  /** Theme passes `music.unlock` (from a client leaf that also renders <MusicToggle>). */
  onOpen?: () => void;
  /** Cover content shown above the envelope: couple names, date, guest salutation. */
  children?: ReactNode;
  buttonLabel?: string;
  durationMs?: number;
  className?: string;
  /**
   * CSS selector of the element that receives focus once the envelope is open (the invitation
   * content). Default "main". It gets tabindex=-1 if it is not focusable already.
   */
  focusAfterOpen?: string;
}

/**
 * Minimal shared envelope overlay. Progressive enhancement: the invitation underneath is fully SSR'd;
 * this overlay renders ONLY after hydration, so if JS fails or is off the guest just reads the page.
 * Trade-off: the cover flashes for a moment before the overlay appears on slow devices.
 */
export function Envelope({
  onOpen,
  children,
  buttonLabel = "Mở thiệp",
  durationMs,
  className,
  focusAfterOpen = "main",
}: EnvelopeProps) {
  const hydrated = useHydrated();
  const envelope = useEnvelope({ onOpen, durationMs });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const wasShown = useRef(false);

  // Focus the "Mở thiệp" button as soon as the overlay appears.
  useEffect(() => {
    if (hydrated) {
      wasShown.current = true;
      buttonRef.current?.focus({ preventScroll: true });
    }
  }, [hydrated]);

  // Overlay is gone → move focus to the invitation instead of leaving it on <body>.
  const { isOpen } = envelope;
  useEffect(() => {
    if (!isOpen || !wasShown.current) return;
    const target = document.querySelector<HTMLElement>(focusAfterOpen);
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }, [isOpen, focusAfterOpen]);

  // Focus trap: aria-modal hides the page from screen readers, this keeps Tab out of it too.
  // The overlay has a single control, so Tab / Shift+Tab always land back on it.
  function trapFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      buttonRef.current?.focus();
    }
  }

  if (!hydrated || envelope.isOpen) return null;

  const opening = envelope.state === "opening";
  const { reducedMotion } = envelope;
  const duration = envelope.durationMs;
  // Full motion: flap swings open over ~55%, then the overlay fades out over the rest.
  const flapMs = reducedMotion ? 0 : Math.round(duration * 0.55);
  const fadeMs = reducedMotion ? duration : duration - flapMs;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Thiệp mời"
      data-state={envelope.state}
      onKeyDown={trapFocus}
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 overflow-y-auto bg-canvas px-6 py-10 text-center text-ink",
        "pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]",
        "transition-opacity ease-out",
        opening && "pointer-events-none opacity-0",
        className,
      )}
      style={{
        transitionDuration: `${fadeMs}ms`,
        transitionDelay: opening ? `${flapMs}ms` : "0ms",
      }}
    >
      {children}

      <div
        aria-hidden="true"
        className="relative aspect-[4/3] w-[min(80vw,360px)] [perspective:1000px]"
      >
        <div className="absolute inset-0 rounded-(--radius-card) border border-border bg-rose-50 shadow-card" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 rounded-b-(--radius-card) bg-rose-100 [clip-path:polygon(0_100%,50%_15%,100%_100%)]" />
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-3/5 origin-top bg-rose-100 [backface-visibility:hidden] [clip-path:polygon(0_0,100%_0,50%_100%)]",
            "transition-transform ease-out motion-reduce:transition-none",
            opening && !reducedMotion && "[transform:rotateX(180deg)]",
          )}
          style={{ transitionDuration: `${flapMs}ms` }}
        />
        <div className="absolute top-[52%] left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-600 shadow-card" />
      </div>

      <button
        ref={buttonRef}
        type="button"
        onClick={envelope.open}
        disabled={opening}
        className="inline-flex h-12 min-w-44 items-center justify-center rounded-(--radius-btn) bg-rose-600 px-7 text-base font-semibold text-white transition-colors duration-200 hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
