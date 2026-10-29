import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { eventDateParts } from "../event-date";
import { s } from "../styles";

/**
 * Solid wine card (theme.css .br-card). No overflow-hidden and no flower inside: the section puts a
 * FlowerSprig as a sibling BEFORE it so the flower peeks out from behind onto the paper.
 */
export const card = cn(s.card, "px-6 pt-10 pb-12 text-center");

/** Previous paper look with a gold hairline: Venue list, RSVP wrapper, thanks. */
export const paperCard =
  "relative overflow-hidden border border-(--br-gold) bg-(--br-card) px-6 pt-10 pb-12 text-center";

/** One top-level block of the invitation; `name` becomes data-section (used by tests and QA). */
export function Section({
  name,
  children,
  className,
  id,
}: {
  name: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      data-section={name}
      className={cn("flex scroll-mt-6 flex-col gap-6", className)}
    >
      {children}
    </section>
  );
}

/** Big day number | gold rule | "THÁNG 10" over "2027". Date comes from the ISO instant, VN zone. */
export function DateBlock({ startsAt, fallback }: { startsAt: string; fallback: string }) {
  const parts = eventDateParts(startsAt);
  if (!parts) return <p className={cn(s.title, "mt-3 text-2xl")}>{fallback}</p>;
  return (
    <div className="mt-3 flex items-center justify-center gap-4">
      <span className={cn(s.title, "text-7xl leading-none font-semibold")}>{parts.day}</span>
      <span aria-hidden="true" className="h-14 w-px bg-(--br-card-accent)" />
      <span className="flex flex-col text-left">
        <span className={cn(s.title, "text-sm font-semibold tracking-[0.2em] uppercase")}>
          Tháng {parts.month}
        </span>
        <span className={cn(s.title, "text-xl")}>{parts.year}</span>
      </span>
    </div>
  );
}
