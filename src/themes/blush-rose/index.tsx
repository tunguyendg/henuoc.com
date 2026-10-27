import Image from "next/image";
import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { getTrack, getTracks } from "@/data/music";
import { cn } from "@/lib/utils";
import { AddToCalendar } from "../_shared/AddToCalendar";
import { Gift } from "../_shared/Gift";
import { MapButton } from "../_shared/MapButton";
import { MusicCredit } from "../_shared/MusicCredit";
import { Reveal } from "../_shared/Reveal";
import { RsvpForm } from "../_shared/RsvpForm";
import { Watermark } from "../_shared/Watermark";
import type { EventView, FamilySide, Person, ThemeProps } from "../types";
import { Experience } from "./Experience";
import { fontVariables } from "./fonts";
import type { BlushRoseOptions } from "./manifest";
import { FlowerSprig, SectionHeading, WaxSeal } from "./ornaments";
import { Album } from "./sections/Album";
import { DressCodeDots } from "./sections/DressCode";
import { HeartCalendar } from "./sections/HeartCalendar";
import { LiXiArt, LiXiFlower } from "./sections/LiXi";
import { s } from "./styles";
import "./theme.css";

// Blush Rose: ivory paper, wine red, gold hairlines, one Redouté painting.
// Guest journey (docs/themes/blush-rose.md §6): envelope cover → names → ceremony → album →
// reception + heart calendar + RSVP → venues → dress code → gift → thanks.
// Only Experience (envelope + music) and Album are client leaves of the theme.

const DEMO_MAX_ATTENDEES = 4;
const CEREMONY_KINDS: readonly EventView["kind"][] = ["vu-quy", "thanh-hon"];
const RECEPTION_KINDS: readonly EventView["kind"][] = ["tiec", "an-hoi", "tan-hon"];

const weddingDateFormat = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "long",
  timeZone: "Asia/Ho_Chi_Minh",
});

const sideLabel: Record<FamilySide, string> = { "nha-trai": "Nhà trai", "nha-gai": "Nhà gái" };

const card =
  "relative overflow-hidden border border-(--br-gold) bg-(--br-card) px-6 pt-10 pb-12 text-center";

function initialOf(person: Person): string {
  const [first] = Array.from(person.shortName.trim());
  return first ? first.toLocaleUpperCase("vi") : "·";
}

/** The event the heart calendar / "add to calendar" refers to: same instant as weddingDate, else the last. */
function pickMainEvent(events: EventView[], weddingDate?: string): EventView | undefined {
  if (weddingDate) {
    const target = new Date(weddingDate).getTime();
    const match = events.find((e) => new Date(e.startsAt).getTime() === target);
    if (match) return match;
  }
  return events.at(-1);
}

function EventDateBlock({ event }: { event: EventView }) {
  return (
    <>
      {event.side && (
        <p className={cn(s.title, "text-xs font-semibold tracking-[0.2em] uppercase")}>
          {sideLabel[event.side]}
        </p>
      )}
      <h3 className={cn(s.title, "mt-2 text-xl font-semibold")}>{event.title}</h3>
      <p className={cn(s.title, "mt-4 text-2xl")}>{event.dateLabel}</p>
      <p className="mt-1 text-xl font-semibold">{event.timeLabel}</p>
      {event.lunarLabel && <p className="mt-1">Tức {event.lunarLabel.replace(/^Ngày/, "ngày")}</p>}
      <p className="mt-3 font-semibold break-words">{event.venue}</p>
    </>
  );
}

function Section({
  name,
  children,
  className,
}: {
  name: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section data-section={name} className={cn("flex flex-col gap-6", className)}>
      {children}
    </section>
  );
}

