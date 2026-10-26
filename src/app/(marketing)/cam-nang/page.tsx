import { ArticleCollectionJsonLd } from "@/components/articles/article-collection-json-ld";
import { ArticleList } from "@/components/articles/article-list";
import { ArticleCta } from "@/components/articles/article-meta";
import { ArticlePagination } from "@/components/articles/article-pagination";
import { TopicLinks } from "@/components/articles/topic-links";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { RelatedLinks } from "@/components/seo/related-links";
import { Container } from "@/components/ui/container";
import { articlesOnPage } from "@/data/article-topics";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

const PATH = "/cam-nang";
const seo = getSeoPage(PATH);

const list = articlesOnPage(1);

export const metadata = pageMetadata(PATH);

export default async function Page() {
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

        <TopicLinks />
        <ArticleList items={list} />
        <ArticlePagination currentPage={1} />

        <ArticleCta className="mt-16 max-w-3xl" />
      </Container>

      <RelatedLinks path={PATH} />

      <ArticleCollectionJsonLd path={PATH} items={list} />
    </>
  );
}
