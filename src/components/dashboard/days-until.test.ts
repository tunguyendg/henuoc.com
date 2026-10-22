import { describe, expect, it } from "vitest";
import { countdownLabel, daysUntil } from "./days-until";

describe("daysUntil", () => {
  it("counts calendar days in Vietnam time, not 24h blocks", () => {
    // 2027-10-16 23:30 VN (16:30Z) → wedding 2027-10-17 18:00 VN (11:00Z) = 1 day
    expect(daysUntil("2027-10-17T11:00:00.000Z", new Date("2027-10-16T16:30:00.000Z"))).toBe(1);
  });

  it("uses the VN date even when UTC is still the previous day", () => {
    // 2027-10-17 06:00 VN = 2027-10-16T23:00Z → same VN day as the wedding
    expect(daysUntil("2027-10-17T11:00:00.000Z", new Date("2027-10-16T23:00:00.000Z"))).toBe(0);
  });

  it("is negative after the wedding", () => {
    expect(daysUntil("2027-10-17T11:00:00.000Z", new Date("2027-10-20T03:00:00.000Z"))).toBe(-3);
  });

  it("returns null for an invalid date", () => {
    expect(daysUntil("not-a-date", new Date("2027-10-16T00:00:00.000Z"))).toBeNull();
  });
});

describe("countdownLabel", () => {
  it("formats future, today and past", () => {
    expect(countdownLabel(87)).toBe("Còn 87 ngày");
    expect(countdownLabel(0)).toBe("Hôm nay cưới!");
    expect(countdownLabel(-1)).toBeUndefined();
    expect(countdownLabel(null)).toBeUndefined();
  });
});
