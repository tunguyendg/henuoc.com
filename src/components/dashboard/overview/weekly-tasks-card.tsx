import { ArrowRight, Circle } from "lucide-react";
import Link from "next/link";
import { checklistCategoryLabels } from "@/data/checklist";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatIsoDay } from "./format-date";
import { dueLabel, type WeeklyPicks } from "./weekly-tasks";

export function WeeklyTasksCard({
  picks,
  hasWeddingDate,
}: {
  picks: WeeklyPicks;
  hasWeddingDate: boolean;
}) {
  const title = picks.mode === "next" ? "Việc sắp tới" : "Việc tuần này";
  return (
    <Card className="flex flex-col gap-4 p-5 md:p-6">
      <div>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {picks.mode === "next" ? (
          <p className="text-sm text-muted">
            Tuần này chưa có việc đến hạn. Đây là việc của mốc gần nhất: {picks.phaseLabel}.
          </p>
        ) : picks.mode === "due" ? (
          <p className="text-sm text-muted">
            Tính theo ngày cưới. Trạng thái tick chưa được lưu nên có việc quá hạn có thể hai bạn đã
            làm rồi.
          </p>
        ) : null}
      </div>

      {picks.tasks.length > 0 ? (
        <ul className="flex flex-col divide-y divide-border">
          {picks.tasks.map(({ item, due, daysLeft }) => (
            <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0">
              <Circle
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-rose-500"
                strokeWidth={1.75}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] leading-snug font-semibold text-ink">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {checklistCategoryLabels[item.category]} · hạn {formatIsoDay(due)}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                  daysLeft < 0 ? "bg-warning-soft text-warning" : "bg-rose-50 text-rose-700",
                )}
              >
                {dueLabel(daysLeft)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[15px] text-muted">
          {hasWeddingDate
            ? "Chưa có việc nào để gợi ý ở thời điểm này."
            : "Chọn ngày cưới trong Thiệp để thấy việc theo từng mốc."}
        </p>
      )}

      <Link
        href="/dashboard/checklist"
        className="inline-flex min-h-11 items-center gap-1.5 self-start text-[15px] font-semibold text-rose-700 underline-offset-4 hover:underline"
      >
        Xem checklist
        <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
      </Link>
    </Card>
  );
}
