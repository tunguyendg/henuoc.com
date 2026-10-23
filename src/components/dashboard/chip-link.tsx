import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** "/path?a=1" from defined params only. Shared by the RSVP, shopping and guests filter chips. */
export function buildHref(base: string, params: Record<string, string | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}

/** Filter chip as a plain link: filtering lives in the URL, no client JS. Tap target 44px. */
export function ChipLink({
  href,
  active,
  variant = "solid",
  children,
}: {
  href: string;
  active: boolean;
  /** Active look: filled rose (default) or soft rose background. */
  variant?: "solid" | "soft";
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors duration-200",
        active
          ? variant === "soft"
            ? "border-rose-600 bg-rose-50 font-semibold text-rose-700"
            : "border-rose-600 bg-rose-600 text-white"
          : "border-border bg-surface text-ink hover:border-rose-500 hover:text-rose-700",
      )}
    >
      {children}
    </Link>
  );
}
