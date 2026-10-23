import { UserPlus } from "lucide-react";
import { formatDateTime } from "@/components/dashboard/overview/format-date";
import { Badge, StatusBadge } from "@/components/ui/badge";
import type { RsvpView } from "@/features/rsvp/types";

/**
 * Card list (works at 390px, becomes 2 columns on md+). `displayName` and `message` are text the
 * guest typed: rendered as plain JSX text (React escapes it), clamped, with long strings wrapped.
 */
export function ResponseList({
  responses,
  eventTitles,
}: {
  responses: readonly RsvpView[];
  eventTitles: ReadonlyMap<string, string>;
}) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {responses.map((r, i) => {
        const events = r.eventIds.map((id) => eventTitles.get(id)).filter(Boolean);
        const when = formatDateTime(r.respondedAt);
        return (
          <li
            key={`${r.guestId ?? "walk-in"}-${r.respondedAt}-${i}`}
            className="flex flex-col gap-2 rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="line-clamp-2 min-w-0 text-base font-semibold [overflow-wrap:anywhere] text-ink">
                {r.displayName}
              </p>
              <StatusBadge status={r.status === "ATTENDING" ? "attending" : "declined"} />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted">
              {r.source === "WALK_IN" ? (
                <Badge icon={UserPlus} tone="neutral">
                  Khách vãng lai
                </Badge>
              ) : null}
              {r.status === "ATTENDING" ? <span>{r.attendeeCount} người</span> : null}
              {when ? <span>{when}</span> : null}
            </div>
            {events.length > 0 ? (
              <p className="text-sm text-muted">Dự: {events.join(", ")}</p>
            ) : null}
            {r.message ? (
              <p className="line-clamp-3 rounded-xl bg-canvas px-3 py-2 text-[15px] [overflow-wrap:anywhere] whitespace-pre-line text-ink">
                {r.message}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
