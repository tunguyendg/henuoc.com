import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const viDate = new Intl.DateTimeFormat("vi-VN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});

/** "2026-10-20" → <time dateTime="2026-10-20">20 tháng 10, 2026</time> */
export function ArticleDate({ iso, className }: { iso: string; className?: string }) {
  // Fixed string input (not `new Date()`), so this stays static under Cache Components.
  const label = viDate.format(new Date(`${iso}T00:00:00+07:00`));
  return (
    <time dateTime={iso} className={className}>
      {label}
    </time>
  );
}

/** CTA block used inside and after an article body. */
export function ArticleCta({
  title = "Sẵn sàng làm thiệp cho hai bạn?",
  text = "Chọn một mẫu thiệp, điền thông tin lễ cưới và gửi cho từng khách một đường link mang đúng tên người nhận.",
  className,
}: {
  title?: string;
  text?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "mt-10 rounded-(--radius-card) border border-rose-100 bg-rose-50 p-6 md:p-8",
        className,
      )}
    >
      <p className="font-display text-xl font-extrabold tracking-[-0.02em] text-ink">{title}</p>
      <p className="mt-2 text-muted">{text}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link href="/tao-thiep" className={buttonVariants()}>
          Tạo thiệp miễn phí <ArrowRight aria-hidden />
        </Link>
        <Link href="/mau-thiep-cuoi" className={buttonVariants({ variant: "secondary" })}>
          Xem mẫu thiệp
        </Link>
      </div>
    </aside>
  );
}
