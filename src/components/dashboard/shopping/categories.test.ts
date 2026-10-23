import { describe, expect, it } from "vitest";
import { categoryLabel, parseCategory } from "./categories";

describe("parseCategory", () => {
  it("accepts known categories and drops unknown ones", () => {
    expect(parseCategory("an-hoi")).toBe("an-hoi");
    expect(parseCategory(["co-dau", "x"])).toBe("co-dau");
    expect(parseCategory("<script>")).toBeUndefined();
    expect(parseCategory(undefined)).toBeUndefined();
  });

  it("has a Vietnamese label", () => {
    expect(categoryLabel("qua-cam-on")).toBe("Quà cảm ơn");
  });
});
