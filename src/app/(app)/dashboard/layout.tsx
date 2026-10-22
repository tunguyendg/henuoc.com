import { ArrowLeft } from "lucide-react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DashboardSidebarNav, DashboardTabBar } from "@/components/dashboard/dashboard-nav";
import { SampleDataBanner } from "@/components/dashboard/sample-data-banner";
import { WeddingHeading, WeddingHeadingFallback } from "@/components/dashboard/wedding-heading";
import { LogoTile } from "@/components/site/logo";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/container";

// Private app area: never indexed (AGENTS.md §4), not part of the SEO registry. Pages below inherit
// `robots` because metadata merges per key and they only set `title`.
export const metadata: Metadata = {
  title: "Bảng điều khiển",
  robots: { index: false, follow: false },
};

// Draw under the iPhone notch/home indicator so env(safe-area-inset-*) has real values
// (tab bar padding-bottom, header padding-top). Merged with the root viewport.
export const viewport: Viewport = { viewportFit: "cover" };

// Server Component. Everything here is static and lands in the prerendered shell; only
// <WeddingHeading> reads request-time data, so it sits inside <Suspense> and streams in.
export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  // Mock data + no auth yet → never served in production.
  // Gỡ khi có proxy.ts + kiểm tra ownership (session ↔ WeddingMember).
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="flex-1 md:pl-64">
      {/* Desktop sidebar (md+) */}
      <aside className="hidden border-r border-border bg-surface md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:gap-6 md:overflow-y-auto md:px-4 md:py-6">
        {/* Brand mark only (not a link): "Về trang chủ" below is the single way back to "/". */}
        <div className="flex items-center gap-2.5 px-2">
          <LogoTile />
          <span className="text-[1.55rem] leading-none font-extrabold tracking-[-0.035em] text-ink">
            {site.name}
          </span>
        </div>
        <Suspense fallback={<WeddingHeadingFallback variant="sidebar" />}>
          <WeddingHeading variant="sidebar" />
        </Suspense>
        <nav aria-label="Điều hướng bảng điều khiển">
          <DashboardSidebarNav />
        </nav>
        <Link
          href="/"
          className="mt-auto flex h-11 items-center gap-2 rounded-(--radius-btn) px-3 text-sm font-medium text-muted transition-colors duration-200 hover:bg-rose-50/60 hover:text-ink"
        >
          <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
          Về trang chủ
        </Link>
      </aside>

      {/* Mobile header (<md) */}
      <header className="sticky top-0 z-30 flex min-h-14 items-center gap-2 border-b border-border bg-surface/95 px-3 pt-[env(safe-area-inset-top)] backdrop-blur md:hidden">
        <Link
          href="/"
          aria-label={`${site.name} — Về trang chủ`}
          className="flex size-11 shrink-0 items-center justify-center rounded-(--radius-btn)"
        >
          <LogoTile className="size-8 rounded-[10px]" />
        </Link>
        <Suspense fallback={<WeddingHeadingFallback variant="header" />}>
          <WeddingHeading variant="header" />
        </Suspense>
      </header>

      {/* Bottom padding keeps content clear of the fixed mobile tab bar (56px + home indicator). */}
      <main className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-12">
        <Container width="app" className="flex flex-col gap-6 pt-4 md:pt-8">
          <SampleDataBanner />
          {children}
        </Container>
      </main>

      <DashboardTabBar />
    </div>
  );
}
