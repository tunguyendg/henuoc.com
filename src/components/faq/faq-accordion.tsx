import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/data/faq";
import { cn } from "@/lib/utils";

/**
 * FAQ accordion built on native <details>/<summary>: opens and closes without any client JS,
 * so it stays a Server Component. Each question is an <h3> (sections above own the <h2>).
 */
export function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <div
      className={cn(
        "divide-y divide-border rounded-(--radius-card) border border-border bg-surface",
        className,
      )}
    >
      {items.map((f) => (
        <details key={f.q} className="group px-5 py-5 md:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <h3 className="font-semibold text-ink">{f.q}</h3>
            <ChevronDown
              aria-hidden
              className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="mt-3 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
