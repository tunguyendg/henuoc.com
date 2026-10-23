import { describe, expect, it } from "vitest";
import { first } from "./search-params";

describe("first", () => {
  it("returns a string as-is, the first of an array, undefined otherwise", () => {
    expect(first("a")).toBe("a");
    expect(first(["a", "b"])).toBe("a");
    expect(first([])).toBeUndefined();
    expect(first(undefined)).toBeUndefined();
  });
});
