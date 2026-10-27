import { describe, expect, it } from "vitest";
import { formatLunarDate, solarToLunar } from "./lunar";

describe("Vietnamese lunar calendar (UTC+7)", () => {
  it.each([
    ["2026-01-03", 15, 11, 2025, false, "Ất Tỵ"],
    ["2025-01-29", 1, 1, 2025, false, "Ất Tỵ"],
    ["2026-02-17", 1, 1, 2026, false, "Bính Ngọ"],
    ["2025-07-25", 1, 6, 2025, true, "Ất Tỵ"],
    ["2025-06-25", 1, 6, 2025, false, "Ất Tỵ"],
    ["2025-08-23", 1, 7, 2025, false, "Ất Tỵ"],
    ["2026-02-16", 29, 12, 2025, false, "Ất Tỵ"],
  ])("converts %s", (input, day, month, year, leap, canChi) => {
    expect(solarToLunar(input)).toEqual({ day, month, year, leap, canChi });
  });
  it("formats normal and leap months", () => {
    expect(formatLunarDate(solarToLunar("2026-01-03"))).toBe("tức ngày 15 tháng 11 năm Ất Tỵ");
    expect(formatLunarDate(solarToLunar("2025-07-25"))).toBe("tức ngày 1 tháng 6 nhuận năm Ất Tỵ");
  });
  it.each([
    "",
    "2025-02-29",
    "2026-04-31",
    "2026-13-01",
    "2026-1-3",
    "2026-01-03T00:00:00Z",
    "1799-12-31",
    "2200-01-01",
  ])("rejects %s", (date) => {
    expect(() => solarToLunar(date)).toThrow(RangeError);
  });
  it("accepts a Gregorian leap day and supported endpoints", () => {
    for (const date of ["2024-02-29", "1800-01-01", "2199-12-31"]) {
      const lunar = solarToLunar(date);
      expect(lunar.day).toBeGreaterThanOrEqual(1);
      expect(lunar.day).toBeLessThanOrEqual(30);
      expect(lunar.month).toBeGreaterThanOrEqual(1);
      expect(lunar.month).toBeLessThanOrEqual(12);
    }
  });
});
