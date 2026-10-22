import "server-only";
import { NotFoundError } from "@/lib/errors";
import { mockInvitationRows, type MockRsvpRow } from "../guest/mock-repo";
import { deepFreeze } from "../mock-freeze";
import { MOCK_WEDDING_ID, findMockWedding, mockEventRows } from "../wedding/mock-repo";
import type { Side } from "../wedding/types";
import type { RsvpRepo } from "./repo";
import type { EventRsvpStats, RsvpStats, RsvpView } from "./types";

// Invitation RSVPs are embedded in the invitation rows of guest/mock-repo.ts, so guest "hasRsvp"
// and these stats can never disagree. Walk-in RSVPs (Rsvp.invitationId = null) live here.

interface MockWalkInRow extends MockRsvpRow {
  id: string;
  weddingId: string;
  walkInName: string;
  // Real rows also have walkInPhone; omitted on purpose: no phone numbers in sample data.
}

const mockWalkInRows: readonly MockWalkInRow[] = deepFreeze([
  {
    id: "demo-walkin-01",
    weddingId: MOCK_WEDDING_ID,
    walkInName: "Chị Lan (bạn cũ của Minh Anh)",
    status: "ATTENDING",
    attendeeCount: 2,
    eventIds: ["demo-evt-tiec"],
    message: "Mình biết tin qua bạn chung, xin phép đến chung vui nhé!",
    respondedAt: "2027-09-15T13:00:00.000Z",
  },
  {
    id: "demo-walkin-02",
    weddingId: MOCK_WEDDING_ID,
    walkInName: "Anh Dũng",
    status: "DECLINED",
    attendeeCount: 0,
    eventIds: [],
    respondedAt: "2027-09-16T02:00:00.000Z",
  },
]);

/** Answered rows of one wedding, as one shape. Revoked invitations are skipped. */
interface Answer {
  source: "INVITATION" | "WALK_IN";
  guestId?: string;
  displayName: string;
  side?: Side;
  groupId?: string;
  rsvp: MockRsvpRow;
}

function answersOf(weddingId: string): Answer[] {
  const weddingEventIds = new Set(
    mockEventRows.filter((e) => e.weddingId === weddingId).map((e) => e.id),
  );
  const fromInvitations = mockInvitationRows.flatMap((r): Answer[] =>
    r.weddingId === weddingId && r.rsvp && r.revokedAt === undefined
      ? [
          {
            source: "INVITATION",
            guestId: r.id,
            displayName: r.displayName,
            side: r.side,
            groupId: r.groupId,
            // Only events the guest was actually invited to count.
            rsvp: {
              ...r.rsvp,
              eventIds: r.rsvp.eventIds.filter((id) => r.invitedEventIds.includes(id)),
            },
          },
        ]
      : [],
  );
  const fromWalkIns = mockWalkInRows
    .filter((w) => w.weddingId === weddingId)
    .map(({ walkInName, status, attendeeCount, eventIds, message, respondedAt }): Answer => ({
      source: "WALK_IN",
      displayName: walkInName,
      rsvp: {
        status,
        attendeeCount,
        // A walk-in can only pick events that belong to this wedding.
        eventIds: eventIds.filter((id) => weddingEventIds.has(id)),
        message,
        respondedAt,
      },
    }));
  return [...fromInvitations, ...fromWalkIns];
}

const tables = (attendeeCount: number, tableSize: number) => Math.ceil(attendeeCount / tableSize);
const sumPeople = (answers: Answer[]) => answers.reduce((n, a) => n + a.rsvp.attendeeCount, 0);

export const mockRsvpRepo: RsvpRepo = {
  async getStats(weddingId) {
    const wedding = findMockWedding(weddingId);
    if (!wedding) throw new NotFoundError("Wedding");
    const { tableSize } = wedding;
    const invitations = mockInvitationRows.filter(
      (r) => r.weddingId === weddingId && r.revokedAt === undefined,
    );
    const answers = answersOf(weddingId);

    const byEvent = mockEventRows
      .filter((e) => e.weddingId === weddingId)
      .toSorted((a, b) => a.startsAt.localeCompare(b.startsAt))
      .map((event): EventRsvpStats => {
        const invited = invitations.filter((r) => r.invitedEventIds.includes(event.id));
        const pending = invited.filter((r) => r.rsvp === undefined).length;
        const coming = answers.filter(
          (a) => a.rsvp.status === "ATTENDING" && a.rsvp.eventIds.includes(event.id),
        );
        const walkIn = coming.filter((a) => a.source === "WALK_IN").length;
        const attendeeCount = sumPeople(coming);
        return {
          eventId: event.id,
          title: event.title,
          invited: invited.length,
          attending: coming.length,
          declined: invited.length - (coming.length - walkIn) - pending,
          pending,
          walkIn,
          attendeeCount,
          estimatedTables: tables(attendeeCount, tableSize),
        };
      });

    const coming = answers.filter((a) => a.rsvp.status === "ATTENDING");
    const attendeeCount = sumPeople(coming);
    const stats: RsvpStats = {
      tableSize,
      byEvent,
      overall: {
        invited: invitations.length,
        attending: coming.length,
        declined: answers.length - coming.length,
        pending: invitations.filter((r) => r.rsvp === undefined).length,
        walkIn: answers.filter((a) => a.source === "WALK_IN").length,
        attendeeCount,
        estimatedTables: tables(attendeeCount, tableSize),
      },
    };
    return structuredClone(stats);
  },

  async listResponses(weddingId, filter = {}) {
    const views = answersOf(weddingId)
      .filter(
        (a) =>
          (filter.side === undefined || a.side === filter.side) &&
          (filter.groupId === undefined || a.groupId === filter.groupId) &&
          (filter.status === undefined || a.rsvp.status === filter.status) &&
          (filter.eventId === undefined || a.rsvp.eventIds.includes(filter.eventId)),
      )
      // Explicit pick: walkInPhone / side / groupId / internal ids never reach the DTO.
      .map((a): RsvpView => ({
        source: a.source,
        guestId: a.guestId,
        displayName: a.displayName,
        status: a.rsvp.status,
        attendeeCount: a.rsvp.attendeeCount,
        eventIds: [...a.rsvp.eventIds],
        message: a.rsvp.message,
        respondedAt: a.rsvp.respondedAt,
      }))
      .toSorted((a, b) => b.respondedAt.localeCompare(a.respondedAt));
    return structuredClone(views);
  },
};
