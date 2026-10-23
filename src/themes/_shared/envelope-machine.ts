// Pure state machine for the "open the envelope" intro. Themes draw the envelope; this only decides
// which phase we are in. closed --OPEN--> opening --ANIMATION_END--> open. SKIP jumps straight to open.

export type EnvelopeState = "closed" | "opening" | "open";

export type EnvelopeEvent = { type: "OPEN" } | { type: "ANIMATION_END" } | { type: "SKIP" };

/** Full opening animation (flap + fade) and the reduced-motion fallback (fade only, docs/07 §10). */
export const ENVELOPE_DURATION_MS = { full: 900, reduced: 200 } as const;

export function envelopeReducer(state: EnvelopeState, event: EnvelopeEvent): EnvelopeState {
  switch (event.type) {
    case "OPEN":
      return state === "closed" ? "opening" : state;
    case "ANIMATION_END":
      return state === "opening" ? "open" : state;
    case "SKIP":
      return "open";
  }
}

export function envelopeDurationMs(
  reducedMotion: boolean,
  fullMs: number = ENVELOPE_DURATION_MS.full,
) {
  return reducedMotion ? ENVELOPE_DURATION_MS.reduced : Math.max(0, fullMs);
}
