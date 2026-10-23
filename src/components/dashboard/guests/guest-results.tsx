"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { DeliveryStatus } from "@/features/guest/types";
import type { Side } from "@/features/wedding/types";
import { sideLabels } from "./filters";
import { GuestStatus } from "./guest-status";
import { InviteLinkButton } from "./invite-link-button";

/** Exactly the fields the list renders (no openedAt timestamp, event ids, ...). */
export interface GuestRow {
  id: string;
  displayName: string;
  salutation: string;
  side: Side;
  groupName: string;
  maxAttendees: number;
  delivery: DeliveryStatus;
  opened: boolean;
  hasRsvp: boolean;
  revoked: boolean;
}

const Q_MAX = 100;
// Same column template for the header and every row at md+.
const cols =
  "md:grid md:grid-cols-[minmax(0,1.5fr)_5rem_minmax(0,1fr)_minmax(0,1.6fr)_14rem] md:items-center md:gap-4";

// Client leaf: owns the search box. The query lives in component state only, never in the URL
// (guest names must not end up in URLs, AGENTS.md §4), so it is lost on reload on purpose.
export function GuestResults({
  guests,
  filtered,
}: {
  guests: readonly GuestRow[];
  filtered: boolean;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLocaleLowerCase("vi");
  const shown = q
    ? guests.filter((g) => g.displayName.toLocaleLowerCase("vi").includes(q))
    : guests;

  return (
    <div className="flex flex-col gap-4">
      <div role="search">
        <Input
          label="Tìm theo tên"
          type="search"
          autoComplete="off"
          maxLength={Q_MAX}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <p className="text-sm text-muted" aria-live="polite">
        {shown.length} khách{filtered || q ? " khớp bộ lọc" : ""}.
      </p>

      {shown.length === 0 ? (
        <p className="rounded-(--radius-card) border border-border bg-surface p-6 text-center text-muted">
          Không có khách nào khớp bộ lọc.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* md+ column headings; the list below is the single source of rows. */}
          <div
            aria-hidden
            className={`hidden px-4 text-xs font-semibold tracking-wide text-muted uppercase ${cols}`}
          >
            <span>Khách</span>
            <span>Bên</span>
            <span>Nhóm</span>
            <span>Trạng thái</span>
            <span>Link riêng</span>
          </div>
          <ul className="flex flex-col gap-3">
            {shown.map((g) => (
              <li
                key={g.id}
                className={`flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card) md:py-3 ${cols}`}
              >
                <div className="min-w-0">
                  <p className="text-base font-bold break-words text-ink">{g.displayName}</p>
                  <p className="text-sm break-words text-muted">{g.salutation}</p>
                  {/* < md only: the other columns carry this on desktop */}
                  <p className="mt-1 text-sm text-muted md:hidden">
                    {sideLabels[g.side]} · {g.groupName} · tối đa {g.maxAttendees} người
                  </p>
                </div>
                <p className="hidden text-sm md:block">{sideLabels[g.side]}</p>
                <p className="hidden min-w-0 text-sm break-words md:block">{g.groupName}</p>
                <GuestStatus guest={g} />
                <InviteLinkButton guestId={g.id} guestName={g.displayName} disabled={g.revoked} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
