import { first, type RawSearchParams } from "@/lib/search-params";
import type { RsvpFilter, RsvpStatus } from "@/features/rsvp/types";

export const rsvpStatusOptions: readonly { value: RsvpStatus; label: string }[] = [
  { value: "ATTENDING", label: "Sẽ đến" },
  { value: "DECLINED", label: "Không đến" },
];

/** URL input is untrusted: keep only known statuses and event ids of this wedding; ignore the rest. */
export function parseRsvpFilter(sp: RawSearchParams, eventIds: readonly string[]): RsvpFilter {
  const status = first(sp.status);
  const event = first(sp.event);
  return {
    status: rsvpStatusOptions.find((o) => o.value === status)?.value,
    eventId: eventIds.find((id) => id === event),
  };
}
