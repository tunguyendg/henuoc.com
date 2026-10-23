"use client";

import { Gift as GiftIcon } from "lucide-react";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { GiftCard } from "./gift-cards";
import { GiftSheet } from "./GiftSheet";

export interface GiftButtonProps {
  cards: GiftCard[];
  className?: string;
  /** Button content; defaults to icon + "Gửi quà mừng". */
  children?: ReactNode;
  sheetTitle?: string;
}

/** Client leaf: owns the open state, renders the button + shared sheet, returns focus on close. */
export function GiftButton({ cards, className, children, sheetTitle }: GiftButtonProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  if (cards.length === 0) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex min-h-12 items-center justify-center gap-2 rounded-(--radius-btn) bg-rose-600 px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 [&_svg]:size-5",
          className,
        )}
      >
        {children ?? (
          <>
            <GiftIcon aria-hidden="true" />
            Gửi quà mừng
          </>
        )}
      </button>
      <GiftSheet cards={cards} open={open} onClose={close} title={sheetTitle} />
    </>
  );
}
