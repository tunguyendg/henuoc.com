import { assertDashboardPreview } from "@/components/dashboard/preview-guard";
import { PageTitle } from "@/components/dashboard/page-title";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ShoppingContent,
  ShoppingFallback,
} from "@/components/dashboard/shopping/shopping-content";

// `robots` is inherited from the dashboard layout.
export const metadata: Metadata = { title: "Mua sắm" };

export default function ShoppingPage({ searchParams }: PageProps<"/dashboard/mua-sam">) {
  assertDashboardPreview();
  return (
    <>
      <header className="flex flex-col gap-2">
        <PageTitle>Mua sắm</PageTitle>
        <p className="max-w-prose text-muted">
          Gợi ý theo từng khâu chuẩn bị cưới. Nút Shopee chưa bật. Liên kết tiếp thị sẽ được ghi rõ
          khi bật.
        </p>
      </header>
      <Suspense fallback={<ShoppingFallback />}>
        <ShoppingContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
