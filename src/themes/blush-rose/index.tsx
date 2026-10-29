import Image from "next/image";
import { getTrack, getTracks } from "@/data/music";
import { cn } from "@/lib/utils";
import { Gift } from "../_shared/Gift";
import { MusicCredit } from "../_shared/MusicCredit";
import { Reveal } from "../_shared/Reveal";
import { RsvpForm } from "../_shared/RsvpForm";
import { eventTitle, partiesInSideOrder, timelineForEvents, visibleEvents } from "../_shared/side";
import { Watermark } from "../_shared/Watermark";
import type { EventView, Person, ThemeProps } from "../types";
import { Experience } from "./Experience";
import { fontVariables } from "./fonts";
import type { BlushRoseOptions } from "./manifest";
import { FlowerSprig, SectionHeading, WaxSeal } from "./ornaments";
import { Album } from "./sections/Album";
import { Ceremony } from "./sections/Ceremony";
import { DressCodeDots } from "./sections/DressCode";
import { paperCard, Section } from "./sections/layout";
import { LiXiArt, LiXiFlower } from "./sections/LiXi";
import { Reception } from "./sections/Reception";
import { Timeline } from "./sections/Timeline";
import { Venue } from "./sections/Venue";
import { s } from "./styles";
import "./theme.css";

// Blush Rose: ivory paper, wine red, gold hairlines, one Redouté painting.
// Guest journey (docs/themes/blush-rose.md §6): envelope cover → names → ceremony → album →
// reception + heart calendar → timeline → venue → dress code → RSVP → gift → thanks.
// Only Experience (envelope + music) and Album are client leaves of the theme.

const DEMO_MAX_ATTENDEES = 4;
const CEREMONY_KINDS: readonly EventView["kind"][] = ["vu-quy", "thanh-hon", "tan-hon", "an-hoi"];
const RECEPTION_KINDS: readonly EventView["kind"][] = ["tiec"];

const weddingDateFormat = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "long",
  timeZone: "Asia/Ho_Chi_Minh",
});

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

export default function Theme({
  content,
  guest,
  options,
  mode,
  side,
}: ThemeProps<BlushRoseOptions>) {
  const { sections } = content;
  const palette = options.palette ?? "do-do";
  const parties = partiesInSideOrder(content, side);
  const [first, second] = [parties[0].person, parties[1].person];
  const names = `${first.shortName} & ${second.shortName}`;
  const initials = [initialOf(first), initialOf(second)] as const;

  // Resolve only enabled catalog tracks; raw content URLs never reach the client player.
  const selectedTrack = options.musicSlug
    ? getTrack(options.musicSlug)
    : getTracks({ enabled: true }).find((track) => track.src === content.music?.src);
  const track = selectedTrack?.enabled ? selectedTrack : undefined;

  // Events of this side (plus shared ones), narrowed to the guest's invitation when there is one.
  const events = visibleEvents(content.events, side, guest);
  const ceremonies = sections.events ? events.filter((e) => CEREMONY_KINDS.includes(e.kind)) : [];
  const receptions = sections.events ? events.filter((e) => RECEPTION_KINDS.includes(e.kind)) : [];
  const mainEvent = pickMainEvent(events, content.weddingDate);
  const mainDate = mainEvent?.startsAt ?? content.weddingDate;
  const dateLabel = mainDate ? weddingDateFormat.format(new Date(mainDate)) : undefined;
  const showCalendar = sections.events && Boolean(mainEvent);
  const showVenue =
    sections.events && events.length > 0 && events.some((e) => e.mapUrl || e.id === mainEvent?.id);
  // RSVP needs a token in production. The demo has no guest, so it gets made-up limits and the
  // form's fake submit. Fields are passed one by one: never the whole guest (it holds the token).
  const showRsvp = sections.rsvp && events.length > 0 && (guest !== undefined || mode === "demo");
  const showReception = receptions.length > 0 || showCalendar;
  const timeline = sections.timeline ? timelineForEvents(content.timeline ?? [], events) : [];
  const dressCode = sections.dressCode ? options.dressCode : undefined;

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
          </header>
        )}

        {ceremonies.length > 0 && (
          <Ceremony content={content} side={side} events={ceremonies} initials={initials} />
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
          <Reception
            receptions={receptions}
            fallbackEvent={mainEvent}
            weddingDate={mainEvent?.startsAt}
            names={names}
            showRsvpLink={showRsvp}
          />
        )}

        {timeline.length > 0 && <Timeline items={timeline} />}

        {showVenue && <Venue events={events} mainEvent={mainEvent} />}

        {dressCode && dressCode.length > 0 && (
          <Section name="dress-code">
            <Reveal>
              <DressCodeDots colors={dressCode} />
            </Reveal>
          </Section>
        )}

        {showRsvp && (
          <Section name="rsvp" id="xac-nhan">
            <SectionHeading>Xác nhận tham dự</SectionHeading>
            <Reveal>
              <div className={cn(paperCard, "px-5 py-6 text-left")}>
                <RsvpForm
                  mode={mode}
                  invitedEventIds={events.map((e) => e.id)}
                  maxAttendees={guest?.maxAttendees ?? DEMO_MAX_ATTENDEES}
                  rsvp={guest?.rsvp}
                  events={events.map((event) => ({
                    id: event.id,
                    title: eventTitle(event, side),
                    dateLabel: event.dateLabel,
                    timeLabel: event.timeLabel,
                  }))}
                  className="border-0 bg-transparent p-0"
                />
              </div>
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
              <div className={cn(paperCard, "border-0 bg-transparent")}>
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
