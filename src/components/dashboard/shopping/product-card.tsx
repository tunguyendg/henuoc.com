import { Gift } from "lucide-react";
import { Photo } from "@/components/home/photo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProductView } from "@/features/shopping/types";
import { categoryLabel } from "./categories";

export function ProductCard({ product }: { product: ProductView }) {
  // Own images only (path under /, not //host): no third-party hosts from dashboard data.
  const image =
    product.imageUrl?.startsWith("/") && !product.imageUrl.startsWith("//")
      ? product.imageUrl
      : undefined;
  return (
    <li className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)">
      {image ? (
        <Photo
          src={image}
          alt={`Ảnh sản phẩm: ${product.name}`}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="aspect-[4/3] rounded-xl"
        />
      ) : (
        <div
          aria-hidden
          className="flex aspect-[4/3] items-center justify-center rounded-xl bg-gold-100 text-ink/60"
        >
          <Gift className="size-10" strokeWidth={1.5} />
        </div>
      )}
      <div className="flex flex-col items-start gap-2">
        <Badge>{categoryLabel(product.category)}</Badge>
        <h3 className="text-base leading-snug font-bold text-ink">{product.name}</h3>
        {product.shopName ? <p className="text-sm text-muted">{product.shopName}</p> : null}
        {product.priceLabel ? (
          <p className="text-[15px] font-semibold text-ink">{product.priceLabel}</p>
        ) : null}
        {product.note ? <p className="text-sm text-muted">{product.note}</p> : null}
      </div>
      {/* No affiliate link yet: the button stays disabled until /go/[productId] exists. */}
      <Button variant="secondary" disabled className="mt-auto w-full">
        Xem trên Shopee
      </Button>
    </li>
  );
}
