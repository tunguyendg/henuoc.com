import { Card } from "@/components/ui/card";
import type { EventRsvpStats } from "@/features/rsvp/types";

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-[15px] font-semibold text-ink tabular-nums">{value}</dd>
    </div>
  );
}

/** One card per event. Numbers come straight from `repos.rsvp.getStats().byEvent`. */
export function EventStatsCards({
  events,
  tableSize,
}: {
  events: readonly EventRsvpStats[];
  tableSize: number;
}) {
  if (events.length === 0) return null;
  return (
    <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {events.map((e) => (
        <li key={e.eventId}>
          <Card className="flex h-full flex-col gap-3 p-5">
            <h3 className="text-base font-bold text-ink">{e.title}</h3>
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink tabular-nums">
                {e.attendeeCount}
              </span>
              <span className="text-sm font-medium text-muted">
                người dự kiến · ≈ {e.estimatedTables} bàn ({tableSize} người/bàn)
              </span>
            </p>
            <dl className="mt-auto grid gap-1.5 border-t border-border pt-3">
              <Row label="Đã mời" value={e.invited} />
              <Row label="Sẽ đến (số phản hồi)" value={e.attending} />
              <Row label="Không đến" value={e.declined} />
              <Row label="Chưa trả lời" value={e.pending} />
              <Row label="Khách vãng lai" value={e.walkIn} />
            </dl>
          </Card>
        </li>
      ))}
    </ul>
  );
}
