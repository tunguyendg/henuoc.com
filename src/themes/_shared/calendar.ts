import type { EventView } from "../types";

// iCalendar (RFC 5545) + Google Calendar link builders. Pure: no DOM, no Date.now() unless injected.

const DEFAULT_DURATION_HOURS = 3;
const UID_DOMAIN = "henuoc.com";
const MAX_LINE_OCTETS = 75;

export interface CalendarOptions {
  /** Event length when we only know the start. Default 3 hours. */
  durationHours?: number;
  /** SUMMARY / Google "text". Defaults to the event title. */
  summary?: string;
  description?: string;
  /** DTSTAMP. Inject in tests; defaults to the current time. */
  now?: Date;
}

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

function eventTimes(event: EventView, durationHours = DEFAULT_DURATION_HOURS) {
  const start = new Date(event.startsAt);
  if (Number.isNaN(start.getTime())) {
    throw new Error(`Invalid startsAt for event ${event.id}`);
  }
  const end = new Date(start.getTime() + Math.max(0, durationHours) * 60 * 60 * 1000);
  return { start, end };
}

function location(event: EventView): string {
  return [event.venue, event.address].filter(Boolean).join(", ");
}

export function buildIcs(event: EventView, opts: CalendarOptions = {}): string {
  const { start, end } = eventTimes(event, opts.durationHours);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hen Uoc//henuoc.com//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    // Stable per event: re-importing updates the same calendar entry instead of duplicating it.
    `UID:${escapeText(event.id)}@${UID_DOMAIN}`,
    `DTSTAMP:${formatUtc(opts.now ?? new Date())}`,
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:${escapeText(opts.summary ?? event.title)}`,
  ];
  const where = location(event);
  if (where) lines.push(`LOCATION:${escapeText(where)}`);
  if (opts.description) lines.push(`DESCRIPTION:${escapeText(opts.description)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

export function googleCalendarUrl(event: EventView, opts: CalendarOptions = {}): string {
  const { start, end } = eventTimes(event, opts.durationHours);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.summary ?? event.title,
    location: location(event),
    ctz: "Asia/Ho_Chi_Minh",
  });
  if (opts.description) params.set("details", opts.description);
  // `dates` keeps a literal "/" between start and end, as Google documents it.
  return `https://calendar.google.com/calendar/render?${params.toString()}&dates=${formatUtc(start)}/${formatUtc(end)}`;
}

/** Safe download name, e.g. "henuoc-evt-1.ics". */
export function icsFileName(event: EventView): string {
  const id = event.id.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 40) || "su-kien";
  return `henuoc-${id}.ics`;
}
