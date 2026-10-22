import type { Metadata } from "next";

// Placeholder overview — replaced by the real "Tổng quan" page in the next step.
export const metadata: Metadata = { title: "Tổng quan" };

export default function DashboardPage() {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="font-display text-[1.75rem] leading-tight font-extrabold tracking-[-0.03em] md:text-4xl">
        Tổng quan
      </h1>
      <p className="max-w-prose text-muted">
        Nơi hai bạn theo dõi thiệp, khách mời, RSVP và checklist. Trang tổng quan đầy đủ sẽ có ở
        bước tiếp theo.
      </p>
    </section>
  );
}
