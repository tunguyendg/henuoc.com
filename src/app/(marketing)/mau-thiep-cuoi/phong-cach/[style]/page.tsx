import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { RelatedLinks } from "@/components/seo/related-links";
import { StyleChips } from "@/components/themes/style-chips";
import { ThemeGrid } from "@/components/themes/theme-card";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getStyle, themeStyles, themesByStyle } from "@/data/themes";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage, stylePath } from "@/lib/seo/pages";

type Props = { params: Promise<{ style: string }> };

// Build sẵn 1 trang HTML cho mỗi phong cách. Slug lạ → 404.
export function generateStaticParams() {
  return themeStyles.map((s) => ({ style: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { style } = await params;
  if (!getStyle(style)) return {};
  return pageMetadata(stylePath(style));
}

export default async function Page({ params }: Props) {
  const { style: slug } = await params;
  const style = getStyle(slug);
  if (!style) notFound();

  const path = stylePath(slug);
  const seo = getSeoPage(path);
  const items = themesByStyle(slug);

  return (
    <>
      <Container className="pt-8 pb-20 md:pt-10">
        <Breadcrumb path={path} />

        <header className="mt-8 max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
            {seo.h1}
          </h1>
          <p className="mt-5 text-lg text-muted">{style.intro}</p>
        </header>

        <nav aria-label="Phong cách thiệp cưới" className="mt-8">
          <StyleChips active={slug} />
        </nav>

        <h2 className="sr-only">Các mẫu {style.keyword}</h2>
        <div className="mt-10">
          {items.length > 0 ? (
            <ThemeGrid items={items} />
          ) : (
            <div className="rounded-(--radius-card) border border-dashed border-border bg-surface p-10 text-center">
              <p className="font-semibold text-ink">Mẫu {style.keyword} đang được thiết kế.</p>
              <p className="mt-2 text-muted">Trong lúc chờ, hai bạn xem các mẫu khác nhé.</p>
              <Link
                href="/mau-thiep-cuoi"
                className={buttonVariants({ variant: "secondary", className: "mt-6" })}
              >
                Xem tất cả mẫu
              </Link>
            </div>
          )}
        </div>

        {style.faq.length > 0 && (
          <section aria-labelledby="faq-heading" className="mt-16 max-w-3xl">
            <h2
              id="faq-heading"
              className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink"
            >
              Câu hỏi thường gặp
            </h2>
            <div className="mt-6 divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
              {style.faq.map((f) => (
                <details key={f.q} className="group px-5">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden className="text-rose-600 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-4 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </Container>

      <RelatedLinks path={path} />
    </>
  );
}
