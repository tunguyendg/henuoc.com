import { assertDashboardPreview } from "@/components/dashboard/preview-guard";
import { connection } from "next/server";
import { repos } from "@/features/repos";
import { EventStatsCards } from "./event-stats-cards";
import { RsvpFilterChips } from "./filter-chips";
import { parseRsvpFilter } from "./parse-filter";
import { ResponseList } from "./response-list";

type SearchParams = Record<string, string | string[] | undefined>;

/** Reads searchParams (runtime API) → must sit inside <Suspense>. */
export async function RsvpContent({ searchParams }: { searchParams: Promise<SearchParams> }) {
  assertDashboardPreview();
  await connection();
  const sp = await searchParams;
  const wedding = await repos.wedding.getCurrentWedding();
  const stats = await repos.rsvp.getStats(wedding.id);
  const filter = parseRsvpFilter(
    sp,
    stats.byEvent.map((e) => e.eventId),
  );
  const responses = await repos.rsvp.listResponses(wedding.id, filter);
  const eventTitles = new Map(stats.byEvent.map((e) => [e.eventId, e.title]));
  const filtered = Boolean(filter.status || filter.eventId);

  return (
    <>
      <section aria-labelledby="rsvp-events-heading" className="flex flex-col gap-3">
        <h2 id="rsvp-events-heading" className="text-lg font-bold text-ink">
          Theo từng sự kiện
        </h2>
        <EventStatsCards events={stats.byEvent} tableSize={stats.tableSize} />
      </section>

      <section aria-labelledby="rsvp-list-heading" className="flex flex-col gap-3">
        <h2 id="rsvp-list-heading" className="text-lg font-bold text-ink">
          Phản hồi
        </h2>
        <RsvpFilterChips filter={filter} events={stats.byEvent} />
        <p className="text-sm text-muted" aria-live="polite">
          {responses.length} phản hồi{filtered ? " khớp bộ lọc" : ""}. Khách chưa trả lời không có
          trong danh sách này.
        </p>
        {responses.length === 0 ? (
          <p className="rounded-(--radius-card) border border-border bg-surface p-6 text-center text-muted">
            {filtered ? "Không có phản hồi nào khớp bộ lọc." : "Chưa có ai phản hồi."}
          </p>
        ) : (
          <ResponseList responses={responses} eventTitles={eventTitles} />
        )}
      </section>
    </>
  );
}

export function RsvpFallback() {
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <div className="h-48 animate-pulse rounded-(--radius-card) bg-rose-50" />
      <div className="h-64 animate-pulse rounded-(--radius-card) bg-rose-50" />
    </div>
  );
}
