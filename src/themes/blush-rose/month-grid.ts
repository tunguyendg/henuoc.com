// Pure helpers for the heart calendar. Kept free of React so they are trivial to unit test.

const TIME_ZONE = "Asia/Ho_Chi_Minh";

const civilDate = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export interface MonthGrid {
  year: number;
  /** 1–12 */
  month: number;
  /** Day of month of the highlighted date, 1–31. */
  day: number;
  /** Weeks start on Monday; null = padding cell outside the month. Every week has 7 entries. */
  weeks: (number | null)[][];
}

/** Civil date of an ISO instant in Asia/Ho_Chi_Minh (never the server's/browser's local zone). */
export function civilDateInVietnam(
  iso: string,
): { year: number; month: number; day: number } | null {
  const instant = new Date(iso);
  if (Number.isNaN(instant.getTime())) return null;
  const parts = civilDate.formatToParts(instant);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const year = pick("year");
  const month = pick("month");
  const day = pick("day");
  if (![year, month, day].every(Number.isInteger)) return null;
  return { year, month, day };
}

/** Month grid (Monday first) for the civil date of `weddingDate`. Invalid input → null. */
export function getMonthGrid(weddingDate: string): MonthGrid | null {
  const civil = civilDateInVietnam(weddingDate);
  if (!civil) return null;
  const { year, month, day } = civil;

  // Calendar arithmetic on a UTC date: no zone involved, so no DST/offset drift.
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay(); // 0 = Sunday
  const leading = (firstWeekday + 6) % 7; // 0 = Monday

  const cells: (number | null)[] = [
    ...Array.from<null>({ length: leading }).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let start = 0; start < cells.length; start += 7) weeks.push(cells.slice(start, start + 7));
  return { year, month, day, weeks };
}
