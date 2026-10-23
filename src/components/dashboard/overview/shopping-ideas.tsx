import { ArrowRight, Gift } from "lucide-react";
import Link from "next/link";
import { buildHref } from "@/components/dashboard/chip-link";
import { categoryLabel } from "@/components/dashboard/shopping/categories";
import { Card } from "@/components/ui/card";
import type { ProductView } from "@/features/shopping/types";

/** Up to 3 suggestions, one per category so the list is not 3 of the same kind. */
export function pickIdeas(products: readonly ProductView[], max = 3): ProductView[] {
  const seen = new Set<string>();
  const out: ProductView[] = [];
  for (const p of products) {
    if (seen.has(p.category)) continue;
    seen.add(p.category);
    out.push(p);
    if (out.length === max) break;
  }
  return out;
}

export function ShoppingIdeas({ products }: { products: readonly ProductView[] }) {
  const ideas = pickIdeas(products);
  if (ideas.length === 0) return null;
  return (
    <Card className="flex flex-col gap-4 p-5 md:p-6">
      <div>
        <h2 className="text-lg font-bold text-ink">Gợi ý mua sắm</h2>
        <p className="text-sm text-muted">Vài món hai bạn có thể cân nhắc.</p>
      </div>
      <ul className="flex flex-col divide-y divide-border">
        {ideas.map((p) => (
          <li key={p.id}>
            <Link
              href={buildHref("/dashboard/mua-sam", { category: p.category })}
              className="flex min-h-14 items-center gap-3 py-2 first:pt-0"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-ink">
                <Gift aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] leading-snug font-semibold text-ink">
                  {p.name}
                </span>
                <span className="block text-sm text-muted">{categoryLabel(p.category)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/dashboard/mua-sam"
        className="inline-flex min-h-11 items-center gap-1.5 self-start text-[15px] font-semibold text-rose-700 underline-offset-4 hover:underline"
      >
        Xem tất cả gợi ý
        <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
      </Link>
    </Card>
  );
}
