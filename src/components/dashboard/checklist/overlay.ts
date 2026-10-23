import { z } from "zod";
import { daysBetween } from "@/lib/checklist-schedule";

/** Browser-only overlay on top of the server's sample done-state: record id → done. */
export const overlayKey = (weddingId: string) => `henuoc:dashboard-checklist:v1:${weddingId}`;

const overlaySchema = z.record(z.string(), z.boolean());

/** Parse raw storage text; malformed → {}. Ids not in `knownIds` are dropped. */
export function parseOverlay(
  raw: string | null,
  knownIds: ReadonlySet<string>,
): Record<string, boolean> {
  if (!raw) return {};
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return {};
  }
  const parsed = overlaySchema.safeParse(json);
  if (!parsed.success) return {};
  return Object.fromEntries(Object.entries(parsed.data).filter(([id]) => knownIds.has(id)));
}

export type Filter = "all" | "todo" | "overdue";

/** Days until due (negative = overdue); null without a due date. */
export function daysLeft(dueDate: string | null, today: string): number | null {
  return dueDate === null ? null : daysBetween(today, dueDate);
}

export function matchesFilter(
  filter: Filter,
  done: boolean,
  dueDate: string | null,
  today: string,
): boolean {
  if (filter === "all") return true;
  if (filter === "todo") return !done;
  const left = daysLeft(dueDate, today);
  return !done && left !== null && left < 0;
}

export function duePill(
  done: boolean,
  left: number | null,
): { label: string; tone: "done" | "overdue" | "soon" } | null {
  if (done) return { label: "Xong", tone: "done" };
  if (left === null) return null;
  if (left < 0) return { label: "Quá hạn", tone: "overdue" };
  if (left === 0) return { label: "Hôm nay", tone: "soon" };
  return { label: `Còn ${left} ngày`, tone: "soon" };
}

/** "YYYY-MM-DD" → "dd/mm" */
export function shortDay(day: string): string {
  const [, m, d] = day.split("-");
  return `${d}/${m}`;
}
