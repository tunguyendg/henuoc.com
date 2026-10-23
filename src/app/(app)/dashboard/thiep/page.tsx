import type { Metadata } from "next";
import { Suspense } from "react";
import { EditorSection } from "@/components/dashboard/card/editor-section";
import { PageTitle } from "@/components/dashboard/page-title";
import { assertDashboardPreview } from "@/components/dashboard/preview-guard";

// Only `title`: robots is inherited from the dashboard layout.
export const metadata: Metadata = { title: "Thiệp của tôi" };

export default function CardPage() {
  assertDashboardPreview();
  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <PageTitle>Thiệp của tôi</PageTitle>
        <p className="max-w-prose text-muted">
          Chọn mẫu, điền thông tin và xem thiệp đổi theo ngay bên cạnh.
        </p>
      </header>
      <Suspense
        fallback={<div aria-hidden className="h-64 animate-pulse rounded-2xl bg-rose-50" />}
      >
        <EditorSection />
      </Suspense>
    </section>
  );
}
