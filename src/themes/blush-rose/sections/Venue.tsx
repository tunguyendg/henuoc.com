import { MapPin } from "lucide-react";
import { clientEnv } from "@/lib/env.client";
import { mapEmbedUrl } from "@/lib/maps-embed";
import { cn } from "@/lib/utils";
import { MapButton } from "../../_shared/MapButton";
import { Reveal } from "../../_shared/Reveal";
import type { EventView } from "../../types";
import { FlowerSprig, SectionHeading } from "../ornaments";
import { s } from "../styles";
import { card, Section } from "./layout";

/**
 * Server Component. The main event (the reception) gets an embedded map when the public Maps key is
 * set; the other events are a compact list. The embed query holds only venue + address: never
 * guest data or the token (the iframe also sends origin-only referrers).
 */
export function Venue({ events, mainEvent }: { events: EventView[]; mainEvent?: EventView }) {
  const others = events.filter((event) => event.id !== mainEvent?.id);
  const embed = mainEvent
    ? mapEmbedUrl(
        `${mainEvent.venue}, ${mainEvent.address}`,
        clientEnv.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY,
      )
    : undefined;

  return (
    <Section name="venue">
      <SectionHeading>Địa điểm</SectionHeading>
      {mainEvent && (
        <Reveal>
          <div className="flex flex-col gap-4">
            {embed && (
              <div className="aspect-4/3 w-full overflow-hidden rounded-sm border border-(--br-gold) bg-(--br-card)">
                <iframe
                  src={embed}
                  title={`Bản đồ ${mainEvent.venue}`}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="size-full border-0"
                />
              </div>
            )}
            <div className="text-center">
              <p className={cn(s.title, "text-lg font-semibold break-words")}>{mainEvent.venue}</p>
              <p className="break-words">{mainEvent.address}</p>
            </div>
            <MapButton url={mainEvent.mapUrl} className="w-full bg-transparent" />
          </div>
        </Reveal>
      )}
      {others.length > 0 && (
        <Reveal>
          <div className={cn(card, "pt-8 pb-8 text-left")}>
            <FlowerSprig corner="br" inset={[14, 14]} width={120} rotate={-20} flip />
            <ul role="list" className="relative flex flex-col gap-6">
              {others.map((event) => (
                <li key={event.id} className="flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <MapPin
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 stroke-(--br-gold)"
                    />
                    <div className="min-w-0">
                      <p className={cn(s.title, "font-semibold break-words")}>{event.title}</p>
                      <p className="break-words">{event.venue}</p>
                      <p className="text-base break-words text-muted">{event.address}</p>
                    </div>
                  </div>
                  <MapButton url={event.mapUrl} className="w-full bg-transparent" />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
