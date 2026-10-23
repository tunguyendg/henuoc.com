import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { assertAdminPreview } from "@/features/admin/guard";
import { LogoTile } from "@/components/site/logo";

// No auth yet: dev-only mock. Pages repeat the guard (see features/admin/guard.ts).
export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s · Hẹn Ước" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  assertAdminPreview();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <p
        role="note"
        className="flex items-center justify-center gap-2 bg-gold-100 px-4 py-2 text-center text-sm font-medium text-ink"
      >
        <FlaskConical aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
        Bản mẫu: dữ liệu giả, thao tác không được lưu
      </p>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-6 md:flex-row md:gap-10 md:px-8 md:py-10">
        <aside className="min-w-0 md:w-56 md:shrink-0">
          <Link
            href="/admin"
            className="mb-4 flex items-center gap-2 font-display font-extrabold tracking-[-0.035em]"
          >
            <LogoTile className="size-8" />
            Quản trị
          </Link>
          <AdminNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
