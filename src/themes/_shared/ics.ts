// RFC 5545 §§3.1, 3.3.11: https://www.rfc-editor.org/rfc/rfc5545.html
const MAX_LINE_OCTETS = 75;

/** 2026-12-12T03:00:00.000Z → 20261212T030000Z */
export function formatUtc(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/** RFC 5545 §3.3.11 TEXT escaping: backslash, semicolon, comma, newline. */
export function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

const encoder = new TextEncoder();

/**
 * RFC 5545 §3.1: lines longer than 75 octets are split with CRLF + one space. Counts UTF-8 bytes and
 * never cuts inside a code point (Vietnamese letters are 2–3 bytes each).
 */
export function foldLine(line: string): string {
  const parts: string[] = [];
  let current = "";
  let size = 0;
  for (const char of line) {
    const bytes = encoder.encode(char).length;
    // Continuation lines start with a space, which also counts toward the 75 octets.
    const limit = parts.length === 0 ? MAX_LINE_OCTETS : MAX_LINE_OCTETS - 1;
    if (size + bytes > limit) {
      parts.push(current);
      current = "";
      size = 0;
    }
    current += char;
    size += bytes;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

export interface IcsEvent {
  title: string;
  /** ISO 8601 instant explicitly in UTC (Z). */
  startsAt: string;
  durationMinutes: number;
  location: string;
  /** Persist this ID to make repeat imports update the same event. */
  uid?: string;
  description?: string;
}

export function buildEventIcs(event: IcsEvent, now = new Date()): string {
  const start = new Date(event.startsAt);
  const validUtc =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(event.startsAt) &&
    Number.isFinite(start.getTime()) &&
    start.toISOString() ===
      (event.startsAt.includes(".") ? event.startsAt : event.startsAt.replace("Z", ".000Z"));
  const end = new Date(start.getTime() + event.durationMinutes * 60_000);
  if (
    !validUtc ||
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(event.durationMinutes) ||
    event.durationMinutes <= 0 ||
    !Number.isFinite(end.getTime()) ||
    !Number.isFinite(now.getTime())
  ) {
    throw new RangeError("Expected a valid UTC start, positive duration and timestamp");
  }
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hen Uoc//henuoc.com//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeText(event.uid ?? `${crypto.randomUUID()}@henuoc.com`)}`,
    `DTSTAMP:${formatUtc(now)}`,
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
  ];
  if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
  if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
