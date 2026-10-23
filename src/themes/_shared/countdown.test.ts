import { describe, expect, it } from "vitest";
import { diffParts } from "./countdown";

const wedding = new Date("2026-12-12T10:00:00+07:00");

describe("diffParts", () => {
  it("is past exactly at the target instant", () => {
    expect(diffParts(wedding, new Date(wedding))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
    });
  });

  it("is past after the target", () => {
    expect(diffParts(wedding, new Date(wedding.getTime() + 1)).isPast).toBe(true);
    expect(diffParts(wedding, new Date("2027-01-01T00:00:00Z")).days).toBe(0);
  });

  it("counts exactly one day", () => {
    const now = new Date("2026-12-11T10:00:00+07:00");
    expect(diffParts(wedding, now)).toEqual({
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: false,
    });
  });

  it("splits into days, hours, minutes, seconds", () => {
    const now = new Date("2026-12-09T07:28:55+07:00");
    expect(diffParts(wedding, now)).toEqual({
      days: 3,
      hours: 2,
      minutes: 31,
      seconds: 5,
      isPast: false,
    });
  });

  it("floors sub-second remainders and is not past 1ms before", () => {
    const now = new Date(wedding.getTime() - 1);
    expect(diffParts(wedding, now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: false,
    });
  });

  it("ignores the device time zone (absolute instants, VN has no DST)", () => {
    // Same instant written in two offsets → same result.
    const a = diffParts(wedding, new Date("2026-12-12T00:00:00Z"));
    const b = diffParts(wedding, new Date("2026-12-12T07:00:00+07:00"));
    expect(a).toEqual(b);
    expect(a).toMatchObject({ days: 0, hours: 3, isPast: false });
  });

  it("treats an invalid target as past so the UI hides", () => {
    expect(diffParts(new Date("not a date"), wedding).isPast).toBe(true);
  });
});
