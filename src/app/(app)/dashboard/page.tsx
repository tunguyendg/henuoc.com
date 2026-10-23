import { assertDashboardPreview } from "@/components/dashboard/preview-guard";
import { PageTitle } from "@/components/dashboard/page-title";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  OverviewContent,
  OverviewFallback,
} from "@/components/dashboard/overview/overview-content";

// `robots` is inherited from the dashboard layout (metadata merges per key).
export const metadata: Metadata = { title: "Tổng quan" };

// The page is static; only <OverviewContent> reads request-time data (clock, per-user repo).
export default function DashboardPage() {
  assertDashboardPreview();
  return (
    <>
      <PageTitle>Tổng quan</PageTitle>
      <Suspense fallback={<OverviewFallback />}>
        <OverviewContent />
      </Suspense>
    </>
  );
}
