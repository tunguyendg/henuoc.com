import { useMemo, useSyncExternalStore } from "react";
import { diffParts, type CountdownParts } from "./countdown";

// A 1-second clock as an external store. Ticks only while the tab is visible (no wasted timers on
// a backgrounded Zalo webview) and jumps to the right value as soon as the tab comes back.
function subscribeClock(onTick: () => void) {
  let id: number | undefined;
  const start = () => {
    if (id !== undefined) return;
    onTick();
    id = window.setInterval(onTick, 1000);
  };
  const stop = () => {
    window.clearInterval(id);
    id = undefined;
  };
  const sync = () => (document.visibilityState === "hidden" ? stop() : start());
  sync();
  document.addEventListener("visibilitychange", sync);
  return () => {
    stop();
    document.removeEventListener("visibilitychange", sync);
  };
}

// Whole seconds so the snapshot is stable within a second (useSyncExternalStore compares with Object.is).
const getNowSeconds = () => Math.floor(Date.now() / 1000);
// Server + hydration render: no clock → null, so SSR HTML never disagrees with the client.
const getServerNow = () => null;

/**
 * Countdown to `date` (ISO string or Date). Returns null on the server, during hydration and for an
 * invalid/missing date — render a placeholder (or nothing) in that case.
 */
export function useCountdown(date: string | Date | undefined): CountdownParts | null {
  const nowSeconds = useSyncExternalStore(subscribeClock, getNowSeconds, getServerNow);
  const targetMs = date === undefined ? NaN : new Date(date).getTime();
  return useMemo(() => {
    if (nowSeconds === null || Number.isNaN(targetMs)) return null;
    return diffParts(new Date(targetMs), new Date(nowSeconds * 1000));
  }, [nowSeconds, targetMs]);
}
