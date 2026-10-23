import { first } from "@/lib/search-params";
import type { ProductCategory } from "@/features/shopping/types";

export const productCategoryOptions: readonly { value: ProductCategory; label: string }[] = [
  { value: "gia-tien", label: "Gia tiên" },
  { value: "an-hoi", label: "Ăn hỏi" },
  { value: "co-dau", label: "Cô dâu" },
  { value: "qua-cam-on", label: "Quà cảm ơn" },
  { value: "trang-tri", label: "Trang trí tiệc" },
  { value: "chup-anh", label: "Chụp ảnh" },
];

export function categoryLabel(category: ProductCategory): string {
  return productCategoryOptions.find((o) => o.value === category)?.label ?? category;
}

/** URL input is untrusted: only a known category passes, anything else means "all". */
export function parseCategory(value: string | string[] | undefined): ProductCategory | undefined {
  const v = first(value);
  return productCategoryOptions.find((o) => o.value === v)?.value;
}