export default function Theme({ content, guest, options, mode }: ThemeProps<BlushRoseOptions>) {
  const { couple, sections } = content;
  const palette = options.palette ?? "do-do";
  const [first, second] = couple.brideFirst
    ? [couple.bride, couple.groom]
    : [couple.groom, couple.bride];
  const names = `${first.shortName} & ${second.shortName}`;
  const initials = [initialOf(first), initialOf(second)] as const;

  // Resolve only enabled catalog tracks; raw content URLs never reach the client player.
  const selectedTrack = options.musicSlug
    ? getTrack(options.musicSlug)
    : getTracks({ enabled: true }).find((track) => track.src === content.music?.src);
  const track = selectedTrack?.enabled ? selectedTrack : undefined;

  const dateLabel = content.weddingDate
    ? weddingDateFormat.format(new Date(content.weddingDate))
    : undefined;

  // Events this guest may see. No guest (public page / demo) → every event.
  const events = guest
    ? content.events.filter((e) => guest.invitedEventIds.includes(e.id))
    : content.events;
  const ceremonies = sections.events ? events.filter((e) => CEREMONY_KINDS.includes(e.kind)) : [];
  const receptions = sections.events ? events.filter((e) => RECEPTION_KINDS.includes(e.kind)) : [];
  const venues = sections.events ? events.filter((e) => e.mapUrl) : [];
  const mainEvent = pickMainEvent(events, content.weddingDate);
  const showCalendar = sections.events && Boolean(content.weddingDate);
  // RSVP needs a token in production. The demo has no guest, so it gets made-up limits and the
  // form's fake submit. Fields are passed one by one: never the whole guest (it holds the token).
  const showRsvp = sections.rsvp && events.length > 0 && (guest !== undefined || mode === "demo");
  const showReception = receptions.length > 0 || showCalendar || showRsvp;
  const eventSummary = (event: EventView) => `Đám cưới ${names} · ${event.title}`;

  return (
    <div
      data-theme="blush-rose"
      data-palette={palette}
      className={cn(s.root, s.paper, fontVariables)}
    >
      <Experience
        musicSrc={track?.src}
        mode={mode}
        names={names}
        initials={initials}
        dateLabel={dateLabel}
        salutation={guest?.salutation}
        photo={content.cover}
      />

      <main
        className={cn(
          s.main,
          "mx-auto flex w-full max-w-[480px] flex-col gap-16 px-5 pt-10 pb-[max(5rem,calc(env(safe-area-inset-bottom)+4rem))]",
        )}
      >
        {sections.cover && (
          <header data-section="cover" className="flex flex-col items-center gap-5 text-center">
            {content.cover && (
              <div className="relative aspect-4/5 w-[min(80vw,380px)] -rotate-2 overflow-hidden border-[8px] border-[color-mix(in_srgb,var(--br-paper)_50%,white)] shadow-[0_10px_28px_rgb(74_22_26/0.25)]">
                <Image
                  src={content.cover.src}
                  alt={content.cover.alt}
                  fill
                  sizes="(max-width: 480px) 80vw, 380px"
                  preload
                  className="object-cover"
                />
              </div>
            )}
            <p className={cn(s.title, "text-xs font-semibold tracking-[0.24em] uppercase")}>
              Thiệp cưới
            </p>
            <h1 className={cn(s.script, "max-w-full text-5xl")}>{names}</h1>
            {dateLabel && <p className={cn(s.title, "text-lg")}>{dateLabel}</p>}
          </header>
        )}

        {(sections.couple || sections.invitation) && (
          <Section name="names" className="items-center text-center">
            {sections.invitation && (
              <Reveal className="flex flex-col items-center gap-3">
                {guest && (
                  <p className={cn(s.title, "text-lg font-semibold break-words")}>
                    {guest.salutation}
                  </p>
                )}
                <p className="max-w-[24rem] text-pretty">{content.inviteMessage}</p>
              </Reveal>
            )}
            {sections.couple && (
              <div className="flex flex-col items-center gap-2">
                {(
                  [
                    {
                      person: first,
                      label: couple.brideFirst ? "Cô dâu" : "Chú rể",
                      parents: couple.brideFirst
                        ? content.families.brideParents
                        : content.families.groomParents,
                    },
                    {
                      person: second,
                      label: couple.brideFirst ? "Chú rể" : "Cô dâu",
                      parents: couple.brideFirst
                        ? content.families.groomParents
                        : content.families.brideParents,
                    },
                  ] as const
                ).map(({ person, label, parents }, index) => (
                  <div key={label} className="flex w-full flex-col items-center gap-2">
                    {index === 1 && (
                      <p aria-hidden="true" className={cn(s.script, "text-3xl")}>
                        &amp;
                      </p>
                    )}
                    <Reveal
                      delayMs={index === 0 ? 0 : 150}
                      className="flex w-full flex-col items-center"
                    >
                      <p
                        className={cn(s.title, "text-xs font-semibold tracking-[0.2em] uppercase")}
                      >
                        {label}
                      </p>
                      <h2 className={cn(s.script, "max-w-full text-5xl")}>{person.shortName}</h2>
                      <p className={cn(s.title, "text-base break-words")}>{person.fullName}</p>
                      {(person.parents ?? parents) && (
                        <p className="mt-1 max-w-[22rem] text-base break-words">
                          {person.parents ?? parents}
                        </p>
                      )}
                    </Reveal>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {ceremonies.length > 0 && (
          <Section name="ceremony">
            <SectionHeading>Lễ cưới</SectionHeading>
            <ul role="list" className="flex flex-col gap-6">
              {ceremonies.map((event, index) => (
                <li key={event.id}>
                  <Reveal>
                    <article className={card}>
                      <FlowerSprig
                        corner={index % 2 === 0 ? "tr" : "tl"}
                        inset={[18, 18]}
                        width={150}
                        rotate={index % 2 === 0 ? 12 : -12}
                        flip={index % 2 === 1}
                      />
                      <EventDateBlock event={event} />
                      <WaxSeal
                        initials={initials}
                        className="absolute bottom-3 left-1/2 size-9 -translate-x-1/2 opacity-90"
                      />
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {sections.album && content.album.length > 0 && (
          <Section name="album" className="-mx-5">
            <SectionHeading>Album ảnh</SectionHeading>
            <Reveal>
              <Album images={content.album} />
            </Reveal>
          </Section>
        )}

        {showReception && (
          <Section name="reception">
            <SectionHeading>{receptions.length > 0 ? "Tiệc cưới" : "Ngày vui"}</SectionHeading>
            {receptions.map((event, index) => (
              <Reveal key={event.id}>
                <article className={card}>
                  <FlowerSprig
                    corner="tl"
                    inset={[18, 22]}
                    width={150}
                    rotate={-16 + index * 8}
                    focus="leaves"
                  />
                  <EventDateBlock event={event} />
                </article>
              </Reveal>
            ))}
            {showCalendar && content.weddingDate && (
              <Reveal>
                <HeartCalendar weddingDate={content.weddingDate} />
              </Reveal>
            )}
            {showCalendar && mainEvent && (
              <AddToCalendar
                event={mainEvent}
                summary={eventSummary(mainEvent)}
                className="flex-col"
                itemClassName="w-full bg-transparent"
              />
            )}
            {showRsvp && (
              <Reveal>
                <div className="flex flex-col gap-4 border border-(--br-gold) bg-(--br-card) p-5">
                  <h3 className={cn(s.title, "text-center text-lg font-semibold")}>
                    Xác nhận tham dự
                  </h3>
                  <RsvpForm
                    mode={mode}
                    invitedEventIds={events.map((e) => e.id)}
                    maxAttendees={guest?.maxAttendees ?? DEMO_MAX_ATTENDEES}
                    rsvp={guest?.rsvp}
                    events={events.map(({ id, title, dateLabel: date, timeLabel }) => ({
                      id,
                      title,
                      dateLabel: date,
                      timeLabel,
                    }))}
                    className="border-0 bg-transparent p-0"
                  />
                </div>
              </Reveal>
            )}
          </Section>
        )}

        {venues.length > 0 && (
          <Section name="venue">
            <SectionHeading>Địa điểm</SectionHeading>
            <Reveal>
              <div className={cn(card, "pt-8 pb-8 text-left")}>
                <FlowerSprig corner="br" inset={[14, 14]} width={120} rotate={-20} flip />
                <ul role="list" className="flex flex-col gap-6">
                  {venues.map((event) => (
                    <li key={event.id} className="relative flex flex-col gap-2">
                      <div className="flex items-start gap-3">
                        <MapPin
                          aria-hidden="true"
                          className="mt-1 size-5 shrink-0 stroke-(--br-gold)"
                        />
                        <div className="min-w-0">
                          <p className={cn(s.title, "font-semibold break-words")}>{event.venue}</p>
                          <p className="text-base break-words">{event.address}</p>
                        </div>
                      </div>
                      <MapButton url={event.mapUrl} className="w-full bg-transparent" />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </Section>
        )}

        {options.dressCode && (
          <Section name="dress-code">
            <Reveal>
              <DressCodeDots colors={options.dressCode} />
            </Reveal>
          </Section>
        )}

        {sections.gift && content.gifts.length > 0 && (
          <Section name="gift" className="items-center text-center">
            <SectionHeading>Quà mừng</SectionHeading>
            <p className="max-w-[22rem]">Nếu muốn gửi quà mừng, bạn chạm vào bao lì xì nhé.</p>
            <Reveal>
              <div className="relative flex justify-center">
                <LiXiFlower />
                <Gift
                  gifts={content.gifts}
                  className={cn(
                    s.lixi,
                    "relative min-h-0 bg-transparent p-2 text-ink hover:bg-transparent",
                  )}
                >
                  <LiXiArt />
                  <span className={cn(s.title, "text-base font-semibold")}>Gửi quà mừng</span>
                </Gift>
              </div>
            </Reveal>
          </Section>
        )}

        {sections.thanks && (
          <Section name="thanks" className="items-center text-center">
            <Reveal>
              <div className={cn(card, "border-0 bg-transparent")}>
                <FlowerSprig corner="tl" inset={[10, 40]} width={150} rotate={10} flip />
                <p className={cn(s.script, "text-6xl")}>Cảm ơn</p>
                <p className="mt-2">Rất mong được đón bạn trong ngày vui của chúng mình.</p>
                <p className={cn(s.title, "mt-4 text-lg font-semibold")}>{names}</p>
                <WaxSeal initials={initials} className="mx-auto mt-4 size-12" />
              </div>
            </Reveal>
          </Section>
        )}

        {/* Outside `thanks`: the Free plan keeps its watermark and the Redouté credit even if that section is off. */}
        <footer className="flex flex-col items-center gap-1 text-center">
          <Watermark show={content.showWatermark} />
          <MusicCredit track={track} hidden={mode === "preview"} />
          <p className="text-xs text-muted">
            Tranh hoa: Pierre-Joseph Redouté, Cleveland Museum of Art (CC0)
          </p>
        </footer>
      </main>
    </div>
  );
}
