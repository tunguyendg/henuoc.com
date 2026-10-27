import { describe, expect, it } from "vitest";
import { buildEventIcs, type IcsEvent } from "./ics";

const now = new Date("2026-01-01T00:00:00Z");
const event: IcsEvent = {
  uid: "wedding-1@henuoc.com",
  title: "Lễ cưới",
  startsAt: "2026-02-17T23:00:00Z",
  durationMinutes: 90,
  location: "Sảnh A, Hà Nội",
};

describe("standalone ICS", () => {
  it("creates one event, a stable UID and UTC times crossing midnight", () => {
    const ics = buildEventIcs(event, now);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(ics).toContain("DTSTART:20260217T230000Z\r\n");
    expect(ics).toContain("DTEND:20260218T003000Z\r\n");
    expect(ics).toContain("DTSTAMP:20260101T000000Z\r\n");
    expect(ics).toContain("UID:wedding-1@henuoc.com\r\n");
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
  });
  it("escapes text, prevents property injection and preserves UTF-8 after unfolding", () => {
    const title = "Tiệc cưới 🌸; \\ " + "Nguyễn Thị Thùy Dương, ".repeat(20) + "\r\nEND:VEVENT";
    const ics = buildEventIcs({ ...event, title, location: "A;B,C\\D\rE" }, now);
    for (const line of ics.split("\r\n"))
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    const decoded = new TextDecoder("utf-8", { fatal: true })
      .decode(new TextEncoder().encode(ics))
      .replace(/\r\n /g, "");
    expect(decoded).toContain("SUMMARY:Tiệc cưới 🌸\\; \\\\ ");
    expect(decoded).toContain("\\nEND:VEVENT\r\n");
    expect(decoded).toContain("LOCATION:A\\;B\\,C\\\\D\\nE\r\n");
    expect(decoded.match(/^END:VEVENT$/gm)).toHaveLength(1);
    expect(decoded).not.toContain("�");
  });
  it("supports milliseconds and rejects invalid timestamps and overflowing duration", () => {
    expect(buildEventIcs({ ...event, startsAt: "2026-02-17T23:00:00.123Z" }, now)).toContain(
      "DTSTART:20260217T230000Z",
    );
    expect(() => buildEventIcs(event, new Date(NaN))).toThrow(RangeError);
    expect(() => buildEventIcs({ ...event, durationMinutes: Number.MAX_VALUE }, now)).toThrow(
      RangeError,
    );
  });
  it("generates a UID when none is supplied", () => {
    expect(buildEventIcs({ ...event, uid: undefined }, now)).toMatch(/UID:[0-9a-f-]+@henuoc.com/);
  });
  it.each([0, -1, NaN, Infinity])("rejects invalid duration %s", (durationMinutes) => {
    expect(() => buildEventIcs({ ...event, durationMinutes }, now)).toThrow(RangeError);
  });
  it.each([
    "invalid",
    "2026-02-17T23:00:00",
    "2026-02-17T23:00:00+07:00",
    "2026-02-30T23:00:00Z",
    "2026-02-17",
  ])("rejects non-UTC or invalid start %s", (startsAt) => {
    expect(() => buildEventIcs({ ...event, startsAt }, now)).toThrow(RangeError);
  });
});
