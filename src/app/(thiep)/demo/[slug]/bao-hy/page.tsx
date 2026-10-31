import type { Metadata } from "next";
import { DemoRender, demoMetadata } from "@/components/themes/demo-render";
import { themeSlugs } from "@/themes/registry";

export function generateStaticParams() {
  return themeSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps<"/demo/[slug]/bao-hy">): Promise<Metadata> {
  return demoMetadata(params, "bao-hy");
}

export default function Page({ params }: PageProps<"/demo/[slug]/bao-hy">) {
  return <DemoRender slugPromise={params} kind="bao-hy" />;
}
