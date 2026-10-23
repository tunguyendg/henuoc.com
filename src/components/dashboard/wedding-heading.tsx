import { assertDashboardPreview } from "./preview-guard";
import { connection } from "next/server";
import { cache } from "react";
import { repos } from "@/features/repos";
import { countdownLabel, daysUntil } from "./days-until";

/**
 * Only the two strings the chrome needs, never the whole WeddingSummary.
 * React `cache()` dedupes per request: sidebar (desktop) and header (mobile) both render this,
 * but the repo is hit once.
 */
const getWeddingHeading = cache(async () => {
  assertDashboardPreview();
  // Dashboard data is per-user and per-request (session later); also lets us read the clock below.
  await connection();
  const wedding = await repos.wedding.getCurrentWedding();
  const countdown = wedding.weddingDate
    ? countdownLabel(daysUntil(wedding.weddingDate, new Date()))
    : undefined;
  return { coupleNames: wedding.coupleNames, countdown };
});

/** Couple names + small countdown. Must be rendered inside <Suspense> (reads request time). */
export async function WeddingHeading({ variant }: { variant: "sidebar" | "header" }) {
  const { coupleNames, countdown } = await getWeddingHeading();

  if (variant === "header") {
    return (
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <p className="truncate text-[15px] font-semibold text-ink">{coupleNames}</p>
        {countdown ? (
          <span className="shrink-0 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
            {countdown}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-rose-50 px-4 py-3">
      <p className="text-xs font-medium text-muted">Đám cưới của</p>
      <p className="text-base leading-snug font-bold text-ink">{coupleNames}</p>
      {countdown ? <p className="mt-0.5 text-sm font-semibold text-rose-700">{countdown}</p> : null}
    </div>
  );
}

export function WeddingHeadingFallback({ variant }: { variant: "sidebar" | "header" }) {
  if (variant === "header") {
    return <div aria-hidden className="h-5 w-40 animate-pulse rounded-full bg-rose-50" />;
  }
  return <div aria-hidden className="h-[76px] animate-pulse rounded-2xl bg-rose-50" />;
}
