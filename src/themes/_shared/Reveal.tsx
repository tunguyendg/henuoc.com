"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "./use-client-env";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Extra delay in ms, e.g. to stagger cards. */
  delayMs?: number;
}

/**
 * Fades/slides children in once when they enter the viewport.
 * SSR HTML is fully visible. Only after mount, and only for elements still below the fold, do we
 * set data-reveal="hidden" directly on the DOM node (no React state → no extra render). So: no JS,
 * a JS error, reduced motion or no IntersectionObserver → content simply stays visible.
 */
export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    // Already on screen → leave it alone (hiding it now would flicker).
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.dataset.reveal = "shown";
    };
  }, []);

  return (
    <div
      ref={ref}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={cn(
        "transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none",
        "data-[reveal=hidden]:translate-y-4 data-[reveal=hidden]:opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
