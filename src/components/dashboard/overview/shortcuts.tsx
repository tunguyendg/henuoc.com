import { CalendarCheck, Mail, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";

const shortcuts: readonly { href: string; label: string; hint: string; icon: LucideIcon }[] = [
  {
    href: "/dashboard/khach-moi",
    label: "Khách mời",
    hint: "Thêm khách, sao chép link mời",
    icon: Users,
  },
  { href: "/dashboard/rsvp", label: "RSVP", hint: "Xem ai đã trả lời", icon: CalendarCheck },
  { href: "/dashboard/thiep", label: "Thiệp của tôi", hint: "Sửa thông tin thiệp", icon: Mail },
];

export function Shortcuts() {
  return (
    <section aria-labelledby="shortcuts-heading" className="flex flex-col gap-3">
      <h2 id="shortcuts-heading" className="text-lg font-bold text-ink">
        Lối tắt
      </h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {shortcuts.map(({ href, label, hint, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex min-h-14 items-center gap-3 rounded-(--radius-card) border border-border bg-surface p-3 shadow-(--shadow-card) transition-colors duration-200 hover:border-rose-500"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                <Icon aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-ink">{label}</span>
                <span className="block text-sm text-muted">{hint}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
