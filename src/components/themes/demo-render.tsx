import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDemoContent } from "@/themes/_demo/content";
import { getThemeEntry } from "@/themes/registry";
import type { GuestContext, InvitationKind } from "@/themes/types";

// Shared by /demo/[slug] (nhà gái), /nha-trai, /bao-hy and their /khach-moi variants (fake guest). Pages stay thin: routing only.
// Demo pages are never indexed and not listed in the SEO registry or sitemap.

const KIND_TITLE_SUFFIX: Record<InvitationKind, string> = {
  "nha-gai": "",
  "nha-trai": " · bản nhà trai",
  "bao-hy": " · bản báo hỷ",
};
const KIND_LABEL: Record<InvitationKind, string> = {
  "nha-gai": "Nhà gái",
  "nha-trai": "Nhà trai",
  "bao-hy": "Báo hỷ",
};
const KIND_PATH: Record<InvitationKind, string> = {
  "nha-gai": "",
  "nha-trai": "/nha-trai",
  "bao-hy": "/bao-hy",
};
const KINDS = Object.keys(KIND_LABEL) as InvitationKind[];

export async function demoMetadata(
  slugPromise: Promise<{ slug: string }>,
  kind: InvitationKind,
  titleSuffix?: string,
) {
  const { slug } = await slugPromise;
  const entry = getThemeEntry(slug);
  const noIndex = { robots: { index: false, follow: false } } satisfies Metadata;
  if (!entry) return noIndex;
  const base = `Demo ${entry.manifest.name}${KIND_TITLE_SUFFIX[kind]}`;
  const title = titleSuffix ? `${base} · ${titleSuffix}` : base;
  return { title, ...noIndex } satisfies Metadata;
}

export async function DemoRender({
  slugPromise,
  kind,
  guest,
}: {
  slugPromise: Promise<{ slug: string }>;
  kind: InvitationKind;
  guest?: GuestContext;
}) {
  const { slug } = await slugPromise;
  const entry = getThemeEntry(slug);
  if (!entry) notFound();

  const { manifest } = entry;
  // Draft/review themes are dev-only; generateStaticParams still lists every slug because
  // cacheComponents needs at least one param, so production simply prerenders a 404 for them.
  if (process.env.NODE_ENV === "production" && manifest.status !== "published") notFound();

  const [{ default: Theme }, content] = await Promise.all([entry.load(), getDemoContent(kind)]);
  const suffix = guest ? "/khach-moi" : "";

  return (
    <>
      {/* z-[60]: above the envelope overlay (fixed inset-0 z-50) so the guest can switch kind before opening. */}
      <nav
        aria-label="Đổi bản demo"
        className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-[max(0.75rem,env(safe-area-inset-left))] z-[60] inline-flex items-center rounded-full border border-border bg-surface p-0.5 text-sm font-semibold text-ink shadow-sm"
      >
        {KINDS.filter((other) => other !== kind).map((other) => (
          <Link
            key={other}
            href={`/demo/${slug}${KIND_PATH[other]}${suffix}`}
            className="inline-flex min-h-11 items-center rounded-full px-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            {KIND_LABEL[other]}
          </Link>
        ))}
      </nav>
      {/* The registry wrapper validates options (falls back to defaults), so no parse here. */}
      <Theme
        content={content}
        options={manifest.defaultOptions}
        mode="demo"
        side={kind}
        guest={guest}
      />
    </>
  );
}
