import type { Metadata } from "next";
import { DemoRender, demoMetadata } from "@/components/themes/demo-render";
import { themeSlugs } from "@/themes/registry";

export function generateStaticParams() {
  return themeSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps<"/demo/[slug]">): Promise<Metadata> {
  return demoMetadata(params, "nha-gai");
}

export default function Page({ params }: PageProps<"/demo/[slug]">) {
  return <DemoRender slugPromise={params} side="nha-gai" />;
}
