import { describe, expect, it } from "vitest";
import type { EventView } from "../types";
import {
  buildIcs,
  escapeText,
  foldLine,
  formatUtc,
  googleCalendarUrl,
  icsFileName,
} from "./calendar";

const event: EventView = {
  id: "evt-thanh-hon",
  kind: "thanh-hon",
  title: "Lễ Thành Hôn",
  startsAt: "2026-12-12T10:00:00+07:00",
  dateLabel: "Thứ Bảy, 12/12/2026",
  timeLabel: "10:00",
  venue: "Nhà hàng Hoa Sen",
  address: "12 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
};

const now = new Date("2026-10-23T01:02:03.456Z");

describe("formatUtc", () => {
  it("formats as UTC basic format", () => {
    expect(formatUtc(new Date("2026-12-12T10:00:00+07:00"))).toBe("20261212T030000Z");
  });
});

describe("escapeText", () => {
  it("escapes backslash, semicolon, comma and newlines", () => {
    expect(escapeText("a\\b;c,d\ne\r\nf")).toBe("a\\\\b\\;c\\,d\\ne\\nf");
  });
});

describe("foldLine", () => {
  it("leaves short lines alone", () => {
    expect(foldLine("SUMMARY:Lễ cưới")).toBe("SUMMARY:Lễ cưới");
  });

  it("folds at 75 octets without splitting UTF-8 characters", () => {
    const line = "DESCRIPTION:" + "Trân trọng kính mời ".repeat(10);
    const folded = foldLine(line);
    const encoder = new TextEncoder();
    for (const part of folded.split("\r\n")) {
      expect(encoder.encode(part).length).toBeLessThanOrEqual(75);
    }
    expect(
      folded
        .split("\r\n")
        .slice(1)
        .every((p) => p.startsWith(" ")),
    ).toBe(true);
    // Unfolding restores the original.
    expect(folded.replace(/\r\n /g, "")).toBe(line);
  });
});

describe("buildIcs escaping", () => {
  it("escapes ; and , in LOCATION per RFC 5545 (backslash before each)", () => {
    const ics = buildIcs(
      { ...event, venue: "Sảnh A; Tầng 2", address: "12 Lê Lợi, Q1" },
      { now },
    ).replace(/\r\n /g, "");
    expect(ics).toContain("LOCATION:Sảnh A\\; Tầng 2\\, 12 Lê Lợi\\, Q1\r\n");
  });
});

describe("buildIcs", () => {
  const ics = buildIcs(event, { now });

  it("uses CRLF everywhere and ends with CRLF", () => {
    expect(ics.endsWith("\r\n")).toBe(true);
    expect(ics.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
  });

  it("has a stable UID, DTSTAMP, UTC start and a default 3h end", () => {
    const lines = ics.split("\r\n");
    expect(lines).toContain("UID:evt-thanh-hon@henuoc.com");
    expect(lines).toContain("DTSTAMP:20261023T010203Z");
    expect(lines).toContain("DTSTART:20261212T030000Z");
    expect(lines).toContain("DTEND:20261212T060000Z");
    expect(buildIcs(event, { now })).toBe(ics);
  });

  it("escapes LOCATION and honours durationHours / summary / description", () => {
    const custom = buildIcs(event, {
      now,
      durationHours: 5,
      summary: "Đám cưới Minh Anh & Hoàng Nam",
      description: "Dòng 1\nDòng 2",
    });
    expect(custom).toContain("DTEND:20261212T080000Z");
    expect(custom).toContain("SUMMARY:Đám cưới Minh Anh & Hoàng Nam");
    expect(custom).toContain("DESCRIPTION:Dòng 1\\nDòng 2");
    expect(custom.replace(/\r\n /g, "")).toContain(
      "LOCATION:Nhà hàng Hoa Sen\\, 12 Lê Lợi\\, Quận 1\\, TP. Hồ Chí Minh",
    );
  });

  it("wraps the event in VCALENDAR/VEVENT", () => {
    const lines = ics.split("\r\n");
    expect(lines[0]).toBe("BEGIN:VCALENDAR");
    expect(lines).toContain("VERSION:2.0");
    expect(lines).toContain("BEGIN:VEVENT");
    expect(lines.at(-2)).toBe("END:VCALENDAR");
  });

  it("throws on an invalid start date", () => {
    expect(() => buildIcs({ ...event, startsAt: "nope" })).toThrow();
  });
});

describe("googleCalendarUrl", () => {
  it("builds a TEMPLATE link with UTC dates and encoded text", () => {
    const url = new URL(googleCalendarUrl(event));
    expect(url.origin).toBe("https://calendar.google.com");
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("text")).toBe("Lễ Thành Hôn");
    expect(url.searchParams.get("dates")).toBe("20261212T030000Z/20261212T060000Z");
    expect(url.searchParams.get("location")).toBe(
      "Nhà hàng Hoa Sen, 12 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    );
  });
});

describe("icsFileName", () => {
  it("keeps only safe characters", () => {
    expect(icsFileName(event)).toBe("henuoc-evt-thanh-hon.ics");
    expect(icsFileName({ ...event, id: "../../x y" })).toBe("henuoc-xy.ics");
    expect(icsFileName({ ...event, id: "///" })).toBe("henuoc-su-kien.ics");
  });
});
