"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import {
  daysLeft,
  duePill,
  matchesFilter,
  overlayKey,
  parseOverlay,
  shortDay,
  type Filter,
} from "./overlay";

/** Narrow props: only what the list renders (no notes, no wedding fields). */
export interface ChecklistRow {
  id: string;
  title: string;
  categoryLabel: string;
  phaseId: string;
  dueDate: string | null;
  done: boolean;
}
export interface ChecklistGroup {
  id: string;
  label: string;
}

// --- localStorage as an external store -------------------------------------------------------
// The snapshot is the raw string (stable primitive); server snapshot is null → first client render
// matches the server HTML, then React re-renders with the stored overlay (no hydration mismatch).
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
};
// When setItem throws (Safari private mode, quota) the new value lives here so ticks still show.
const memory = new Map<string, string>();
function read(key: string): string | null {
  const fallback = memory.get(key);
  if (fallback !== undefined) return fallback;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    memory.delete(key);
  } catch {
    memory.set(key, value);
  }
  listeners.forEach((cb) => cb());
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "todo", label: "Chưa xong" },
  { value: "overdue", label: "Quá hạn" },
];

const pillStyle = {
  done: "bg-success-soft text-success",
  overdue: "bg-warning-soft text-warning",
  soon: "bg-rose-50 text-rose-700",
} as const;

export function ChecklistInteractive({
  weddingId,
  today,
  groups,
  rows,
}: {
  weddingId: string;
  today: string; // "YYYY-MM-DD", computed on the server → same overdue result on both sides
  groups: ChecklistGroup[];
  rows: ChecklistRow[];
}) {
  const key = overlayKey(weddingId);
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const saveFailed = useSyncExternalStore(
    subscribe,
    () => memory.has(key),
    () => false,
  );
  const knownIds = useMemo(() => new Set(rows.map((r) => r.id)), [rows]);
  const overlay = useMemo(() => parseOverlay(raw, knownIds), [raw, knownIds]);
  const [filter, setFilter] = useState<Filter>("all");

  const isDone = (r: ChecklistRow) => overlay[r.id] ?? r.done;
  const doneCount = rows.filter(isDone).length;
  const percent = rows.length === 0 ? 0 : Math.round((doneCount / rows.length) * 100);

  function toggle(r: ChecklistRow, next: boolean) {
    // Re-read right before writing: another tab may have changed the overlay since last render.
    const current = parseOverlay(read(key), knownIds);
    write(key, JSON.stringify({ ...current, [r.id]: next }));
  }

  const visible = rows.filter((r) => matchesFilter(filter, isDone(r), r.dueDate, today));

  return (
    <div className="flex flex-col gap-5">
      <section
        aria-label="Tiến độ"
        className="rounded-(--radius-card) border border-border bg-surface p-4"
      >
        <p className="flex items-baseline justify-between gap-3 text-sm text-muted">
          <span>
            <strong className="text-lg font-bold text-ink">{doneCount}</strong>/{rows.length} việc
            đã xong
          </span>
          <span className="font-semibold text-rose-700">{percent}%</span>
        </p>
        <div
          role="progressbar"
          aria-label="Tiến độ checklist"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="mt-2 h-2 overflow-hidden rounded-full bg-rose-50"
        >
          <div className="h-full rounded-full bg-rose-600" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-3 text-xs text-muted" role={saveFailed ? "status" : undefined}>
          {saveFailed
            ? "Không lưu được trên trình duyệt này — dấu tích sẽ mất khi tải lại."
            : "Đang lưu trên trình duyệt này — dữ liệu mẫu."}
        </p>
      </section>

      <div role="group" aria-label="Lọc việc" className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors duration-200",
              filter === f.value
                ? "border-rose-600 bg-rose-600 text-white"
                : "border-border bg-surface text-ink hover:border-rose-500 hover:text-rose-700",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-(--radius-card) border border-border bg-surface p-6 text-center text-muted">
          Không có việc nào khớp bộ lọc.
        </p>
      ) : (
        groups.map((g) => {
          const inGroup = visible.filter((r) => r.phaseId === g.id);
          if (inGroup.length === 0) return null;
          return (
            <section key={g.id} aria-labelledby={`phase-${g.id}`} className="flex flex-col gap-2">
              <h2 id={`phase-${g.id}`} className="text-lg font-bold text-ink">
                {g.label}
              </h2>
              <ul className="flex flex-col divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
                {inGroup.map((r) => {
                  const done = isDone(r);
                  const left = daysLeft(r.dueDate, today);
                  const pill = duePill(done, left);
                  const inputId = `check-${r.id}`;
                  return (
                    <li key={r.id}>
                      <label
                        htmlFor={inputId}
                        className="flex min-h-11 cursor-pointer items-start gap-3 px-3 py-3"
                      >
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={done}
                          onChange={(e) => toggle(r, e.target.checked)}
                          className="mt-0.5 size-6 shrink-0 cursor-pointer accent-rose-600"
                        />
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block text-[15px] leading-snug font-semibold [overflow-wrap:anywhere]",
                              done ? "text-muted line-through" : "text-ink",
                            )}
                          >
                            {r.title}
                          </span>
                          <span className="mt-0.5 block text-sm text-muted">
                            {r.categoryLabel}
                            {r.dueDate ? ` · hạn ${shortDay(r.dueDate)}` : ""}
                          </span>
                          {pill ? (
                            <span
                              className={cn(
                                "mt-1.5 inline-block rounded-full px-2.5 py-1 text-xs font-semibold",
                                pillStyle[pill.tone],
                              )}
                            >
                              {pill.label}
                            </span>
                          ) : null}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
