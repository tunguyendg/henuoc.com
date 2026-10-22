import {
  CalendarCheck,
  ClipboardList,
  House,
  Mail,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface DashboardNavItem {
  href: string;
  /** Full label: sidebar (desktop) and the "Thêm" menu. */
  label: string;
  /** Short label under the icon in the mobile tab bar (fits ~70px at 390px). */
  shortLabel: string;
  icon: LucideIcon;
  /** "tab" = own slot in the mobile tab bar; "more" = inside the "Thêm" menu. */
  mobile: "tab" | "more";
}

// Single source of truth for the dashboard navigation (sidebar + mobile tab bar).
// Mobile keeps the 4 things couples open every week as tabs; "Thiệp" (set up once, edited rarely)
// and "Mua sắm" go into "Thêm" — matches docs/02-DESIGN_SYSTEM.md §7.
export const dashboardNav = [
  { href: "/dashboard", label: "Tổng quan", shortLabel: "Tổng quan", icon: House, mobile: "tab" },
  {
    href: "/dashboard/thiep",
    label: "Thiệp của tôi",
    shortLabel: "Thiệp",
    icon: Mail,
    mobile: "more",
  },
  {
    href: "/dashboard/khach-moi",
    label: "Khách mời",
    shortLabel: "Khách",
    icon: Users,
    mobile: "tab",
  },
  {
    href: "/dashboard/rsvp",
    label: "RSVP",
    shortLabel: "RSVP",
    icon: CalendarCheck,
    mobile: "tab",
  },
  {
    href: "/dashboard/checklist",
    label: "Checklist",
    shortLabel: "Checklist",
    icon: ClipboardList,
    mobile: "tab",
  },
  {
    href: "/dashboard/mua-sam",
    label: "Mua sắm",
    shortLabel: "Mua sắm",
    icon: ShoppingBag,
    mobile: "more",
  },
] as const satisfies readonly DashboardNavItem[];

/** "/dashboard" matches only itself; other items also match their sub-pages (/dashboard/khach-moi/123). */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/dashboard/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
