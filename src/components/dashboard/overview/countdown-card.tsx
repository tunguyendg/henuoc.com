import Link from "next/link";
import { daysUntil } from "@/components/dashboard/days-until";
import { Card } from "@/components/ui/card";
import { formatLongDate } from "./format-date";

/** Pure view: the caller reads the clock (request time) and passes `now`. */
export function CountdownCard({ weddingDate, now }: { weddingDate?: string; now: Date }) {
  const days = weddingDate ? daysUntil(weddingDate, now) : null;
  const dateText = weddingDate ? formatLongDate(weddingDate) : undefined;

  return (
    <Card className="border-rose-100 bg-rose-50 p-5 md:p-6">
      <p className="text-xs font-bold tracking-[0.16em] text-rose-700 uppercase">Ngày cưới</p>
      {days === null ? (
        <>
          <p className="mt-2 text-xl font-bold text-ink">Chưa chọn ngày cưới</p>
          <Link
            href="/dashboard/thiep"
            className="mt-1 inline-flex min-h-11 items-center text-[15px] font-semibold text-rose-700 underline-offset-4 hover:underline"
          >
            Chọn ngày trong Thiệp
          </Link>
        </>
      ) : days > 0 ? (
        <p className="mt-1 flex items-baseline gap-2 text-ink">
          <span className="font-display text-5xl font-extrabold tracking-[-0.03em] tabular-nums">
            {days}
          </span>
          <span className="text-lg font-semibold">ngày nữa</span>
        </p>
      ) : (
        <p className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] text-ink">
          {days === 0 ? "Hôm nay cưới!" : "Đám cưới đã diễn ra"}
        </p>
      )}
      {dateText ? <p className="mt-1 text-[15px] text-muted">{dateText}</p> : null}
    </Card>
  );
}
