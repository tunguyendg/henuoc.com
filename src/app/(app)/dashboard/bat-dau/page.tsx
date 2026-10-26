import type { Metadata } from "next";
import { assertDashboardPreview } from "@/components/dashboard/preview-guard";
import { PageTitle } from "@/components/dashboard/page-title";
import { CreateWeddingForm } from "@/components/dashboard/onboarding/create-wedding-form";

// `robots` is inherited from the dashboard layout (metadata merges per key).
export const metadata: Metadata = { title: "Bắt đầu" };

export default function OnboardingPage() {
  assertDashboardPreview();
  return (
    <>
      <PageTitle>Tạo thiệp của hai bạn</PageTitle>
      <p className="mt-2 text-muted">Chỉ cần tên hai bạn, phần còn lại điền dần cũng được.</p>
      <div className="mt-6 max-w-md">
        <CreateWeddingForm />
      </div>
    </>
  );
}
