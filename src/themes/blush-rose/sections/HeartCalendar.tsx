import { cn } from "@/lib/utils";
import { getMonthGrid } from "../month-grid";
import { s } from "../styles";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;

// Heart in a 40×40 box.
const HEART_PATH =
  "M20 34 C8 25 4 18 4 12.5 C4 8 7.5 5 11.5 5 C15 5 18 7 20 10.5 C22 7 25 5 28.5 5 C32.5 5 36 8 36 12.5 C36 18 32 25 20 34 Z";

/**
 * Server Component: month calendar (Monday first) with the wedding day inside a filled heart.
 * The filled heart scales in when an ancestor <Reveal> reaches the viewport (theme.css).
 */
export function HeartCalendar({
  weddingDate,
  className,
  variant = "paper",
}: {
  weddingDate: string;
  className?: string;
  /** "tile": light tile for use on a wine card (heart filled with the card colour). */
  variant?: "paper" | "tile";
}) {
  const grid = getMonthGrid(weddingDate);
  if (!grid) return null;
  const { year, month, day, weeks } = grid;
  const tile = variant === "tile";

  return (
    <div
      role="img"
      aria-label={`Tháng ${month} năm ${year}, ngày ${day} được khoanh`}
      className={cn(
        "mx-auto w-full max-w-[22rem]",
        tile && "rounded-xl bg-[#ece5da] p-4 text-(--br-card-bg)",
        className,
      )}
    >
      <p className={cn(s.title, "mb-3 text-center text-lg font-semibold")}>
        Tháng {month} · {year}
      </p>
      <div className="grid grid-cols-7 text-center">
        {WEEKDAYS.map((label) => (
          <span key={label} className={cn(s.title, "pb-2 text-xs font-semibold tracking-wider")}>
            {label}
          </span>
        ))}
        {weeks.flat().map((value, index) => {
          if (value === null) return <span key={`pad-${index}`} className="h-10" />;
          const isWeddingDay = value === day;
          return (
            <span
              key={value}
              className={cn(
                "relative flex h-10 items-center justify-center text-lg",
                isWeddingDay && "font-semibold",
              )}
            >
              {isWeddingDay && (
                <svg
                  viewBox="0 0 40 40"
                  aria-hidden="true"
                  focusable="false"
                  className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-[54%] overflow-visible"
                >
                  <path
                    d={HEART_PATH}
                    className={cn(s.heart, tile ? "fill-(--br-card-bg)" : "fill-(--br-wine)")}
                  />
                </svg>
              )}
              <span
                className={cn(
                  "relative",
                  isWeddingDay && (tile ? "text-white" : "text-(--br-paper)"),
                )}
              >
                {value}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
