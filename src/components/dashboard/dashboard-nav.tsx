"use client";

import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { dashboardNav, isNavItemActive } from "./nav-items";

// Client leaf: the only reason it is a Client Component is usePathname() (active state) and the
// "Thêm" toggle. It never receives wedding data. Items are imported here, not passed as props,
// because lucide icons are functions and functions cannot cross the Server → Client boundary.

/** Desktop sidebar links (md+). */
export function DashboardSidebarNav() {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-1">
      {dashboardNav.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-(--radius-btn) px-3 text-[15px] font-medium transition-colors duration-200",
                active ? "bg-rose-50 font-semibold text-rose-700" : "text-ink hover:bg-rose-50/60",
              )}
            >
              <Icon aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

const tabClass =
  "flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 text-[11px] leading-tight font-medium transition-colors duration-200";

/** Mobile bottom tab bar (<md): 4 main tabs + "Thêm" menu for the rest. */
export function DashboardTabBar() {
  const pathname = usePathname();
  // The menu is "open at" a pathname: navigating anywhere closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const moreOpen = openAt === pathname;
  const close = () => setOpenAt(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const tabs = dashboardNav.filter((i) => i.mobile === "tab");
  const moreItems = dashboardNav.filter((i) => i.mobile === "more");
  const moreActive = moreItems.some((i) => isNavItemActive(pathname, i.href));

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenAt(null);
      moreButtonRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  return (
    <>
      {moreOpen ? (
        // Tap outside the menu closes it. Decorative, so hidden from assistive tech (Esc / toggle work).
        <div aria-hidden className="fixed inset-0 z-40 bg-ink/20 md:hidden" onClick={close} />
      ) : null}

      <nav
        aria-label="Điều hướng bảng điều khiển"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="grid grid-cols-5">
          {tabs.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(tabClass, active ? "text-rose-700" : "text-muted")}
                >
                  <span
                    className={cn(
                      "flex h-7 w-12 items-center justify-center rounded-full",
                      active && "bg-rose-50",
                    )}
                  >
                    <Icon aria-hidden className="size-5" strokeWidth={active ? 2.25 : 1.75} />
                  </span>
                  <span className={cn(active && "font-semibold")}>{item.shortLabel}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              ref={moreButtonRef}
              type="button"
              aria-expanded={moreOpen}
              aria-controls={menuId}
              onClick={() => setOpenAt(moreOpen ? null : pathname)}
              className={cn(tabClass, moreActive || moreOpen ? "text-rose-700" : "text-muted")}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full",
                  (moreActive || moreOpen) && "bg-rose-50",
                )}
              >
                <Ellipsis aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <span className={cn(moreActive && "font-semibold")}>Thêm</span>
            </button>
          </li>
        </ul>

        {/* After the tabs in DOM/focus order, visually above them (bottom-full). */}
        <ul
          id={menuId}
          hidden={!moreOpen}
          className="absolute inset-x-3 bottom-full mb-2 rounded-(--radius-card) border border-border bg-surface p-2 shadow-(--shadow-card)"
        >
          {moreItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={close}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-(--radius-btn) px-3 text-[15px] font-medium",
                    active ? "bg-rose-50 font-semibold text-rose-700" : "text-ink",
                  )}
                >
                  <Icon aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
