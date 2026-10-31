import type {
  EventView,
  FamilySide,
  GuestContext,
  InvitationKind,
  Person,
  TimelineItem,
  WeddingContent,
} from "../types";

// Invitation by side (docs/07-THEMES.md §2.1). Every theme takes order, wording and events from here:
// never hard-code "groom first" or a ceremony name in a theme.

export const sideLabel: Record<FamilySide, string> = {
  "nha-trai": "Nhà trai",
  "nha-gai": "Nhà gái",
};

export const otherSide = (side: FamilySide): FamilySide =>
  side === "nha-gai" ? "nha-trai" : "nha-gai";

export const sideWording: Record<FamilySide, { ceremonyTitle: string }> = {
  "nha-gai": { ceremonyTitle: "Lễ Vu Quy" },
  "nha-trai": { ceremonyTitle: "Lễ Tân Hôn" },
};

export interface Party {
  role: "bride" | "groom";
  side: FamilySide;
  label: "Cô dâu" | "Chú rể";
  person: Person;
  parents?: string;
  addr?: string;
}

/** Bride and groom with their families, host side first (left column, first name). */
export function partiesInSideOrder(content: WeddingContent, kind: InvitationKind): [Party, Party] {
  const { couple, families } = content;
  const bride: Party = {
    role: "bride",
    side: "nha-gai",
    label: "Cô dâu",
    person: couple.bride,
    parents: families.brideParents ?? couple.bride.parents,
    addr: families.brideAddr,
  };
  const groom: Party = {
    role: "groom",
    side: "nha-trai",
    label: "Chú rể",
    person: couple.groom,
    parents: families.groomParents ?? couple.groom.parents,
    addr: families.groomAddr,
  };
  return kind === "nha-gai" ? [bride, groom] : [groom, bride];
}

/** Events of this side plus the shared ("chung") ones; "bao-hy" shows ONLY the shared ones. Original order. */
export function eventsForSide(events: readonly EventView[], side: InvitationKind): EventView[] {
  if (side === "bao-hy") return events.filter((event) => event.side === "chung");
  return events.filter((event) => event.side === side || event.side === "chung");
}

/** What this guest may see: the side's events, narrowed to the guest's invitation when there is one. */
export function visibleEvents(
  events: readonly EventView[],
  side: InvitationKind,
  guest?: Pick<GuestContext, "invitedEventIds">,
): EventView[] {
  const own = eventsForSide(events, side);
  return guest ? own.filter((event) => guest.invitedEventIds.includes(event.id)) : own;
}

const MAIN_RITE_KINDS: readonly EventView["kind"][] = ["vu-quy", "thanh-hon", "tan-hon"];

/** The side's own main rite is always named by the side (Vu Quy / Tân Hôn); bao-hy and other events keep their title. */
export function eventTitle(event: EventView, side: InvitationKind): string {
  return side !== "bao-hy" && event.side === side && MAIN_RITE_KINDS.includes(event.kind)
    ? sideWording[side].ceremonyTitle
    : event.title;
}

/** Timeline steps tied to a shown event, plus untied (shared) steps. */
export function timelineForEvents(
  items: readonly TimelineItem[],
  events: readonly EventView[],
): TimelineItem[] {
  const ids = new Set(events.map((event) => event.id));
  return items.filter((item) => item.eventId === undefined || ids.has(item.eventId));
}
