import type { ReactNode } from "react";
import type { GiftView } from "../types";
import { toGiftCards } from "./gift-cards";
import { GiftButton } from "./GiftButton";

export interface GiftProps {
  gifts: GiftView[];
  className?: string;
  children?: ReactNode;
  sheetTitle?: string;
}

/**
 * Server Component entry point for themes: `<Gift gifts={content.gifts} />`.
 * Maps GiftView → GiftCard on the server so `qrPayload` never reaches the client bundle/payload.
 * No gifts → renders nothing (docs/07 §10).
 */
export function Gift({ gifts, className, children, sheetTitle }: GiftProps) {
  const cards = toGiftCards(gifts);
  if (cards.length === 0) return null;
  return (
    <GiftButton cards={cards} className={className} sheetTitle={sheetTitle}>
      {children}
    </GiftButton>
  );
}
