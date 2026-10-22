import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { getSeoPage } from "@/lib/seo/pages";

/** Page intro for tool pages: breadcrumb, eyebrow, the single <h1> from the SEO registry, lead. */
export function ToolHero({
  path,
  eyebrow,
  children,
}: {
  path: string;
  eyebrow: string;
  children: ReactNode;
}) {
  const seo = getSeoPage(path);
  return (
    <>
      <div className="print:hidden">
        <Breadcrumb path={path} />
      </div>
      <p className="mt-8 text-xs font-bold tracking-[0.16em] text-rose-700 uppercase print:hidden">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-[2rem] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink sm:text-4xl md:text-5xl print:text-2xl">
        {seo.h1}
      </h1>
      <div className="mt-5 max-w-2xl text-lg text-muted print:hidden">{children}</div>
    </>
  );
}
