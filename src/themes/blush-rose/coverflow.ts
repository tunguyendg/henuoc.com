// Pure math for the autoplay coverflow (no React, no DOM) so it can be unit-tested.

/** Wrap `index` into 0..total-1. */
export function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

/** Next slide index with wrap-around. `step` may be negative. */
export function nextIndex(active: number, total: number, step = 1): number {
  return wrapIndex(active + step, total);
}

/**
 * Signed shortest circular distance from `active` to `index`, in -total/2..total/2.
 * With an even total the opposite slide is +total/2 (stays on the right).
 */
export function circularOffset(index: number, active: number, total: number): number {
  if (total <= 0) return 0;
  const d = wrapIndex(index - active, total);
  return d > total / 2 ? d - total : d;
}

export interface SlideStyle {
  transform: string;
  opacity: number;
  zIndex: number;
  /** Far slides (|offset| > 2): invisible, not clickable, hidden from assistive tech. */
  hidden: boolean;
}

export function slideStyle(offset: number): SlideStyle {
  const abs = Math.abs(offset);
  const sign = offset < 0 ? -1 : 1;
  if (abs === 0) {
    return { transform: "translateX(0) scale(1)", opacity: 1, zIndex: 10, hidden: false };
  }
  if (abs === 1) {
    return {
      transform: `translateX(${sign * 62}%) rotateY(${-sign * 35}deg) scale(0.82)`,
      opacity: 0.55,
      zIndex: 9,
      hidden: false,
    };
  }
  if (abs === 2) {
    return {
      transform: `translateX(${sign * 105}%) rotateY(${-sign * 45}deg) scale(0.68)`,
      opacity: 0.22,
      zIndex: 8,
      hidden: false,
    };
  }
  return {
    transform: `translateX(${sign * 130}%) rotateY(${-sign * 45}deg) scale(0.6)`,
    opacity: 0,
    zIndex: 0,
    hidden: true,
  };
}
