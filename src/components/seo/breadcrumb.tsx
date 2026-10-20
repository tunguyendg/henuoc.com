import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { site } from "@/lib/site";
import { breadcrumbTrail } from "@/lib/seo/pages";
import { JsonLd } from "./json-ld";

/** Breadcrumb hiện trên trang + JSON-LD BreadcrumbList, dựng tự động từ `parent` trong sổ SEO. */
export function Breadcrumb({ path }: { path: string }) {
  const trail = breadcrumbTrail(path);
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {trail.map((p, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={p.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="font-medium text-ink">
                    {p.breadcrumb}
                  </span>
                ) : (
                  <>
                    <Link href={p.path} className="hover:text-rose-700">
                      {p.breadcrumb}
                    </Link>
                    <ChevronRight aria-hidden className="size-3.5" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.breadcrumb,
            item: new URL(p.path, site.url).toString(),
          })),
        }}
      />
    </>
  );
}
