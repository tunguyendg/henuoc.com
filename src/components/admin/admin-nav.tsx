"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, Palette, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/nguoi-dung", label: "Người dùng", icon: Users },
  { href: "/admin/dam-cuoi", label: "Đám cưới", icon: Heart },
  { href: "/admin/mau-thiep", label: "Mẫu thiệp", icon: Palette },
] as const;

/** Client leaf only for the active-link highlight (usePathname). Mobile: scrollable tabs. */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Quản trị">
      <ul className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-(--radius-btn) px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  active ? "bg-rose-50 text-rose-700" : "text-ink hover:bg-rose-50",
                )}
              >
                <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
