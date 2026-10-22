import Image from "next/image";
import type { ReactNode } from "react";
import type { FamilySide, ThemeProps } from "../types";
import type { PlaceholderOptions } from "./manifest";

// Bare-bones theme for checking the demo route and the data contract. No motion, no client JS.

const sideLabel: Record<FamilySide, string> = { "nha-trai": "Nhà trai", "nha-gai": "Nhà gái" };

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-bold tracking-[0.16em] text-rose-700 uppercase">{children}</h2>
  );
}

export default function Theme({ content, guest }: ThemeProps<PlaceholderOptions>) {
  const { couple, sections } = content;
  const [first, second] = couple.brideFirst
    ? [couple.bride, couple.groom]
    : [couple.groom, couple.bride];

  return (
    <div data-theme="placeholder" className="min-h-full bg-canvas text-ink">
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

        {sections.events && content.events.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionTitle>Sự kiện</SectionTitle>
            <ul className="flex flex-col gap-4">
              {content.events.map((event) => (
                <li key={event.id} className="rounded-2xl border border-border bg-surface p-5">
                  {event.side && <p className="text-xs text-muted">{sideLabel[event.side]}</p>}
                  <h3 className="mt-1 text-lg font-semibold">{event.title}</h3>
                  <p className="mt-2">
                    {event.timeLabel} · {event.dateLabel}
                  </p>
                  {event.lunarLabel && <p className="text-sm text-muted">{event.lunarLabel}</p>}
                  <p className="mt-2 font-medium">{event.venue}</p>
                  <p className="text-sm text-muted">{event.address}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {sections.album && content.album.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionTitle>Album</SectionTitle>
            <ul className="grid grid-cols-2 gap-2">
              {content.album.map((image) => (
                <li key={image.src}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 480px) 216px, calc(50vw - 24px)"
                    loading="lazy"
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {sections.gift && content.gifts.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionTitle>Hộp mừng cưới</SectionTitle>
            <ul className="flex flex-col gap-3">
              {content.gifts.map((gift) => (
                <li key={gift.id} className="rounded-2xl border border-border bg-surface p-5">
                  <p className="text-xs text-muted">{sideLabel[gift.side]}</p>
                  <p className="mt-1 font-semibold">{gift.bankName}</p>
                  <p className="break-words">{gift.accountName}</p>
                  <p className="font-mono text-lg tracking-wider break-all">{gift.accountNumber}</p>
                </li>
              ))}
            </ul>
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
      </main>
    </div>
  );
}
