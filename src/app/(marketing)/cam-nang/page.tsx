import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCta, ArticleDate } from "@/components/articles/article-meta";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedLinks } from "@/components/seo/related-links";
import { Container } from "@/components/ui/container";
import { articlePath, articles } from "@/data/articles";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

const PATH = "/cam-nang";
const seo = getSeoPage(PATH);

// Newest first; ISO dates compare correctly as strings.
const list = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const metadata = pageMetadata(PATH);

export default function Page() {
  return (
    <>
      <Container className="pt-8 pb-20 md:pt-10 md:pb-28">
        <Breadcrumb path={PATH} />

        <header className="mt-8 max-w-3xl">
          <h1 className="font-display text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
            {seo.h1}
          </h1>
          <p className="mt-5 text-lg text-muted">
            Những điều hai bạn hay băn khoăn khi chuẩn bị đám cưới: ghi thiệp sao cho đúng vai vế,
            viết lời mời thế nào để người nhận thấy được trân trọng. Viết ngắn gọn, có ví dụ để dùng
            ngay.
          </p>
        </header>

        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {list.map((a) => {
            const href = articlePath(a.slug);
            return (
              <li key={a.slug}>
                <article className="group relative flex h-full flex-col rounded-(--radius-card) border border-border bg-surface p-6 shadow-(--shadow-card) transition-colors hover:border-rose-500 md:p-8">
                  <ArticleDate iso={a.publishedAt} className="text-sm text-muted" />
                  <h2 className="mt-3 text-xl leading-snug font-bold text-ink">
                    {/* Stretched link: the whole card is clickable, but only the title is the link text. */}
                    <Link href={href} className="after:absolute after:inset-0">
                      {a.h1}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-muted">{a.description}</p>
                  <span
                    aria-hidden
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700"
                  >
                    Đọc bài
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </article>
              </li>
            );
          })}
        </ul>

        <ArticleCta className="mt-16 max-w-3xl" />
      </Container>

      <RelatedLinks path={PATH} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: seo.h1,
          description: seo.description,
          url: new URL(PATH, site.url).toString(),
          inLanguage: "vi-VN",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: list.map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: a.h1,
              url: new URL(articlePath(a.slug), site.url).toString(),
            })),
          },
        }}
      />
    </>
  );
}
