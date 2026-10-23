import { assertDashboardPreview } from "@/components/dashboard/preview-guard";
import { PageTitle } from "@/components/dashboard/page-title";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ChecklistFallback,
  ChecklistSection,
} from "@/components/dashboard/checklist/checklist-section";

// `robots` is inherited from the dashboard layout.
export const metadata: Metadata = { title: "Checklist" };

export default function ChecklistPage() {
  assertDashboardPreview();
  return (
    <>
      <PageTitle>Checklist</PageTitle>
      <Suspense fallback={<ChecklistFallback />}>
        <ChecklistSection />
      </Suspense>
    </>
  );
}
