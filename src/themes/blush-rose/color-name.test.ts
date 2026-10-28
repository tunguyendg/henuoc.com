import { describe, expect, it } from "vitest";
import { colorName } from "./color-name";

describe("colorName", () => {
  it.each([
    ["#4A161A", "đỏ đô"],
    ["#E8B9C3", "hồng nhạt"],
    ["#F3EDE3", "kem"],
    ["#000000", "đen"],
    ["#FFFFFF", "trắng"],
    ["#4a161a", "đỏ đô"],
  ])("%s → %s", (hex, name) => {
    expect(colorName(hex)).toBe(name);
  });

  it("input sai không ném lỗi", () => {
    expect(colorName("xyz")).toBe("màu khác");
  });
});
