import { daysBetween, todayInVietnam } from "@/lib/checklist-schedule";

// Calendar-day countdown in Vietnam time. Pure (takes `now`) so it is testable and the caller
// decides where reading the clock is allowed (Cache Components: only at request time).
// Date math lives in lib/checklist-schedule; this file only adapts an ISO timestamp to it.

/** Whole days from `now` to `isoDateTime`, both seen as calendar days in Asia/Ho_Chi_Minh. */
export function daysUntil(isoDateTime: string, now: Date): number | null {
  const target = new Date(isoDateTime);
  if (Number.isNaN(target.getTime())) return null;
  return daysBetween(todayInVietnam(now), todayInVietnam(target));
}

/** Short UI text; undefined when there is nothing worth showing (past or unknown date). */
export function countdownLabel(days: number | null): string | undefined {
  if (days === null || days < 0) return undefined;
  if (days === 0) return "Hôm nay cưới!";
  return `Còn ${days} ngày`;
}
