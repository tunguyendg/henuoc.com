import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { FinalCta } from "@/components/home/final-cta";
import { SupportEmailLink } from "@/components/site/support-email-link";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedLinks } from "@/components/seo/related-links";
import { Container } from "@/components/ui/container";
import { allFaqs, faqGroups } from "@/data/faq";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

const PATH = "/cau-hoi-thuong-gap";
const seo = getSeoPage(PATH);

export const metadata = pageMetadata(PATH);

export default function Page() {
  return (
    <>
      <Container width="prose" className="pt-8 pb-20 md:pt-10 md:pb-28">
        <Breadcrumb path={PATH} />

        <header className="mt-8">
          <h1 className="font-display text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
            {seo.h1}
          </h1>
          <p className="mt-5 text-lg text-muted">
            Những điều hai bạn hay hỏi trước khi tạo thiệp: chi phí, cách gửi thiệp qua Zalo, khách
            xác nhận tham dự ra sao và dữ liệu khách mời được giữ thế nào.
          </p>
        </header>

        <nav aria-label="Chủ đề" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {faqGroups.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="inline-flex h-10 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-rose-500 hover:text-rose-700"
                >
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {faqGroups.map((g) => (
          <section
            key={g.id}
            id={g.id}
            aria-labelledby={`${g.id}-title`}
            className="mt-14 scroll-mt-24"
          >
            <h2
              id={`${g.id}-title`}
              className="font-display text-2xl font-extrabold tracking-[-0.03em] text-ink md:text-3xl"
            >
              {g.title}
            </h2>
            <FaqAccordion items={g.items} className="mt-6" />
            {g.link ? (
              <p className="mt-4">
                <Link
                  href={g.link.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:text-rose-600"
                >
                  {g.link.label} <ArrowRight aria-hidden className="size-4" />
                </Link>
              </p>
            ) : null}
          </section>
        ))}

        <p className="mt-14 rounded-(--radius-card) bg-rose-50 p-6 text-ink">
          Chưa thấy câu trả lời bạn cần? Gửi email tới{" "}
          <SupportEmailLink className="font-semibold" /> hoặc xem trang{" "}
          <Link
            href="/lien-he"
            className="font-semibold text-rose-700 underline-offset-4 hover:underline"
          >
            Liên hệ
          </Link>
          .
        </p>
      </Container>

      <FinalCta />

      <RelatedLinks path={PATH} />

      {/* The only FAQPage schema on the site — answers come from src/data/faq.ts. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          name: seo.h1,
          url: new URL(PATH, site.url).toString(),
          inLanguage: "vi-VN",
          mainEntity: allFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </>
  );
}
