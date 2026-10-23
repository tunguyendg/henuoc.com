import type { ProductCategory } from "@/features/shopping/types";
import { ChipLink, buildHref } from "@/components/dashboard/chip-link";
import { productCategoryOptions } from "./categories";

const BASE = "/dashboard/mua-sam";

export function CategoryChips({ active }: { active?: ProductCategory }) {
  return (
    <div role="group" aria-label="Lọc theo danh mục" className="flex flex-wrap gap-2">
      <ChipLink href={BASE} active={!active}>
        Tất cả
      </ChipLink>
      {productCategoryOptions.map((o) => (
        <ChipLink
          key={o.value}
          href={buildHref(BASE, { category: o.value })}
          active={active === o.value}
        >
          {o.label}
        </ChipLink>
      ))}
    </div>
  );
}
