import Image from "next/image";
import type { ReactNode } from "react";
import { isAllowedMusicUrl } from "@/lib/url-allowlist";
import { AddToCalendar } from "../_shared/AddToCalendar";
import { Gift } from "../_shared/Gift";
import { MapButton } from "../_shared/MapButton";
import { Reveal } from "../_shared/Reveal";
import { RsvpForm } from "../_shared/RsvpForm";
import { Watermark } from "../_shared/Watermark";
import type { FamilySide, ThemeProps } from "../types";
import { Countdown } from "./Countdown";
import { Experience } from "./Experience";
import type { PlaceholderOptions } from "./manifest";

// Bare-bones theme that wires every shared primitive, in the guest journey order of docs/07 §10:
// envelope cover → invitation → events → countdown → album → RSVP → gift → thanks.
// Only Experience and Countdown are theme-level client leaves; the rest is Server Components.

const DEMO_MAX_ATTENDEES = 4;

const weddingDateFormat = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "full",
  timeZone: "Asia/Ho_Chi_Minh",
});

const sideLabel: Record<FamilySide, string> = { "nha-trai": "Nhà trai", "nha-gai": "Nhà gái" };

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-bold tracking-[0.16em] text-rose-700 uppercase">{children}</h2>
  );
}

export default function Theme({ content, guest, mode }: ThemeProps<PlaceholderOptions>) {
  const { couple, sections } = content;
  const [first, second] = couple.brideFirst
    ? [couple.bride, couple.groom]
    : [couple.groom, couple.bride];

  // Same rule as MapButton: a URL that fails the allowlist is dropped on the server → no ♪ button.
  const musicSrc =
    content.music && isAllowedMusicUrl(content.music.src) ? content.music.src : undefined;
  const names = `${first.shortName} & ${second.shortName}`;
  const dateLabel = content.weddingDate
    ? weddingDateFormat.format(new Date(content.weddingDate))
    : undefined;

  // Events this guest may see. No guest (public page / demo) → every event.
  const events = guest
    ? content.events.filter((e) => guest.invitedEventIds.includes(e.id))
    : content.events;
  // RSVP needs a token in production. The demo has no guest, so it gets made-up limits and the
  // form's fake submit. We pass fields one by one: never the whole guest (it holds the token).
  const showRsvp = sections.rsvp && events.length > 0 && (guest !== undefined || mode === "demo");

  return (
    <div data-theme="placeholder" className="min-h-full bg-canvas text-ink">
      <Experience musicSrc={musicSrc} mode={mode}>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">Thiệp cưới</p>
          <p className="font-serif text-4xl leading-tight break-words">{names}</p>
          {dateLabel && <p className="text-sm text-muted">{dateLabel}</p>}
          {guest && <p className="mt-2 font-semibold break-words">{guest.salutation}</p>}
        </div>
      </Experience>
      <main className="mx-auto flex w-full max-w-[480px] flex-col gap-12 px-5 py-10">
        {sections.cover && (
          <header className="flex flex-col items-center gap-6 text-center">
            {content.cover && (
              <Image
                src={content.cover.src}
                alt={content.cover.alt}
                width={content.cover.width}
                height={content.cover.height}
                sizes="(min-width: 480px) 440px, calc(100vw - 40px)"
                preload
                className="aspect-[4/5] w-full rounded-2xl object-cover"
              />
            )}
            <p className="text-sm text-muted">Thiệp cưới</p>
            <h1 className="font-serif text-4xl leading-tight break-words">
              {first.shortName}
              <span className="block text-2xl text-rose-700">&amp;</span>
              {second.shortName}
            </h1>
          </header>
        )}

        {sections.invitation && (
          <section className="flex flex-col gap-3 text-center">
            <SectionTitle>Lời mời</SectionTitle>
            {guest && <p className="text-lg font-semibold break-words">{guest.salutation}</p>}
            <p className="text-muted">{content.inviteMessage}</p>
          </section>
        )}

        {sections.couple && (
          <section className="grid gap-6 text-center sm:grid-cols-2">
            {(
              [
                { role: "bride", label: "Cô dâu", person: couple.bride },
                { role: "groom", label: "Chú rể", person: couple.groom },
              ] as const
            ).map(({ role, label, person }) => (
              <div key={role} className="flex flex-col gap-1">
                <p className="text-xs text-muted">{label}</p>
                <p className="text-lg font-semibold break-words">{person.fullName}</p>
                {person.parents && <p className="text-sm text-muted">{person.parents}</p>}
              </div>
            ))}
          </section>
        )}

        {sections.events && events.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionTitle>Sự kiện</SectionTitle>
            <ul className="flex flex-col gap-4">
              {events.map((event) => (
                <li key={event.id} className="rounded-2xl border border-border bg-surface p-5">
                  {event.side && <p className="text-xs text-muted">{sideLabel[event.side]}</p>}
                  <h3 className="mt-1 text-lg font-semibold">{event.title}</h3>
                  <p className="mt-2">
                    {event.timeLabel} · {event.dateLabel}
                  </p>
                  {event.lunarLabel && <p className="text-sm text-muted">{event.lunarLabel}</p>}
                  <p className="mt-2 font-medium">{event.venue}</p>
                  <p className="text-sm text-muted">{event.address}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <MapButton url={event.mapUrl} />
                    <AddToCalendar event={event} summary={`Đám cưới ${names} · ${event.title}`} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {sections.countdown && content.weddingDate && (
          <section className="flex flex-col gap-4">
            <SectionTitle>Đếm ngược</SectionTitle>
            <Countdown date={content.weddingDate} />
          </section>
        )}

        {sections.album && content.album.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionTitle>Album</SectionTitle>
            <ul className="grid grid-cols-2 gap-2">
              {content.album.map((image, index) => (
                <li key={image.src}>
                  <Reveal delayMs={(index % 2) * 100}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(min-width: 480px) 216px, calc(50vw - 24px)"
                      loading="lazy"
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        )}

        {showRsvp && (
          <section className="flex flex-col gap-4">
            <SectionTitle>Xác nhận tham dự</SectionTitle>
            <RsvpForm
              mode={mode}
              invitedEventIds={events.map((e) => e.id)}
              maxAttendees={guest?.maxAttendees ?? DEMO_MAX_ATTENDEES}
              rsvp={guest?.rsvp}
              events={events.map(({ id, title, dateLabel, timeLabel }) => ({
                id,
                title,
                dateLabel,
                timeLabel,
              }))}
            />
          </section>
        )}

        {sections.gift && content.gifts.length > 0 && (
          <section className="flex flex-col items-center gap-4 text-center">
            <SectionTitle>Mừng cưới</SectionTitle>
            <p className="text-muted">Nếu muốn gửi quà mừng, bạn bấm nút bên dưới nhé.</p>
            <Gift gifts={content.gifts} />
          </section>
        )}

        {sections.thanks && (
          <footer className="text-center">
            <p className="font-serif text-2xl">Cảm ơn bạn!</p>
            <p className="mt-2 text-sm text-muted">
              {first.shortName} &amp; {second.shortName}
            </p>
          </footer>
        )}

        {/* Outside `thanks`: the Free plan keeps its watermark even if that section is off. */}
        <Watermark show={content.showWatermark} />
      </main>
    </div>
  );
}
