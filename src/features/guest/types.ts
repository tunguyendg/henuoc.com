import type { Side } from "../wedding/types";

// Dashboard DTOs for guests (= Invitation rows). By design there is NO token / tokenHash /
// tokenCipher and NO phone here: a DTO is the whitelist of what may leave the server. The invite link
// is fetched on demand through GuestRepo.getInviteLink, one guest at a time.

export type DeliveryStatus = "NOT_SENT" | "MARKED_SENT"; // mirrors Prisma enum; "sent" is only ever user-marked

export interface GuestGroup {
  id: string;
  name: string;
  side: Side;
}

export interface GuestView {
  id: string;
  salutationPrefix: string; // e.g. "Trân trọng kính mời"
  displayName: string; // e.g. "Bác Hai"
  salutationSuffix?: string; // e.g. "& Gia đình"
  side: Side;
  groupId?: string;
  invitedEventIds: string[];
  maxAttendees: number;
  delivery: DeliveryStatus;
  openedAt?: string; // ISO 8601 UTC, first time the guest opened their link
  hasRsvp: boolean;
  revoked: boolean; // link revoked (Invitation.revokedAt set): the old link no longer opens
}

export interface GuestFilter {
  side?: Side;
  groupId?: string;
  q?: string; // case-insensitive match on displayName
}
