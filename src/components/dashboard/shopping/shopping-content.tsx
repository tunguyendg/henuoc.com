import { assertDashboardPreview } from "@/components/dashboard/preview-guard";
import { connection } from "next/server";
import { repos } from "@/features/repos";
import { CategoryChips } from "./category-chips";
import { parseCategory } from "./categories";
import { ProductCard } from "./product-card";

type SearchParams = Record<string, string | string[] | undefined>;

/** Reads searchParams (runtime API) → must sit inside <Suspense>. */
export async function ShoppingContent({ searchParams }: { searchParams: Promise<SearchParams> }) {
  assertDashboardPreview();
  await connection();
  const category = parseCategory((await searchParams).category);
  const wedding = await repos.wedding.getCurrentWedding();
  const products = await repos.shopping.listSuggestions(wedding.id, category);

  return (
    <>
      <CategoryChips active={category} />
      <p className="text-sm text-muted" aria-live="polite">
        {products.length} gợi ý.
      </p>
      {products.length === 0 ? (
        <p className="rounded-(--radius-card) border border-border bg-surface p-6 text-center text-muted">
          Chưa có gợi ý nào trong danh mục này.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ul>
      )}
    </>
  );
}

export function ShoppingFallback() {
  return <div aria-hidden className="h-64 animate-pulse rounded-(--radius-card) bg-rose-50" />;
}
