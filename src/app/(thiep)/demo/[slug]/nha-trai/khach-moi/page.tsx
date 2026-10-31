import type { Metadata } from "next";
import { DemoRender, demoMetadata } from "@/components/themes/demo-render";
import { demoGuests } from "@/themes/_demo/content";
import { themeSlugs } from "@/themes/registry";

export function generateStaticParams() {
  return themeSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: PageProps<"/demo/[slug]/nha-trai/khach-moi">): Promise<Metadata> {
  return demoMetadata(params, "nha-trai", "có khách mời");
}

export default function Page({ params }: PageProps<"/demo/[slug]/nha-trai/khach-moi">) {
  return <DemoRender slugPromise={params} kind="nha-trai" guest={demoGuests["nha-trai"]} />;
}
