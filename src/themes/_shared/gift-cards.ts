import type { FamilySide, GiftView } from "../types";

// What the client-side gift sheet receives. Deliberately drops `qrPayload` (never rendered) so it is
// not serialized into the RSC payload.
export interface GiftCard {
  id: string;
  side: FamilySide;
  bankName: string;
  accountName: string;
  accountNumber: string;
  qrSvg?: string;
}

export { sideLabel as giftSideLabel } from "./side";

const SIDE_ORDER: FamilySide[] = ["nha-trai", "nha-gai"];

/** Swipe distance (px) past which a drag on the sheet handle closes it. */
export const SHEET_SWIPE_CLOSE_PX = 80;

/** Only our server-generated SVG data URI is allowed as an <img> source. */
export function isQrDataUri(value: string | undefined): value is string {
  return typeof value === "string" && /^data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+$/.test(value);
}

/** At most one card per side (first one wins), nhà trai first. */
export function toGiftCards(gifts: readonly GiftView[]): GiftCard[] {
  return SIDE_ORDER.flatMap((side) => {
    const gift = gifts.find((g) => g.side === side);
    if (!gift) return [];
    return [
      {
        id: gift.id,
        side: gift.side,
        bankName: gift.bankName,
        accountName: gift.accountName,
        accountNumber: gift.accountNumber,
        qrSvg: isQrDataUri(gift.qrSvg) ? gift.qrSvg : undefined,
      },
    ];
  });
}
