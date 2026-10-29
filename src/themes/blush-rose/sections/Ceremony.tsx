import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "../../_shared/Reveal";
import { eventTitle, partiesInSideOrder, sideLabel, sideWording } from "../../_shared/side";
import type { EventView, FamilySide, WeddingContent } from "../../types";
import { eventDateParts, lunarLine } from "../event-date";
import { FlowerSprig, SectionHeading, WaxSeal } from "../ornaments";
import { s } from "../styles";
import { card, DateBlock, Section } from "./layout";

function ParentsColumn({
  label,
  parents,
  addr,
}: {
  label: string;
  parents?: string;
  addr?: string;
}) {
  return (
    <div className="min-w-0 text-[0.9375rem] leading-snug break-words">
      <p className={cn(s.title, "text-xs font-semibold tracking-[0.2em] uppercase")}>{label}</p>
      {parents && (
        <p className="mt-2">
          {parents.split("·").map((line, index) => (
            <span key={`${index}-${line}`} className="block">
              {line.trim()}
            </span>
          ))}
        </p>
      )}
      {addr && <p className="mt-2 text-muted">{addr}</p>}
    </div>
  );
}

function CeremonyEvent({ event, side }: { event: EventView; side: FamilySide }): ReactNode {
  const parts = eventDateParts(event.startsAt);
  const lunar = lunarLine(event.startsAt);
  return (
    <div>
      {event.side !== "chung" && (
        <p className={cn(s.title, "text-xs font-semibold tracking-[0.2em] uppercase")}>
          {sideLabel[event.side]}
        </p>
      )}
      <h3 className={cn(s.title, "mt-1 text-xl font-semibold")}>{eventTitle(event, side)}</h3>
      <p className="mt-1 text-lg font-semibold">
        {event.timeLabel}
        {parts && ` · ${parts.weekday}`}
      </p>
      <DateBlock startsAt={event.startsAt} fallback={event.dateLabel} />
      {lunar && <p className="mt-3">{lunar}</p>}
      <p className="mt-2 font-semibold break-words">{event.venue}</p>
    </div>
  );
}

/**
 * Server Component: one paper card with both families, the announcement line, the couple's full
 * names and every ceremony (vu quy, thanh hon, an hoi). Maps live in the venue section.
 */
export function Ceremony({
  content,
  events,
  initials,
  side,
}: {
  content: WeddingContent;
  side: FamilySide;
  events: EventView[];
  initials: readonly [string, string];
}) {
  const parties = partiesInSideOrder(content, side);
  const [first, second] = [parties[0].person, parties[1].person];
  // Both families always shown, host family on the left.
  const columns = parties.map((party) => ({
    key: party.role,
    label: sideLabel[party.side],
    parents: party.parents,
    addr: party.addr,
  }));

  return (
    <Section name="ceremony">
      <SectionHeading>Thông tin lễ cưới</SectionHeading>
      {/* Flower is a sibling BEFORE the card (outside Reveal): multiply blends with the paper, the card paints above it. */}
      <div className="relative">
        <FlowerSprig corner="tr" inset={[36, 4]} width={150} rotate={12} />
        <Reveal>
          <article className={cn(card, "px-5")}>
            <div className="flex flex-col gap-6">
              {columns.length > 0 && (
                <div
                  className={cn(
                    "grid gap-4",
                    columns.length === 2 ? "grid-cols-2" : "mx-auto max-w-[16rem] grid-cols-1",
                  )}
                >
                  {columns.map(({ key, ...column }) => (
                    <ParentsColumn key={key} {...column} />
                  ))}
                </div>
              )}
              <p className="mx-auto max-w-[18rem] text-pretty">{sideWording[side].announcement}</p>
              <div>
                <p className={cn(s.script, "text-4xl")}>{first.fullName}</p>
                {first.birthOrder && <p className="text-sm text-muted">{first.birthOrder}</p>}
                <p aria-hidden="true" className={cn(s.script, "text-2xl")}>
                  &amp;
                </p>
                <p className={cn(s.script, "text-4xl")}>{second.fullName}</p>
                {second.birthOrder && <p className="text-sm text-muted">{second.birthOrder}</p>}
              </div>
              <ul role="list" className="flex flex-col gap-8">
                {events.map((event) => (
                  <li key={event.id}>
                    <CeremonyEvent event={event} side={side} />
                  </li>
                ))}
              </ul>
              <WaxSeal initials={initials} className="mx-auto size-9 opacity-90" />
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
