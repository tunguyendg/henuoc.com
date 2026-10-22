import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demoContent } from "@/themes/_demo/content";
import { getThemeEntry, themeSlugs } from "@/themes/registry";

// Demo pages are never indexed and not listed in the SEO registry or sitemap.

export function generateStaticParams() {
  return themeSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/demo/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getThemeEntry(slug);
  if (!entry) return { robots: { index: false, follow: false } };
  return { title: `Demo ${entry.manifest.name}`, robots: { index: false, follow: false } };
}

export default async function Page({ params }: PageProps<"/demo/[slug]">) {
  const { slug } = await params;
  const entry = getThemeEntry(slug);
  if (!entry) notFound();

  const { manifest } = entry;
  // Draft/review themes are dev-only; generateStaticParams still lists every slug because
  // cacheComponents needs at least one param, so production simply prerenders a 404 for them.
  if (process.env.NODE_ENV === "production" && manifest.status !== "published") notFound();

  const { default: Theme } = await entry.load();
  // The registry wrapper validates options (falls back to defaults), so no parse here.
  return <Theme content={demoContent} options={manifest.defaultOptions} mode="demo" />;
}
