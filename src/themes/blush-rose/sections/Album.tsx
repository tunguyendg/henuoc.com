"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "../../_shared/use-client-env";
import type { ImageView } from "../../types";
import { s } from "../styles";

const navButton =
  "inline-flex size-11 items-center justify-center rounded-full border border-(--br-wine)/45 bg-transparent text-(--br-wine) transition-colors duration-200 hover:bg-(--br-card) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--br-wine) disabled:opacity-35 [&_svg]:size-5";

/**
 * Coverflow: a native scroll-snap row. The centred slide is found with an IntersectionObserver on a
 * thin band in the middle of the track; CSS tilts/scales the neighbours from data-pos.
 */
export function Album({ images }: { images: ImageView[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const total = images.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isInteger(index)) setActive(index);
        }
      },
      { root: track, rootMargin: "0px -45% 0px -45%", threshold: 0 },
    );
    for (const slide of track.querySelectorAll("[data-index]")) observer.observe(slide);
    return () => observer.disconnect();
  }, [total]);

  const goTo = useCallback(
    (target: number) => {
      const track = trackRef.current;
      if (!track) return;
      const index = Math.min(Math.max(target, 0), total - 1);
      const slide = track.querySelector<HTMLElement>(`[data-index="${index}"]`);
      if (!slide) return;
      const left = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;
      track.scrollTo({ left, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [total, reducedMotion],
  );

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    }
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Album ảnh cưới">
      <div
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label="Các ảnh trong album, dùng phím mũi tên trái phải để chuyển ảnh"
        onKeyDown={onKeyDown}
        className={s.track}
      >
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            data-index={index}
            data-pos={index === active ? "active" : index < active ? "before" : "after"}
            role="group"
            aria-roledescription="slide"
            aria-label={`Ảnh ${index + 1} trên ${total}`}
            className={s.slide}
          >
            <div className="relative aspect-4/5 overflow-hidden border-[6px] border-[color-mix(in_srgb,var(--br-paper)_50%,white)] shadow-[0_8px_24px_color-mix(in_srgb,var(--br-wine)_25%,transparent)]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 480px) 68vw, 330px"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Ảnh trước"
          disabled={active === 0}
          onClick={() => goTo(active - 1)}
          className={navButton}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <p aria-live="polite" className={cn(s.title, "min-w-14 text-center text-sm tabular-nums")}>
          {active + 1}/{total}
        </p>
        <button
          type="button"
          aria-label="Ảnh sau"
          disabled={active === total - 1}
          onClick={() => goTo(active + 1)}
          className={navButton}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
