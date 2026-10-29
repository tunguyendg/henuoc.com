import { cn } from "@/lib/utils";
import { AddToCalendar } from "../../_shared/AddToCalendar";
import { Reveal } from "../../_shared/Reveal";
import type { EventView } from "../../types";
import { eventDateParts, lunarLine } from "../event-date";
import { FlowerSprig, SectionHeading } from "../ornaments";
import { s } from "../styles";
import { HeartCalendar } from "./HeartCalendar";
import { card, DateBlock, Section } from "./layout";

// Small underlined text link; tailwind-merge drops the shared button chrome, icons hidden.
const calendarLink =
  "rounded-none border-0 bg-transparent px-2 font-normal underline underline-offset-4 hover:bg-transparent [&_svg]:hidden";

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
    // Flower = sibling BEFORE the card, outside Reveal (no opacity/transform ancestor → multiply hits the paper).
    <div className="relative">
      <FlowerSprig
        corner="tl"
        inset={[36, 6]}
        width={150}
        rotate={-16 + index * 8}
        focus="leaves"
      />
      <Reveal>
        <article className={card}>
          <div className="flex flex-col items-center gap-6">
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
                  "grid w-full gap-4 border-y border-(--br-card-accent) py-4",
                  times.length === 2 ? "grid-cols-2" : "grid-cols-1",
                )}
              >
                {times.map((time) => (
                  <TimeCell key={time.label} {...time} />
                ))}
              </div>
            )}
            {showCalendar && <HeartCalendar weddingDate={event.startsAt} variant="tile" />}
            <div role="group" aria-label="Thêm vào lịch">
              <AddToCalendar
                event={event}
                summary={summary}
                labels={{ ics: "Tải .ics" }}
                separator="·"
                className="flex-nowrap items-center justify-center gap-1"
                itemClassName={calendarLink}
              />
            </div>
            {showRsvpLink && <RsvpLink />}
          </div>
        </article>
      </Reveal>
    </div>
  );
}

function RsvpLink() {
  return (
    <a
      href="#xac-nhan"
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-(--br-card-ink) px-8 text-sm font-semibold tracking-[0.18em] text-(--br-card-bg) uppercase transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--br-card-ink)"
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
