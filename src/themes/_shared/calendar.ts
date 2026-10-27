import { buildEventIcs, formatUtc } from "./ics";
export { escapeText, foldLine, formatUtc } from "./ics";
import type { EventView } from "../types";

// iCalendar (RFC 5545) + Google Calendar link builders. Pure: no DOM, no Date.now() unless injected.

const DEFAULT_DURATION_HOURS = 3;
export interface CalendarOptions {
  /** Event length when we only know the start. Default 3 hours. */
  durationHours?: number;
  /** SUMMARY / Google "text". Defaults to the event title. */
  summary?: string;
  description?: string;
  /** DTSTAMP. Inject in tests; defaults to the current time. */
  now?: Date;
}

function eventTimes(event: EventView, durationHours = DEFAULT_DURATION_HOURS) {
  const start = new Date(event.startsAt);
  if (Number.isNaN(start.getTime())) {
    throw new Error(`Invalid startsAt for event ${event.id}`);
  }
  if (!Number.isFinite(durationHours) || durationHours <= 0) {
    throw new RangeError("Expected a positive finite event duration");
  }
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  return { start, end };
}

function location(event: EventView): string {
  return [event.venue, event.address].filter(Boolean).join(", ");
}

export function buildIcs(event: EventView, opts: CalendarOptions = {}): string {
  const { start, end } = eventTimes(event, opts.durationHours);
  return buildEventIcs(
    {
      title: opts.summary ?? event.title,
      startsAt: start.toISOString(),
      durationMinutes: (end.getTime() - start.getTime()) / 60_000,
      location: location(event),
      uid: `${event.id}@henuoc.com`,
      description: opts.description,
    },
    opts.now,
  );
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
