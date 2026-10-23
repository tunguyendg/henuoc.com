// 🔴 TONY TỰ CODE (docs/07-THEMES.md §3, §10; AGENTS.md §7). T-013 only ships the contract + a silent
// stub so themes can be wired up. Do not let an agent fill this in.

export interface MusicController {
  isPlaying: boolean;
  isMuted: boolean;
  /**
   * Must be called SYNCHRONOUSLY inside the tap handler (useEnvelope().open does this first thing).
   * Browsers only allow audio.play() with sound while the user gesture is still "active".
   */
  unlock: () => void;
  toggle: () => void;
}

const noop = () => {};

const SILENT: MusicController = { isPlaying: false, isMuted: false, unlock: noop, toggle: noop };

/*
 * TODO(Tony, T-013 🔴) — implement useMusic:
 *
 * 1. src undefined or opts.disabled (theme passes `mode === "preview"`) → return a silent controller
 *    (like SILENT). Never create an Audio element in that case.
 * 2. Create ONE `new Audio(src)` lazily on the client (useRef; not during SSR, not in render),
 *    `preload = "none"`, `loop = true`. Do not download the MP3 before the guest taps.
 * 3. unlock(): called synchronously in the tap handler. If the guest has not muted, call
 *    `audio.play()` RIGHT THERE — no await before it, no setTimeout, no "after animation".
 *    play() returns a Promise: `.then(() => setPlaying(true)).catch(() => setPlaying(false))`.
 *    Swallow the error (Zalo/odd browsers refuse) → ♪ button just shows "off", invitation still opens.
 *    unlock() twice must not restart the song.
 * 4. toggle(): playing → pause + remember muted; not playing → play (it is itself a tap, so it is a
 *    valid gesture) + clear muted.
 * 5. Remember "muted" in sessionStorage (e.g. key "henuoc:music-muted"), wrapped in try/catch
 *    (Safari private mode / some webviews throw). Muted → unlock() must not start the music again.
 * 6. document "visibilitychange": hidden → pause (remember it was playing); visible → resume ONLY if
 *    it was playing before and the guest has not muted.
 * 7. Keep isPlaying in sync with the element: listen to "play"/"pause"/"ended" events instead of
 *    trusting your own flags.
 * 8. Cleanup on unmount / src change: remove listeners, `audio.pause()`, `audio.src = ""`.
 * 9. Return a stable object (useMemo/useCallback) so <MusicToggle> and useEnvelope({ onOpen }) do
 *    not re-render needlessly.
 *
 * QA (docs/07 §8): no autoplay; plays right on the envelope tap (test Zalo iOS); ♪ always visible;
 * switching tab / locking screen pauses, coming back resumes unless muted; preview never plays.
 */
export function useMusic(src: string | undefined, opts?: { disabled?: boolean }): MusicController {
  void src;
  void opts;
  return SILENT;
}
