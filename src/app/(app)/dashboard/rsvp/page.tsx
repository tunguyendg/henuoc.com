import { assertDashboardPreview } from "@/components/dashboard/preview-guard";
import { PageTitle } from "@/components/dashboard/page-title";
import type { Metadata } from "next";
import { Suspense } from "react";
import { RsvpContent, RsvpFallback } from "@/components/dashboard/rsvp/rsvp-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// `robots` is inherited from the dashboard layout.
export const metadata: Metadata = { title: "RSVP" };

// Static shell: heading + disabled export. Only <RsvpContent> reads searchParams, inside <Suspense>.
export default function RsvpPage({ searchParams }: PageProps<"/dashboard/rsvp">) {
  assertDashboardPreview();
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle>RSVP</PageTitle>
        <div className="flex items-center gap-2">
          <Button variant="secondary" disabled>
            Xuất CSV
          </Button>
          <Badge tone="warning">Sắp có</Badge>
        </div>
      </header>
      <Suspense fallback={<RsvpFallback />}>
        <RsvpContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
