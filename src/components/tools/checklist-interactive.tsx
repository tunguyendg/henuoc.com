"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { AlertCircle, Check, Clock, Printer, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checklistItems } from "@/data/checklist";
import { daysBetween, dueDate } from "@/lib/checklist-schedule";
import {
  formatVnDate,
  getChecklistServerSnapshot,
  getChecklistSnapshot,
  resetChecklist,
  setWeddingDate,
  subscribeChecklist,
  todayStore,
  toggleDone,
} from "./checklist-store";

function useChecklist() {
  return useSyncExternalStore(subscribeChecklist, getChecklistSnapshot, getChecklistServerSnapshot);
}

/** null on the server and during hydration → no "new Date()" in the prerendered HTML. */
function useToday() {
  return useSyncExternalStore(
    todayStore.subscribe,
    todayStore.getSnapshot,
    todayStore.getServerSnapshot,
  );
}

const total = checklistItems.length;

/** Wedding date picker, progress and print/reset buttons. */
export function ChecklistControls() {
  const { weddingDate, done } = useChecklist();
  const today = useToday();
  const daysLeft = weddingDate && today ? daysBetween(today, weddingDate) : null;
  const percent = Math.round((done.length / total) * 100);

  return (
    <div className="rounded-(--radius-card) border border-border bg-surface p-5 shadow-(--shadow-card) md:p-6 print:border-0 print:p-0 print:shadow-none">
      <div className="grid gap-5 sm:grid-cols-2 sm:items-end">
        <Input
          type="date"
          label="Ngày cưới của hai bạn"
          hint="Chọn ngày để xem hạn của từng việc."
          value={weddingDate ?? ""}
          onChange={(e) => setWeddingDate(e.target.value)}
        />
        <div>
          <p aria-live="polite" className="text-sm font-medium text-ink">
            Đã xong{" "}
            <span className="font-bold text-rose-700">
              {done.length}/{total}
            </span>{" "}
            việc
            {daysLeft !== null && daysLeft > 0 ? ` · còn ${daysLeft} ngày đến ngày cưới` : null}
            {daysLeft === 0 ? " · hôm nay là ngày cưới!" : null}
          </p>
          <div aria-hidden className="mt-2 h-2.5 overflow-hidden rounded-full bg-rose-50">
            <div
              className="h-full rounded-full bg-rose-600 transition-[width] duration-200"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 print:hidden">
        <Button onClick={() => window.print()}>
          <Printer aria-hidden /> In checklist
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            if (window.confirm("Xoá ngày cưới và các việc đã tick trên máy này?")) resetChecklist();
          }}
        >
          <RotateCcw aria-hidden /> Làm lại từ đầu
        </Button>
      </div>
    </div>
  );
}

/**
 * One checklist row. `children` (title + note) is rendered by the Server Component page and
 * passed through, so the text is in the HTML even before JavaScript runs.
 */
export function ChecklistRow({
  id,
  daysBefore,
  children,
}: {
  id: string;
  daysBefore: number;
  children: ReactNode;
}) {
  const { weddingDate, done: doneIds } = useChecklist();
  const today = useToday();
  const done = doneIds.includes(id);
  const due = weddingDate ? dueDate(weddingDate, daysBefore) : null;
  const daysLeft = due && today ? daysBetween(today, due) : null;
  const inputId = `viec-${id}`;

  return (
    <li
      data-done={done}
      className="group flex break-inside-avoid gap-3 rounded-(--radius-btn) border border-border bg-surface p-4 data-[done=true]:bg-canvas print:rounded-none print:border-x-0 print:border-t-0 print:p-2"
    >
      <input
        id={inputId}
        type="checkbox"
        checked={done}
        onChange={(e) => toggleDone(id, e.target.checked)}
        className="mt-1 size-5 shrink-0 accent-rose-600"
      />
      <div className="min-w-0 flex-1">
        <label htmlFor={inputId} className="block cursor-pointer">
          {children}
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
          {due ? (
            <span>
              Hạn: <time dateTime={due}>{formatVnDate(due)}</time>
            </span>
          ) : (
            <span>{daysBefore === 0 ? "Ngày cưới" : `Trước ngày cưới ${daysBefore} ngày`}</span>
          )}
          <RowStatus done={done} daysLeft={daysLeft} />
        </div>
      </div>
    </li>
  );
}

function RowStatus({ done, daysLeft }: { done: boolean; daysLeft: number | null }) {
  if (done) {
    return (
      <Badge tone="success" icon={Check}>
        Đã xong
      </Badge>
    );
  }
  if (daysLeft === null) return null;
  if (daysLeft < 0) {
    return (
      <Badge tone="danger" icon={AlertCircle}>
        Quá hạn
      </Badge>
    );
  }
  if (daysLeft <= 6) {
    return (
      <Badge tone="warning" icon={Clock}>
        Trong 7 ngày tới
      </Badge>
    );
  }
  return null;
}
