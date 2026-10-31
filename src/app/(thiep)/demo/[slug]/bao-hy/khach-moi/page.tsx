import type { Metadata } from "next";
import { DemoRender, demoMetadata } from "@/components/themes/demo-render";
import { demoGuests } from "@/themes/_demo/content";
import { themeSlugs } from "@/themes/registry";

export function generateStaticParams() {
  return themeSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: PageProps<"/demo/[slug]/bao-hy/khach-moi">): Promise<Metadata> {
  return demoMetadata(params, "bao-hy", "có khách mời");
}

export default function Page({ params }: PageProps<"/demo/[slug]/bao-hy/khach-moi">) {
  return <DemoRender slugPromise={params} kind="bao-hy" guest={demoGuests["bao-hy"]} />;
}
