import type { GuestContext, InvitationKind } from "../types";

// Invitation wording by kind (docs/07-THEMES.md §2.1). Every theme prints these lines: never hard-code the copy.

type GuestName = Pick<GuestContext, "honorific" | "name" | "companion">;

const join = (...parts: (string | undefined)[]) =>
  parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");

/** The announcement above the couple's names, in the voice of whoever invites. */
export function announceLine(kind: InvitationKind): string {
  switch (kind) {
    case "nha-gai":
      return "Trân trọng báo tin Lễ Vu Quy của hai con chúng tôi";
    case "nha-trai":
      return "Trân trọng báo tin Lễ Tân Hôn của hai con chúng tôi";
    case "bao-hy":
      return "Trân trọng báo tin Lễ Thành Hôn của chúng tôi";
  }
}

/** Two cover lines for a guest: who is invited, then to what. */
export function inviteLine(
  guest: GuestName,
  kind: InvitationKind,
): { invite: string; attend: string } {
  return {
    invite: join("Trân trọng kính mời:", guest.honorific, guest.name, guest.companion),
    attend:
      kind === "bao-hy"
        ? "tới dự Lễ Thành Hôn của chúng tôi"
        : "tới dự Lễ Thành Hôn của hai con chúng tôi",
  };
}

/** The line on the closed envelope: no companion. */
export function envelopeLine(guest: Pick<GuestContext, "honorific" | "name">): string {
  return join("Kính gửi:", guest.honorific, guest.name);
}
