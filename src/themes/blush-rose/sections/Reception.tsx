import { cn } from "@/lib/utils";
import { AddToCalendar } from "../../_shared/AddToCalendar";
import { Reveal } from "../../_shared/Reveal";
import type { EventView } from "../../types";
import { eventDateParts, lunarLine } from "../event-date";
import { FlowerSprig, SectionHeading } from "../ornaments";
import { s } from "../styles";
import { HeartCalendar } from "./HeartCalendar";
import { card, DateBlock, Section } from "./layout";

function TimeCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className={cn(s.title, "text-xs font-semibold tracking-[0.2em] uppercase")}>{label}</p>
      <p className={cn(s.title, "mt-1 text-2xl")}>{value}</p>
    </div>
  );
}

function ReceptionCard({
  event,
  index,
  summary,
  showCalendar,
  showRsvpLink,
}: {
  event: EventView;
  index: number;
  summary: string;
  showCalendar: boolean;
  showRsvpLink: boolean;
}) {
  const parts = eventDateParts(event.startsAt);
  const lunar = lunarLine(event.startsAt);
  const times = [
    event.arrivalTimeLabel ? { label: "Đón khách", value: event.arrivalTimeLabel } : null,
    event.banquetTimeLabel ? { label: "Khai tiệc", value: event.banquetTimeLabel } : null,
  ].flatMap((time) => (time ? [time] : []));

  return (
    <Reveal>
      <article className={card}>
        <FlowerSprig
          corner="tl"
          inset={[18, 22]}
          width={140}
          rotate={-16 + index * 8}
          focus="leaves"
        />
        {/* pt-12: keeps the venue name clear of the corner sprig. */}
        <div className="relative flex flex-col items-center gap-6 pt-12">
          <div>
            <h3 className={cn(s.title, "text-xl font-semibold break-words")}>{event.venue}</h3>
            <p className="mt-1 text-lg font-semibold">
              {event.timeLabel}
              {parts && ` · ${parts.weekday}`}
            </p>
            <DateBlock startsAt={event.startsAt} fallback={event.dateLabel} />
            {lunar && <p className="mt-3">{lunar}</p>}
          </div>
          {times.length > 0 && (
            <div
              className={cn(
                "grid w-full gap-4 border-y border-(--br-gold) py-4",
                times.length === 2 ? "grid-cols-2" : "grid-cols-1",
              )}
            >
              {times.map((time) => (
                <TimeCell key={time.label} {...time} />
              ))}
            </div>
          )}
          {showCalendar && <HeartCalendar weddingDate={event.startsAt} />}
          <div className="flex w-full flex-col gap-2">
            <p className={cn(s.title, "text-xs font-semibold tracking-[0.2em] uppercase")}>
              Thêm vào lịch
            </p>
            <AddToCalendar
              event={event}
              summary={summary}
              className="flex-col"
              itemClassName="w-full bg-transparent"
            />
          </div>
          {showRsvpLink && <RsvpLink />}
        </div>
      </article>
    </Reveal>
  );
}

function RsvpLink() {
  return (
    <a
      href="#xac-nhan"
      className="inline-flex min-h-11 w-full items-center justify-center bg-(--br-wine) px-4 text-sm font-semibold tracking-[0.18em] text-(--br-paper) uppercase transition-colors duration-200 hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--br-wine)"
    >
      Xác nhận tham dự
    </a>
  );
}

/**
 * Server Component. One card per reception event. With no reception event but a wedding date, the
 * section degrades to the heart calendar + add-to-calendar for the main event.
 */
export function Reception({
  receptions,
  fallbackEvent,
  weddingDate,
  names,
  showRsvpLink,
}: {
  receptions: EventView[];
  fallbackEvent?: EventView;
  weddingDate?: string;
  names: string;
  showRsvpLink: boolean;
}) {
  const summary = (event: EventView) => `Đám cưới ${names} · ${event.title}`;
  return (
    <Section name="reception">
      <SectionHeading>{receptions.length > 0 ? "Thông tin tiệc cưới" : "Ngày vui"}</SectionHeading>
      {receptions.map((event, index) => (
        <ReceptionCard
          key={event.id}
          event={event}
          index={index}
          summary={summary(event)}
          // One calendar (first card) and one RSVP link (last card), however many receptions.
          showCalendar={index === 0}
          showRsvpLink={showRsvpLink && index === receptions.length - 1}
        />
      ))}
      {receptions.length === 0 && weddingDate && (
        <>
          <Reveal>
            <HeartCalendar weddingDate={weddingDate} />
          </Reveal>
          {fallbackEvent && (
            <AddToCalendar
              event={fallbackEvent}
              summary={summary(fallbackEvent)}
              className="flex-col"
              itemClassName="w-full bg-transparent"
            />
          )}
        </>
      )}
    </Section>
  );
}
