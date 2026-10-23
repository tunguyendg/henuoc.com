import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { adminMetadata, assertAdminPreview } from "@/features/admin/guard";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { repos } from "@/features/repos";

export const metadata = adminMetadata("Tổng quan");

const sections = [
  { href: "/admin/nguoi-dung", label: "Người dùng", hint: "Tài khoản, vai trò, số đám cưới" },
  { href: "/admin/dam-cuoi", label: "Đám cưới", hint: "Lọc theo gói, trạng thái, tên" },
  { href: "/admin/mau-thiep", label: "Mẫu thiệp", hint: "Bật/tắt mẫu, số đám cưới dùng" },
] as const;

export default async function AdminOverviewPage() {
  assertAdminPreview();
  // Counted by the repo from the same rows as the lists, never hard-coded.
  const stats = await repos.admin.getStats();

  const cards = [
    { label: "Người dùng", value: stats.users },
    { label: "Đám cưới", value: stats.weddings },
    { label: "Gói Cao cấp", value: stats.premiumWeddings },
    { label: "Đã xuất bản", value: stats.publishedWeddings },
  ];

  return (
    <>
      <AdminPageHeader title="Tổng quan">Số liệu tính từ dữ liệu mẫu.</AdminPageHeader>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-4 md:p-6">
            <dt className="text-sm text-muted">{c.label}</dt>
            <dd className="mt-1 font-display text-3xl font-extrabold tracking-[-0.03em]">
              {c.value}
            </dd>
          </Card>
        ))}
      </dl>

      <h2 className="mt-10 mb-3 text-lg font-semibold">Các mục</h2>
      <ul className="grid gap-3 md:grid-cols-3">
        {sections.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="flex items-center justify-between gap-3 rounded-(--radius-card) border border-border bg-surface p-4 transition-colors hover:border-rose-500"
            >
              <span>
                <span className="block font-semibold">{s.label}</span>
                <span className="block text-sm text-muted">{s.hint}</span>
              </span>
              <ArrowRight aria-hidden className="size-5 shrink-0 text-rose-600" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
