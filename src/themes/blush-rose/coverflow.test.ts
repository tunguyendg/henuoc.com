import { describe, expect, it } from "vitest";
import { circularOffset, nextIndex, slideStyle, wrapIndex } from "./coverflow";

describe("wrapIndex / nextIndex", () => {
  it("wraps both directions", () => {
    expect(wrapIndex(-1, 6)).toBe(5);
    expect(wrapIndex(6, 6)).toBe(0);
    expect(nextIndex(5, 6)).toBe(0);
    expect(nextIndex(0, 6, -1)).toBe(5);
    expect(nextIndex(2, 6)).toBe(3);
  });
  it("is safe for empty and single", () => {
    expect(nextIndex(0, 0)).toBe(0);
    expect(nextIndex(0, 1)).toBe(0);
  });
});

describe("circularOffset", () => {
  it("total 1: always 0", () => {
    expect(circularOffset(0, 0, 1)).toBe(0);
  });
  it("total 2: neighbour is +1 from either side", () => {
    expect(circularOffset(1, 0, 2)).toBe(1);
    expect(circularOffset(0, 1, 2)).toBe(1);
  });
  it("total 3: wraps to -1 / +1", () => {
    expect(circularOffset(2, 0, 3)).toBe(-1);
    expect(circularOffset(0, 2, 3)).toBe(1);
  });
  it("total 6: spans -2..3 and wraps around the end", () => {
    const offsets = [0, 1, 2, 3, 4, 5].map((i) => circularOffset(i, 0, 6));
    expect(offsets).toEqual([0, 1, 2, 3, -2, -1]);
    expect(circularOffset(0, 5, 6)).toBe(1);
    expect(circularOffset(4, 5, 6)).toBe(-1);
  });
});

describe("slideStyle buckets", () => {
  it("centre is full size, top of the stack", () => {
    const style = slideStyle(0);
    expect(style).toMatchObject({ opacity: 1, hidden: false, zIndex: 10 });
    expect(style.transform).toBe("translateX(0) scale(1)");
  });
  it("neighbours tilt away from the centre", () => {
    expect(slideStyle(1).transform).toBe("translateX(62%) rotateY(-35deg) scale(0.82)");
    expect(slideStyle(-1).transform).toBe("translateX(-62%) rotateY(35deg) scale(0.82)");
    expect(slideStyle(1).opacity).toBe(0.55);
  });
  it("second ring is smaller and fainter", () => {
    expect(slideStyle(2).opacity).toBeLessThan(slideStyle(1).opacity);
    expect(slideStyle(-2).transform).toContain("scale(0.68)");
    expect(slideStyle(2).hidden).toBe(false);
  });
  it("beyond 2 is invisible and hidden", () => {
    for (const d of [3, -3, 5]) {
      expect(slideStyle(d)).toMatchObject({ opacity: 0, hidden: true });
    }
  });
});
