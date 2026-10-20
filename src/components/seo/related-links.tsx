import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getSeoPage } from "@/lib/seo/pages";

/** Khối "Xem thêm" = link nội bộ, lấy từ `related` trong sổ SEO. */
export function RelatedLinks({ path, title = "Xem thêm" }: { path: string; title?: string }) {
  const links = getSeoPage(path).related.map(getSeoPage);
  if (links.length === 0) return null;
  return (
    <section aria-labelledby="xem-them" className="border-t border-border bg-surface py-14">
      <Container>
        <h2 id="xem-them" className="text-lg font-bold text-ink">
          {title}
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <li key={l.path}>
              <Link
                href={l.path}
                className="group flex h-full items-center justify-between gap-4 rounded-(--radius-card) border border-border bg-canvas p-5 transition-colors hover:border-rose-500"
              >
                <span>
                  <span className="block font-semibold text-ink">{l.h1}</span>
                  <span className="mt-1 line-clamp-2 block text-sm text-muted">
                    {l.description}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="size-5 shrink-0 text-rose-600 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
