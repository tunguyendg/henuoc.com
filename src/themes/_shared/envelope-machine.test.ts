import { describe, expect, it } from "vitest";
import { ENVELOPE_DURATION_MS, envelopeDurationMs, envelopeReducer } from "./envelope-machine";

describe("envelopeReducer", () => {
  it("goes closed → opening → open", () => {
    const opening = envelopeReducer("closed", { type: "OPEN" });
    expect(opening).toBe("opening");
    expect(envelopeReducer(opening, { type: "ANIMATION_END" })).toBe("open");
  });

  it("ignores OPEN once already opening or open (double tap)", () => {
    expect(envelopeReducer("opening", { type: "OPEN" })).toBe("opening");
    expect(envelopeReducer("open", { type: "OPEN" })).toBe("open");
  });

  it("ignores ANIMATION_END unless opening", () => {
    expect(envelopeReducer("closed", { type: "ANIMATION_END" })).toBe("closed");
    expect(envelopeReducer("open", { type: "ANIMATION_END" })).toBe("open");
  });

  it("SKIP opens from any state", () => {
    expect(envelopeReducer("closed", { type: "SKIP" })).toBe("open");
    expect(envelopeReducer("opening", { type: "SKIP" })).toBe("open");
    expect(envelopeReducer("open", { type: "SKIP" })).toBe("open");
  });
});

describe("envelopeDurationMs", () => {
  it("uses a 200ms fade when the user prefers reduced motion", () => {
    expect(envelopeDurationMs(true, 1500)).toBe(ENVELOPE_DURATION_MS.reduced);
  });

  it("uses the theme duration otherwise, never negative", () => {
    expect(envelopeDurationMs(false)).toBe(ENVELOPE_DURATION_MS.full);
    expect(envelopeDurationMs(false, 1200)).toBe(1200);
    expect(envelopeDurationMs(false, -5)).toBe(0);
  });
});
