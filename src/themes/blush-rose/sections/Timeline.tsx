import { cn } from "@/lib/utils";
import { Reveal } from "../../_shared/Reveal";
import type { TimelineItem } from "../../types";
import { FlowerSprig, SectionHeading } from "../ornaments";
import { s } from "../styles";
import { Section } from "./layout";
import { TimelineGlyph } from "./timeline-icons";

/**
 * Server Component: wedding-day schedule on a wine card. Columns: time | gold axis with dots | icon,
 * title, description. The flower hangs off the card's corner onto the paper (never multiplied on wine).
 */
export function Timeline({ items }: { items: TimelineItem[] }) {
  const last = items.length - 1;
  return (
    <Section name="timeline">
      <SectionHeading>Lịch trình ngày cưới</SectionHeading>
      <div className="relative mt-8">
        {/* Sibling of the card, not a child: it blends with the paper behind, only its edge touches the wine. */}
        <FlowerSprig corner="tr" inset={[16, -38]} width={150} rotate={8} />
        <div className="bg-(--br-wine) px-5 py-8 text-(--br-paper)">
          <ol role="list" className="flex flex-col">
            {items.map((item, index) => (
              <li key={item.id}>
                <Reveal
                  delayMs={index * 120}
                  className={cn(
                    "grid grid-cols-[3.75rem_1rem_minmax(0,1fr)] gap-x-3",
                    index < last && "pb-6",
                  )}
                >
                  <p
                    className={cn(
                      s.title,
                      "pt-0.5 text-right text-lg leading-snug font-semibold text-(--br-gold)",
                    )}
                  >
                    {item.timeLabel}
                  </p>
                  <div aria-hidden="true" className="relative">
                    {items.length > 1 && (
                      <span
                        className={cn(
                          "absolute left-1/2 w-px -translate-x-1/2 bg-(--br-gold)",
                          index === 0
                            ? "top-3 bottom-0"
                            : index === last
                              ? "top-0 h-3"
                              : "top-0 bottom-0",
                        )}
                      />
                    )}
                    <span className="absolute top-2 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-(--br-gold)" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      {item.icon && (
                        <TimelineGlyph
                          icon={item.icon}
                          className="mt-0.5 size-6 shrink-0 text-(--br-gold)"
                        />
                      )}
                      <h3 className={cn(s.title, "text-lg leading-snug font-semibold break-words")}>
                        {item.title}
                      </h3>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-base break-words text-(--br-paper)/85">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
