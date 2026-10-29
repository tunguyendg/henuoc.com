"use client";

import { CalendarPlus, Download } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { EventView } from "../types";
import { buildIcs, googleCalendarUrl, icsFileName, type CalendarOptions } from "./calendar";

export interface AddToCalendarProps {
  event: EventView;
  /** e.g. "Đám cưới Minh Anh & Hoàng Nam · Lễ Thành Hôn". Defaults to the event title. */
  summary?: string;
  description?: string;
  durationHours?: number;
  className?: string;
  /** Applied to both actions so themes can restyle them. */
  itemClassName?: string;
  /** Override the visible labels (defaults: "Google Calendar" / "Tải file .ics"). */
  labels?: { google?: string; ics?: string };
  /** Rendered between the two actions (aria-hidden), e.g. "·". Nothing by default. */
  separator?: ReactNode;
}

const itemBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-(--radius-btn) border border-border bg-surface px-4 text-sm font-semibold text-ink transition-colors duration-200 hover:border-rose-500 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 [&_svg]:size-4 [&_svg]:shrink-0";

/** Two plain actions instead of a dropdown: easier to hit on mobile, works in in-app browsers. */
export function AddToCalendar({
  event,
  summary,
  description,
  durationHours,
  className,
  itemClassName,
  labels,
  separator,
}: AddToCalendarProps) {
  const opts: CalendarOptions = { summary, description, durationHours };
  const revokeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(revokeTimer.current), []);

  let googleUrl: string | undefined;
  try {
    googleUrl = googleCalendarUrl(event, opts);
  } catch {
    // Invalid startsAt → no calendar actions at all.
    return null;
  }

  function downloadIcs() {
    const blob = new Blob([buildIcs(event, opts)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = icsFileName(event);
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Some browsers read the blob after click() returns; revoke a bit later.
    window.clearTimeout(revokeTimer.current);
    revokeTimer.current = window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(itemBase, itemClassName)}
      >
        <CalendarPlus aria-hidden="true" />
        {labels?.google ?? "Google Calendar"}
      </a>
      {separator != null && <span aria-hidden="true">{separator}</span>}
      <button type="button" onClick={downloadIcs} className={cn(itemBase, itemClassName)}>
        <Download aria-hidden="true" />
        {labels?.ics ?? "Tải file .ics"}
      </button>
    </div>
  );
}
