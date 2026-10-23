"use client";

import { Check, Copy, X } from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { copyText, formatAccountNumber, normalizeAccountNumber } from "./clipboard";
import { SHEET_SWIPE_CLOSE_PX, giftSideLabel, type GiftCard } from "./gift-cards";
import { lockBodyScroll } from "./scroll-lock";
import { useHydrated } from "./use-client-env";

export interface GiftSheetProps {
  cards: GiftCard[];
  open: boolean;
  onClose: () => void;
  title?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared bottom sheet with the bank cards. Mounted only while open (portal to <body>, so a theme's
 * transformed ancestor cannot break `position: fixed`), which keeps account numbers out of the DOM
 * until the guest asks. Close: ×, backdrop tap, Esc, swipe down on the handle.
 */
export function GiftSheet({ cards, open, onClose, title = "Gửi quà mừng" }: GiftSheetProps) {
  const hydrated = useHydrated();
  // Never touch document / createPortal during SSR or hydration.
  if (!hydrated || !open || cards.length === 0) return null;
  return createPortal(<SheetPanel cards={cards} onClose={onClose} title={title} />, document.body);
}

function SheetPanel({ cards, onClose, title }: Omit<GiftSheetProps, "open"> & { title: string }) {
  const titleId = useId();
  const tabsId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ startY: number; dy: number } | null>(null);
  const [active, setActive] = useState(0);
  const card = cards[active] ?? cards[0];

  useEffect(() => lockBodyScroll(), []);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function trapFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !panelRef.current) return;
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = items[0];
    const last = items.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // Swipe down on the handle area. Moves the panel via style (no re-render per pointer move).
  function onDragStart(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    drag.current = { startY: event.clientY, dy: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    if (panelRef.current) panelRef.current.style.transition = "none";
  }
  function onDragMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current || !panelRef.current) return;
    drag.current.dy = Math.max(0, event.clientY - drag.current.startY);
    panelRef.current.style.transform = `translateY(${drag.current.dy}px)`;
  }
  function onDragEnd() {
    const moved = drag.current?.dy ?? 0;
    drag.current = null;
    if (moved > SHEET_SWIPE_CLOSE_PX) {
      onClose();
      return;
    }
    if (panelRef.current) {
      panelRef.current.style.transition = "";
      panelRef.current.style.transform = "";
    }
  }

  function onTabKey(event: ReactKeyboardEvent<HTMLButtonElement>) {
    let next: number;
    if (event.key === "ArrowRight") next = (active + 1) % cards.length;
    else if (event.key === "ArrowLeft") next = (active + cards.length - 1) % cards.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = cards.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    document.getElementById(`${tabsId}-tab-${next}`)?.focus();
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 transition-opacity duration-200 motion-reduce:transition-none starting:opacity-0"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={trapFocus}
        className={cn(
          "absolute inset-x-0 bottom-0 mx-auto flex max-h-[90dvh] w-full max-w-[480px] flex-col rounded-t-3xl bg-surface text-ink shadow-card",
          "transition-transform duration-250 ease-out motion-reduce:transition-none starting:translate-y-full",
        )}
      >
        <div
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          className="shrink-0 touch-none px-5 pt-3"
        >
          <div aria-hidden="true" className="mx-auto h-1.5 w-10 rounded-full bg-border" />
          <div className="mt-2 flex items-center justify-between gap-3">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-rose-50 hover:text-ink focus-visible:outline-2 focus-visible:outline-rose-600 [&_svg]:size-5"
            >
              <X aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto overscroll-contain px-5 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {cards.length > 1 && (
            <div
              role="tablist"
              aria-label="Chọn bên"
              className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-rose-50 p-1"
            >
              {cards.map((c, i) => (
                <button
                  key={c.id}
                  id={`${tabsId}-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-controls={`${tabsId}-panel`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onTabKey}
                  className={cn(
                    "min-h-11 rounded-full text-sm font-semibold transition-colors",
                    i === active
                      ? "bg-surface text-rose-700 shadow-card"
                      : "text-muted hover:text-ink",
                  )}
                >
                  {giftSideLabel[c.side]}
                </button>
              ))}
            </div>
          )}

          {card && (
            <div
              id={`${tabsId}-panel`}
              role={cards.length > 1 ? "tabpanel" : undefined}
              aria-labelledby={cards.length > 1 ? `${tabsId}-tab-${active}` : undefined}
            >
              <GiftCardView key={card.id} card={card} showSide={cards.length === 1} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GiftCardView({ card, showSide }: { card: GiftCard; showSide: boolean }) {
  const numberRef = useRef<HTMLParagraphElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [notice, setNotice] = useState("");
  const side = giftSideLabel[card.side];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onCopy() {
    const ok = await copyText(normalizeAccountNumber(card.accountNumber), navigator.clipboard);
    if (!ok && numberRef.current) {
      // Fallback: select the number so the guest can long-press → Copy.
      const range = document.createRange();
      range.selectNodeContents(numberRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    setNotice(ok ? "Đã sao chép" : "Đã chọn số tài khoản, nhấn giữ để sao chép");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(""), 2500);
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {showSide && (
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">{side}</p>
      )}
      {card.qrSvg ? (
        <Image
          src={card.qrSvg}
          alt={`Mã QR chuyển khoản ${side} – ${card.bankName}`}
          width={208}
          height={208}
          unoptimized
          className="size-52 rounded-2xl border border-border bg-white p-2"
        />
      ) : (
        <div className="flex size-52 items-center justify-center rounded-2xl border border-dashed border-border bg-canvas p-4 text-sm text-muted">
          Chưa có mã QR, bạn chuyển khoản theo số tài khoản bên dưới nhé.
        </div>
      )}
      <dl className="flex w-full flex-col gap-2">
        <div>
          <dt className="text-xs text-muted">Ngân hàng</dt>
          <dd className="font-semibold break-words">{card.bankName}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Chủ tài khoản</dt>
          <dd className="font-semibold break-words">{card.accountName}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Số tài khoản</dt>
          <dd className="flex flex-wrap items-center justify-center gap-2">
            <p ref={numberRef} className="font-mono text-xl tracking-wider break-all select-all">
              {formatAccountNumber(card.accountNumber)}
            </p>
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-(--radius-btn) bg-rose-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 [&_svg]:size-4"
            >
              {notice === "Đã sao chép" ? (
                <Check aria-hidden="true" />
              ) : (
                <Copy aria-hidden="true" />
              )}
              Sao chép
            </button>
          </dd>
        </div>
      </dl>
      <p aria-live="polite" role="status" className="min-h-5 text-sm font-medium text-success">
        {notice}
      </p>
      <p className="rounded-xl bg-warning-soft px-4 py-3 text-sm text-warning">
        Kiểm tra đúng tên người nhận trước khi chuyển.
      </p>
    </div>
  );
}
