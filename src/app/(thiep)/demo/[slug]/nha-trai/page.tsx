import type { Metadata } from "next";
import { DemoRender, demoMetadata } from "@/components/themes/demo-render";
import { themeSlugs } from "@/themes/registry";

export function generateStaticParams() {
  return themeSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: PageProps<"/demo/[slug]/nha-trai">): Promise<Metadata> {
  return demoMetadata(params, "nha-trai");
}

export default function Page({ params }: PageProps<"/demo/[slug]/nha-trai">) {
  return <DemoRender slugPromise={params} side="nha-trai" />;
}
