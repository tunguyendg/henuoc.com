"use client";

import { useCountdown } from "../_shared/use-countdown";

interface CountdownProps {
  /** ISO 8601 */
  date: string;
}

const units = [
  ["days", "Ngày"],
  ["hours", "Giờ"],
  ["minutes", "Phút"],
  ["seconds", "Giây"],
] as const;

export function Countdown({ date }: CountdownProps) {
  const parts = useCountdown(date);

  // null = server render / hydration. Reserve the height so the layout does not jump (CLS).
  if (!parts) return <div aria-hidden="true" className="h-20" />;

  if (parts.isPast) {
    return <p className="text-center font-serif text-2xl">Đã diễn ra</p>;
  }

  return (
    <dl className="grid grid-cols-4 gap-2 text-center">
      {units.map(([key, label]) => (
        <div key={key} className="rounded-xl border border-border bg-surface px-1 py-3">
          <dt className="text-xs text-muted">{label}</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {String(parts[key]).padStart(2, "0")}
          </dd>
        </div>
      ))}
    </dl>
  );
}
