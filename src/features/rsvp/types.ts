import type { Side } from "../wedding/types";

export type RsvpStatus = "ATTENDING" | "DECLINED"; // mirrors Prisma enum
export type RsvpSource = "INVITATION" | "WALK_IN"; // mirrors Prisma enum

/**
 * Head count for one event.
 * - invited/pending/declined count invitations (households) invited to the event; revoked
 *   invitations are left out.
 * - attending/attendeeCount ALSO include walk-in answers (from /thiepcuoi/[slug]) that picked this
 *   event; `walkIn` says how many of them. Walk-ins that declined have no event, so they only
 *   show up in `overall`.
 * Invariant: attending - walkIn + declined + pending === invited.
 */
export interface EventRsvpStats {
  eventId: string;
  title: string;
  invited: number;
  attending: number; // said yes AND picked this event (invitations + walk-ins)
  declined: number; // invitation said no, or said yes but not to this event
  pending: number; // invitation with no answer yet
  walkIn: number; // walk-in answers included in `attending`
  attendeeCount: number; // people coming to this event (invitations + walk-ins)
  estimatedTables: number; // ceil(attendeeCount / wedding.tableSize), tableSize defaults to 10
}

export interface RsvpStats {
  tableSize: number;
  byEvent: EventRsvpStats[];
  /**
   * Regardless of event: answers from invitations AND walk-ins; attendeeCount = people coming to
   * at least one event. Invariant: attending + declined + pending === invited + walkIn.
   */
  overall: Omit<EventRsvpStats, "eventId" | "title">;
}

export interface RsvpView {
  source: RsvpSource;
  guestId?: string; // undefined for walk-in answers (no invitation)
  displayName: string; // invitation displayName, or walkInName for walk-ins
  status: RsvpStatus;
  attendeeCount: number;
  eventIds: string[];
  message?: string; // free text from the guest: render as plain text only
  respondedAt: string; // ISO 8601 UTC
  // Deliberately no walkInPhone: the dashboard list never needs it.
}

export interface RsvpFilter {
  status?: RsvpStatus;
  eventId?: string;
  side?: Side; // walk-ins have no side → excluded when set
  groupId?: string; // walk-ins have no group → excluded when set
}
