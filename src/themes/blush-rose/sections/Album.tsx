"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "../../_shared/use-client-env";
import type { ImageView } from "../../types";
import { circularOffset, nextIndex, slideStyle } from "../coverflow";
import { s } from "../styles";

const AUTOPLAY_MS = 3500;
const RESUME_MS = 6000;
const SWIPE_PX = 40;

/**
 * Autoplay coverflow: slides are stacked absolutely and moved with transform/opacity only
 * (coverflow.ts does the math). Server render = slide 0 active, no autoplay: `inView` starts false and
 * only the IntersectionObserver (after mount) can switch it on.
 * Autoplay pauses on: user interaction (resumes 6s after the last one), the pause button, the album
 * leaving the viewport, a hidden tab. prefers-reduced-motion: never autoplays.
 */
export function Album({ images }: { images: ImageView[] }) {
  const total = images.length;
  const regionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const holdTimer = useRef<number | undefined>(undefined);
  const pointer = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiped = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  const canPlay = total > 1 && !reducedMotion;
  const playing = canPlay && !userPaused && !holding && inView && tabVisible && !keyboardFocus;

  // User touched something: pause, auto-resume RESUME_MS after the last interaction.
  const interact = useCallback(() => {
    setHolding(true);
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setHolding(false), RESUME_MS);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      interact();
      setActive(((index % total) + total) % total);
    },
    [interact, total],
  );
  const step = useCallback(
    (by: number) => {
      interact();
      setActive((current) => nextIndex(current, total, by));
    },
    [interact, total],
  );

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () => setActive((current) => nextIndex(current, total)),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(id);
  }, [playing, total]);

  useEffect(() => {
    const region = regionRef.current;
    if (!region || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting);
      },
      { threshold: 0.3 },
    );
    observer.observe(region);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setTabVisible(document.visibilityState !== "hidden");
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  useEffect(() => () => window.clearTimeout(holdTimer.current), []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (total < 2) return;
    pointer.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    swiped.current = false;
    interact();
  }

  function onPointerEnd(event: PointerEvent<HTMLDivElement>) {
    const start = pointer.current;
    pointer.current = null;
    if (!start || start.id !== event.pointerId || event.type === "pointercancel") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
      step(dx < 0 ? 1 : -1);
    }
  }

  // WAI carousel: rotation stops while keyboard focus is inside (touch/mouse focus doesn't count).
  function onFocus(event: FocusEvent<HTMLDivElement>) {
    if (event.target.matches(":focus-visible")) setKeyboardFocus(true);
  }
  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false);
  }

  const nav = total > 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Album ảnh cưới"
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div
        ref={regionRef}
        tabIndex={0}
        role="group"
        aria-label="Các ảnh trong album, dùng phím mũi tên trái phải để chuyển ảnh"
        onKeyDown={onKeyDown}
        className={s.coverflowRegion}
      >
        <div
          className={s.coverflow}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onPointerLeave={onPointerEnd}
        >
          {images.map((image, index) => {
            const offset = circularOffset(index, active, total);
            const style = slideStyle(offset);
            const isSide = offset !== 0 && !style.hidden;
            return (
              <div
                key={`${image.src}-${index}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`Ảnh ${index + 1} trên ${total}`}
                aria-hidden={style.hidden || undefined}
                inert={style.hidden || undefined}
                data-side={isSide}
                onClick={() => {
                  if (isSide && !swiped.current) goTo(index);
                }}
                style={{
                  transform: style.transform,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                  pointerEvents: style.hidden ? "none" : undefined,
                }}
                className={s.coverflowSlide}
              >
                <div className="relative size-full overflow-hidden border-[6px] border-[color-mix(in_srgb,var(--br-paper)_50%,white)] shadow-[0_8px_24px_color-mix(in_srgb,var(--br-wine)_25%,transparent)]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 480px) 52vw, 260px"
                    draggable={false}
                    className="object-cover select-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live={playing ? "off" : "polite"}>
        Ảnh {active + 1} trên {total}
      </p>

      {nav && (
        <div className="mt-1 flex flex-wrap items-center justify-center">
          {canPlay && (
            <button
              type="button"
              aria-label={userPaused ? "Phát trình chiếu" : "Tạm dừng trình chiếu"}
              onClick={() => setUserPaused((paused) => !paused)}
              className={cn(
                s.coverflowToggle,
                "inline-flex size-11 items-center justify-center text-(--br-wine) [&_svg]:size-4",
              )}
            >
              {userPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            </button>
          )}
          {images.map((image, index) => (
            <button
              key={`dot-${image.src}-${index}`}
              type="button"
              aria-label={`Ảnh ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => goTo(index)}
              className={s.coverflowDot}
            />
          ))}
        </div>
      )}
    </div>
  );
}
