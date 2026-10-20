import Link from "next/link";
import { themeStyles } from "@/data/themes";
import { stylePath } from "@/lib/seo/pages";
import { cn } from "@/lib/utils";

/**
 * Hàng chip phong cách — là LINK thật (không phải nút lọc JS) để Google đi theo được.
 * `only`: chỉ hiện các phong cách này (dùng ở trang chi tiết).
 */
export function StyleChips({ active, only }: { active?: string; only?: string[] }) {
  const list = only ? themeStyles.filter((s) => only.includes(s.slug)) : themeStyles;
  return (
    <ul className="flex flex-wrap gap-2">
      {!only && (
        <li>
          <Chip href="/mau-thiep-cuoi" active={!active}>
            Tất cả
          </Chip>
        </li>
      )}
      {list.map((s) => (
        <li key={s.slug}>
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
        "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-rose-600 bg-rose-600 text-white"
          : "border-border bg-surface text-ink hover:border-rose-500 hover:text-rose-700",
      )}
    >
      {children}
    </Link>
  );
}
