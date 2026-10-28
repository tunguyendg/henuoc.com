import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDemoContent } from "@/themes/_demo/content";
import { getThemeEntry } from "@/themes/registry";
import type { FamilySide } from "@/themes/types";

// Shared by /demo/[slug] (nhà gái) and /demo/[slug]/nha-trai. Pages stay thin: routing only.
// Demo pages are never indexed and not listed in the SEO registry or sitemap.

export async function demoMetadata(slugPromise: Promise<{ slug: string }>, side: FamilySide) {
  const { slug } = await slugPromise;
  const entry = getThemeEntry(slug);
  const noIndex = { robots: { index: false, follow: false } } satisfies Metadata;
  if (!entry) return noIndex;
  const title =
    side === "nha-trai"
      ? `Demo ${entry.manifest.name} · bản nhà trai`
      : `Demo ${entry.manifest.name}`;
  return { title, ...noIndex } satisfies Metadata;
}

export async function DemoRender({
  slugPromise,
  side,
}: {
  slugPromise: Promise<{ slug: string }>;
  side: FamilySide;
}) {
  const { slug } = await slugPromise;
  const entry = getThemeEntry(slug);
  if (!entry) notFound();

  const { manifest } = entry;
  // Draft/review themes are dev-only; generateStaticParams still lists every slug because
  // cacheComponents needs at least one param, so production simply prerenders a 404 for them.
  if (process.env.NODE_ENV === "production" && manifest.status !== "published") notFound();

  const [{ default: Theme }, content] = await Promise.all([entry.load(), getDemoContent()]);
  const switchTo =
    side === "nha-gai"
      ? { href: `/demo/${slug}/nha-trai`, label: "Xem bản nhà trai" }
      : { href: `/demo/${slug}`, label: "Xem bản nhà gái" };

  return (
    <>
      {/* z-[60]: above the envelope overlay (fixed inset-0 z-50) so the guest can switch side before opening. */}
      <Link
        href={switchTo.href}
        className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-[max(0.75rem,env(safe-area-inset-left))] z-[60] inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm font-semibold text-ink shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
      >
        {switchTo.label}
      </Link>
      {/* The registry wrapper validates options (falls back to defaults), so no parse here. */}
      <Theme content={content} options={manifest.defaultOptions} mode="demo" side={side} />
    </>
  );
}
