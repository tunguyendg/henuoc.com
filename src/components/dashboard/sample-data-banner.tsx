import { Info } from "lucide-react";

/** Honest label while the dashboard runs on mock repos (no auth yet). Remove when Prisma + session land. */
export function SampleDataBanner() {
  return (
    <p
      role="note"
      className="flex items-start gap-2 rounded-(--radius-btn) bg-gold-100 px-4 py-2.5 text-sm font-medium text-ink"
    >
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
      Dữ liệu mẫu — chưa đăng nhập. Mọi tên, ngày và con số ở đây chỉ để minh hoạ.
    </p>
  );
}
