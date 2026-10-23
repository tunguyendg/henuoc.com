import type { RsvpFilter } from "@/features/rsvp/types";
import { ChipLink, buildHref } from "@/components/dashboard/chip-link";
import { rsvpStatusOptions } from "./parse-filter";

const BASE = "/dashboard/rsvp";

export function RsvpFilterChips({
  filter,
  events,
}: {
  filter: RsvpFilter;
  events: readonly { eventId: string; title: string }[];
}) {
  const href = (next: RsvpFilter) => buildHref(BASE, { status: next.status, event: next.eventId });
  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-label="Lọc theo trạng thái" className="flex flex-wrap gap-2">
        <ChipLink href={href({ ...filter, status: undefined })} active={!filter.status}>
          Tất cả
        </ChipLink>
        {rsvpStatusOptions.map((o) => (
          <ChipLink
            key={o.value}
            href={href({ ...filter, status: o.value })}
            active={filter.status === o.value}
          >
            {o.label}
          </ChipLink>
        ))}
      </div>
      {events.length > 1 ? (
        <div role="group" aria-label="Lọc theo sự kiện" className="flex flex-wrap gap-2">
          <ChipLink href={href({ ...filter, eventId: undefined })} active={!filter.eventId}>
            Mọi sự kiện
          </ChipLink>
          {events.map((e) => (
            <ChipLink
              key={e.eventId}
              href={href({ ...filter, eventId: e.eventId })}
              active={filter.eventId === e.eventId}
            >
              {e.title}
            </ChipLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}
