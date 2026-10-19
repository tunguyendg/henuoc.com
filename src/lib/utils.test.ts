import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("bỏ giá trị falsy", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("class Tailwind sau ghi đè class trước cùng nhóm", () => {
    expect(cn("px-4 py-2", "px-6")).toBe("py-2 px-6");
  });

  it("hỗ trợ object điều kiện", () => {
    expect(cn("btn", { "btn-active": true, "btn-disabled": false })).toBe("btn btn-active");
  });
});
