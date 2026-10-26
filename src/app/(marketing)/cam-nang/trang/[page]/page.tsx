import { notFound } from "next/navigation";
import { ArticleList } from "@/components/articles/article-list";
import { ArticleCollectionJsonLd } from "@/components/articles/article-collection-json-ld";
import { ArticleCta } from "@/components/articles/article-meta";
import { ArticlePagination } from "@/components/articles/article-pagination";
import { TopicLinks } from "@/components/articles/topic-links";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { RelatedLinks } from "@/components/seo/related-links";
import { Container } from "@/components/ui/container";
import { articlesOnPage, articlesPagePath, pageCount } from "@/data/article-topics";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

type Props = { params: Promise<{ page: string }> };

// Trang 2..N (trang 1 là /cam-nang). Param lạ bị proxy.ts chặn thành 404 trước khi tới đây.
export function generateStaticParams() {
  return Array.from({ length: pageCount() - 1 }, (_, i) => ({ page: String(i + 2) }));
}

function resolvePage(value: string) {
  const n = Number(value);
  if (!Number.isInteger(n) || String(n) !== value || n < 2 || n > pageCount()) notFound();
  return n;
}

export async function generateMetadata({ params }: Props) {
  const n = resolvePage((await params).page);
  const path = articlesPagePath(n);
  return pageMetadata(path);
}

export default async function Page({ params }: Props) {
  const n = resolvePage((await params).page);
  const path = articlesPagePath(n);
  const seo = getSeoPage(path);
  const items = articlesOnPage(n);

  return (
    <>
      <Container className="pt-8 pb-20 md:pt-10 md:pb-28">
        <Breadcrumb path={path} />
        <header className="mt-8 max-w-3xl">
          <h1 className="font-display text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
            {seo.h1}
          </h1>
          <p className="mt-5 text-lg text-muted">
            Các bài cẩm nang cưới tiếp theo, xếp từ mới đến cũ. Cần tìm theo nội dung? Chọn một chủ
            đề bên dưới.
          </p>
        </header>
        <TopicLinks />
        <ArticleList items={items} />
        <ArticlePagination currentPage={n} />
        <ArticleCta className="mt-16 max-w-3xl" />
      </Container>
      <RelatedLinks path={path} />
      <ArticleCollectionJsonLd path={path} items={items} />
    </>
  );
}
