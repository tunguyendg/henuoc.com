import { assertDashboardPreview } from "@/components/dashboard/preview-guard";
import { connection } from "next/server";
import { repos } from "@/features/repos";
import { CountdownCard } from "./countdown-card";
import { Shortcuts } from "./shortcuts";
import { ShoppingIdeas } from "./shopping-ideas";
import { StatsCards } from "./stats-cards";
import { pickWeeklyTasks } from "./weekly-tasks";
import { WeeklyTasksCard } from "./weekly-tasks-card";

/** Everything below the H1. Reads the clock, so it must be rendered inside <Suspense>. */
export async function OverviewContent() {
  assertDashboardPreview();
  // Per-user, per-request data (session later); also allows reading `new Date()` below.
  await connection();
  const wedding = await repos.wedding.getCurrentWedding();
  const [stats, products] = await Promise.all([
    repos.rsvp.getStats(wedding.id),
    repos.shopping.listSuggestions(wedding.id),
  ]);
  const now = new Date();
  const picks = wedding.weddingDate
    ? pickWeeklyTasks(wedding.weddingDate, now)
    : { mode: "none" as const, tasks: [] };

  return (
    <>
      <CountdownCard weddingDate={wedding.weddingDate} now={now} />
      <section aria-labelledby="rsvp-stats-heading" className="flex flex-col gap-3">
        <h2 id="rsvp-stats-heading" className="text-lg font-bold text-ink">
          Khách mời & RSVP
        </h2>
        <StatsCards stats={stats} />
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyTasksCard picks={picks} hasWeddingDate={Boolean(wedding.weddingDate)} />
        <ShoppingIdeas products={products} />
      </div>
      <Shortcuts />
    </>
  );
}

export function OverviewFallback() {
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <div className="h-32 animate-pulse rounded-(--radius-card) bg-rose-50" />
      <div className="h-48 animate-pulse rounded-(--radius-card) bg-rose-50" />
      <div className="h-64 animate-pulse rounded-(--radius-card) bg-rose-50" />
    </div>
  );
}
