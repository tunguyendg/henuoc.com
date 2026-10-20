import Link from "next/link";
import type { ReactNode } from "react";
import { FileWarning } from "lucide-react";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedLinks } from "@/components/seo/related-links";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";
import { getSeoPage } from "@/lib/seo/pages";

/** Fixed date: change only when the text actually changes. */
export const LEGAL_UPDATED_AT = "2026-10-20";

function formatViDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** Layout for legal documents (draft): readable ~70ch column, draft banner, last-updated date. */
export function LegalPage({
  path,
  intro,
  children,
}: {
  path: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  const seo = getSeoPage(path);
  return (
    <>
      <Container className="pt-8 pb-20 md:pt-10 md:pb-28">
        <Breadcrumb path={path} />

        <article className="mt-8 max-w-[70ch]">
          <header>
            <h1 className="font-display text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
              {seo.h1}
            </h1>
            <p className="mt-4 text-sm text-muted">
              Cập nhật lần cuối:{" "}
              <time dateTime={LEGAL_UPDATED_AT}>{formatViDate(LEGAL_UPDATED_AT)}</time>
            </p>
            <div
              role="note"
              className="mt-6 flex gap-3 rounded-(--radius-card) border border-gold-400 bg-gold-100 p-4 text-ink"
            >
              <FileWarning aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
              <p>
                <strong className="font-semibold">Bản dự thảo.</strong> Bản chính thức sẽ được công
                bố trước khi Hẹn Ước ra mắt và trước khi mở gói trả phí.
              </p>
            </div>
            <div className="mt-8 text-lg text-muted">{intro}</div>
          </header>

          <div className="mt-10 space-y-10 leading-[1.7] text-ink">{children}</div>

          <div className="mt-14 flex flex-wrap gap-3 border-t border-border pt-8">
            <Link href="/tao-thiep" className={buttonVariants()}>
              Tạo thiệp miễn phí
            </Link>
            <Link href="/cau-hoi-thuong-gap" className={buttonVariants({ variant: "secondary" })}>
              Câu hỏi thường gặp
            </Link>
          </div>
        </article>
      </Container>

      <RelatedLinks path={path} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: seo.h1,
          description: seo.description,
          url: new URL(path, site.url).toString(),
          inLanguage: "vi-VN",
          dateModified: LEGAL_UPDATED_AT,
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
        }}
      />
    </>
  );
}

/** One numbered section of a legal document (H2 + body). */
export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-ink md:text-2xl">{title}</h2>
      {children}
    </section>
  );
}

/** Bullet list styled for long-form legal text. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6 marker:text-rose-500">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/** Inline link inside legal text. */
export function LegalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-medium text-rose-700 underline underline-offset-4 hover:text-rose-600"
    >
      {children}
    </Link>
  );
}
