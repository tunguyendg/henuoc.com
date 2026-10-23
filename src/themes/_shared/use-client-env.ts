import { useSyncExternalStore } from "react";

// Browser-only facts read without setState-in-effect. useSyncExternalStore renders the server
// snapshot during SSR *and* hydration, then re-renders with the client snapshot → no mismatch.

const noopSubscribe = () => () => {};

/** false on the server and during hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.(REDUCED_MOTION).matches;
}

/** Live `prefers-reduced-motion`. false on the server. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
}
