import type { RsvpStats } from "@/features/rsvp/types";
import { cn } from "@/lib/utils";

function Stat({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: number;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)",
        className,
      )}
    >
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd className="mt-1 font-display text-3xl font-extrabold tracking-[-0.03em] text-ink tabular-nums">
        {value}
      </dd>
      {hint ? <p className="mt-0.5 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}

/** RSVP numbers from `repos.rsvp.getStats` — shown as-is, nothing computed beyond sums of its fields. */
export function StatsCards({ stats }: { stats: RsvpStats }) {
  const o = stats.overall;
  const answered = o.attending + o.declined;
  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Stat label="Tổng lời mời" value={o.invited} className="col-span-2 md:col-span-1" />
      <Stat
        label="Đã trả lời"
        value={answered}
        hint={o.walkIn > 0 ? `gồm ${o.walkIn} khách vãng lai` : undefined}
      />
      <Stat label="Sẽ đến" value={o.attending} />
      <Stat label="Không đến" value={o.declined} />
      <Stat label="Chưa trả lời" value={o.pending} />
      <Stat label="Người dự kiến" value={o.attendeeCount} />
      <Stat label="≈ Số bàn" value={o.estimatedTables} hint={`${stats.tableSize} người/bàn`} />
    </dl>
  );
}
