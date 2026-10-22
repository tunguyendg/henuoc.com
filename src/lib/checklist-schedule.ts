/**
 * Calendar-date math for the wedding checklist. Dates are plain "YYYY-MM-DD" strings
 * (no time, no time zone) so the same input gives the same output on server and client.
 */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

function toUtcMs(date: string): number | null {
  if (!ISO_DATE.test(date)) return null;
  const ms = Date.parse(`${date}T00:00:00Z`);
  // Date.parse rolls "2026-02-30" over to March → reject anything that does not round-trip
  if (Number.isNaN(ms) || new Date(ms).toISOString().slice(0, 10) !== date) return null;
  return ms;
}

export function isValidDate(date: string): boolean {
  return toUtcMs(date) !== null;
}

/** Due date of an item `daysBefore` days ahead of the wedding; null if `weddingDate` is invalid. */
export function dueDate(weddingDate: string, daysBefore: number): string | null {
  const ms = toUtcMs(weddingDate);
  if (ms === null) return null;
  return new Date(ms - daysBefore * DAY_MS).toISOString().slice(0, 10);
}

/** Whole days from `from` to `to` (negative when `to` is earlier); null if either is invalid. */
export function daysBetween(from: string, to: string): number | null {
  const a = toUtcMs(from);
  const b = toUtcMs(to);
  if (a === null || b === null) return null;
  return Math.round((b - a) / DAY_MS);
}

/** Today's date in Vietnam as "YYYY-MM-DD". */
export function todayInVietnam(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(now);
}
