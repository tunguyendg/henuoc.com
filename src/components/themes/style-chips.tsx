import Link from "next/link";
import { hasVisibleThemes, themeStyles } from "@/data/themes";
import { stylePath } from "@/lib/seo/pages";
import { cn } from "@/lib/utils";

/**
 * Hàng chip phong cách — là LINK thật (không phải nút lọc JS) để Google đi theo được.
 * `only`: chỉ hiện các phong cách này (dùng ở trang chi tiết).
 */
export function StyleChips({ active, only }: { active?: string; only?: string[] }) {
  // Danh sách chung: chỉ chip có mẫu hiển thị. Có `only` (trang chi tiết): giữ đúng các phong
  // cách của mẫu đó, vì mẫu đang xem đã visible.
  const list = only
    ? themeStyles.filter((s) => only.includes(s.slug))
    : themeStyles.filter((s) => hasVisibleThemes(s.slug) || s.slug === active);
  return (
    <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
      {!only && (
        <li className="shrink-0">
          <Chip href="/mau-thiep-cuoi" active={!active}>
            Tất cả
          </Chip>
        </li>
      )}
      {list.map((s) => (
        <li key={s.slug} className="shrink-0">
          <Chip href={stylePath(s.slug)} active={active === s.slug}>
            {s.name}
          </Chip>
        </li>
      ))}
    </ul>
  );
}

function Chip({ href, active, children }: { href: string; active?: boolean; children: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "border-rose-600 bg-rose-600 text-white"
          : "border-border bg-surface text-ink hover:border-rose-500 hover:text-rose-700",
      )}
    >
      {children}
    </Link>
  );
}
