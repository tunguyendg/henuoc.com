import type { Metadata } from "next";
import { DemoRender, demoMetadata } from "@/components/themes/demo-render";
import { demoGuest } from "@/themes/_demo/content";
import { themeSlugs } from "@/themes/registry";

export function generateStaticParams() {
  return themeSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: PageProps<"/demo/[slug]/khach-moi">): Promise<Metadata> {
  return demoMetadata(params, "nha-gai", "có khách mời");
}

export default function Page({ params }: PageProps<"/demo/[slug]/khach-moi">) {
  return <DemoRender slugPromise={params} side="nha-gai" guest={demoGuest} />;
}
