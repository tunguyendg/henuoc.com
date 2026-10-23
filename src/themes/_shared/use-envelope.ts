import { useCallback, useEffect, useReducer } from "react";
import { envelopeDurationMs, envelopeReducer, type EnvelopeState } from "./envelope-machine";
import { lockBodyScroll } from "./scroll-lock";
import { usePrefersReducedMotion } from "./use-client-env";

export interface UseEnvelopeOptions {
  /** Theme passes `music.unlock`. Runs synchronously inside the tap, before anything else. */
  onOpen?: () => void;
  /** Full animation length; reduced motion always uses a 200ms fade. */
  durationMs?: number;
  /** Lock page scroll until open. Default true. */
  lockScroll?: boolean;
}

export interface EnvelopeController {
  state: EnvelopeState;
  isOpen: boolean;
  reducedMotion: boolean;
  /** Effective duration for the current phase; themes use it for their CSS transitions. */
  durationMs: number;
  /** Call from the tap/click handler. */
  open: () => void;
  /** Optional: call from onTransitionEnd/onAnimationEnd to finish early. A timer also finishes it. */
  finish: () => void;
  /** Jump straight to open (e.g. "Bỏ qua"). Does NOT unlock music. */
  skip: () => void;
}

export function useEnvelope({
  onOpen,
  durationMs,
  lockScroll = true,
}: UseEnvelopeOptions = {}): EnvelopeController {
  const [state, dispatch] = useReducer(envelopeReducer, "closed");
  const reducedMotion = usePrefersReducedMotion();
  const duration = envelopeDurationMs(reducedMotion, durationMs);

  const open = useCallback(() => {
    // FIRST and synchronous: audio.play() is only allowed while the tap is still the "active user
    // gesture". Any await/setTimeout/animation before this line and Safari/Zalo block the music.
    onOpen?.();
    dispatch({ type: "OPEN" });
  }, [onOpen]);

  const finish = useCallback(() => dispatch({ type: "ANIMATION_END" }), []);
  const skip = useCallback(() => dispatch({ type: "SKIP" }), []);

  // Fallback so we never get stuck in "opening" if transitionend never fires (tab hidden, no CSS).
  useEffect(() => {
    if (state !== "opening") return;
    const id = window.setTimeout(() => dispatch({ type: "ANIMATION_END" }), duration);
    return () => window.clearTimeout(id);
  }, [state, duration]);

  const isOpen = state === "open";
  useEffect(() => {
    if (!lockScroll || isOpen) return;
    return lockBodyScroll();
  }, [lockScroll, isOpen]);

  return { state, isOpen, reducedMotion, durationMs: duration, open, finish, skip };
}
