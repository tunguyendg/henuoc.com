import { checklistItems, phaseOf, type ChecklistItem } from "@/data/checklist";
import { daysBetween, dueDate, todayInVietnam } from "@/lib/checklist-schedule";

export const WEEK_DAYS = 7;
export const MAX_WEEKLY_TASKS = 5;

export interface WeeklyTask {
  item: ChecklistItem;
  due: string; // "YYYY-MM-DD"
  daysLeft: number; // negative = overdue
}

export interface WeeklyPicks {
  /** due = something is due within 7 days or overdue · next = nearest upcoming phase · none = nothing to show */
  mode: "due" | "next" | "none";
  tasks: WeeklyTask[];
  phaseLabel?: string;
}

const none: WeeklyPicks = { mode: "none", tasks: [] };

/**
 * "Việc tuần này": items due in the next 7 days (soonest first), then overdue ones (most recent
 * first). Ticks are not stored yet, so overdue items may already be done — the UI says so.
 * If nothing is due, fall back to the items of the nearest upcoming phase.
 * Pure: the caller passes `now`.
 */
export function pickWeeklyTasks(
  weddingDateIso: string,
  now: Date,
  items: readonly ChecklistItem[] = checklistItems,
): WeeklyPicks {
  const wedding = new Date(weddingDateIso);
  if (Number.isNaN(wedding.getTime())) return none;
  const weddingDay = todayInVietnam(wedding);
  const today = todayInVietnam(now);

  const untilWedding = daysBetween(today, weddingDay);
  if (untilWedding === null || untilWedding < 0) return none;

  const scheduled: WeeklyTask[] = [];
  for (const item of items) {
    const due = dueDate(weddingDay, item.daysBefore);
    const daysLeft = due === null ? null : daysBetween(today, due);
    if (due !== null && daysLeft !== null) scheduled.push({ item, due, daysLeft });
  }
  scheduled.sort((a, b) => a.due.localeCompare(b.due));

  const thisWeek = scheduled.filter((t) => t.daysLeft >= 0 && t.daysLeft <= WEEK_DAYS);
  const overdue = scheduled.filter((t) => t.daysLeft < 0).reverse();
  const due = [...thisWeek, ...overdue];
  if (due.length > 0) return { mode: "due", tasks: due.slice(0, MAX_WEEKLY_TASKS) };

  const upcoming = scheduled.filter((t) => t.daysLeft > WEEK_DAYS);
  const first = upcoming[0];
  if (!first) return none;
  const phase = phaseOf(first.item);
  return {
    mode: "next",
    phaseLabel: phase.label,
    tasks: upcoming.filter((t) => phaseOf(t.item).id === phase.id).slice(0, MAX_WEEKLY_TASKS),
  };
}

/** Short due label: "Hôm nay", "Còn 3 ngày", "Quá hạn 6 ngày". */
export function dueLabel(daysLeft: number): string {
  if (daysLeft === 0) return "Hôm nay";
  if (daysLeft > 0) return `Còn ${daysLeft} ngày`;
  return `Quá hạn ${-daysLeft} ngày`;
}
