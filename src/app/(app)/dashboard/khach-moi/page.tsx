import type { Metadata } from "next";
import { Suspense } from "react";
import { GuestsSection } from "@/components/dashboard/guests/guests-section";
import { PageTitle } from "@/components/dashboard/page-title";
import { assertDashboardPreview } from "@/components/dashboard/preview-guard";

// Only `title`: robots is inherited from the dashboard layout.
export const metadata: Metadata = { title: "Khách mời" };

// The page shell (H1) is static. The part that reads searchParams — a runtime API under Cache
// Components — streams in from inside <Suspense>.
export default function GuestsPage(props: PageProps<"/dashboard/khach-moi">) {
  assertDashboardPreview();
  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <PageTitle>Khách mời</PageTitle>
        <p className="max-w-prose text-muted">
          Lọc theo bên, theo nhóm hoặc tìm theo tên. Mỗi khách có một link riêng.
        </p>
      </header>
      <Suspense fallback={<p className="text-muted">Đang tải danh sách…</p>}>
        <GuestsSection searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}
