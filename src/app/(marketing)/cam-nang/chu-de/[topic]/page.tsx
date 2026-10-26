import { notFound } from "next/navigation";
import { ArticleList } from "@/components/articles/article-list";
import { ArticleCollectionJsonLd } from "@/components/articles/article-collection-json-ld";
import { ArticleCta } from "@/components/articles/article-meta";
import { TopicLinks } from "@/components/articles/topic-links";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { RelatedLinks } from "@/components/seo/related-links";
import { Container } from "@/components/ui/container";
import { articleTopics, articlesInTopic, getTopic, topicPath } from "@/data/article-topics";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

type Props = { params: Promise<{ topic: string }> };

// Build sẵn 1 trang cho mỗi chủ đề. Slug lạ bị proxy.ts chặn thành 404.
export function generateStaticParams() {
  return articleTopics.map((topic) => ({ topic: topic.slug }));
}

function resolveTopic(slug: string) {
  const topic = getTopic(slug);
  if (!topic) notFound();
  return topic;
}

export async function generateMetadata({ params }: Props) {
  const topic = resolveTopic((await params).topic);
  const path = topicPath(topic.slug);
  return pageMetadata(path);
}

export default async function Page({ params }: Props) {
  const topic = resolveTopic((await params).topic);
  const path = topicPath(topic.slug);
  const seo = getSeoPage(path);
  const items = articlesInTopic(topic.slug);

  return (
    <>
      <Container className="pt-8 pb-20 md:pt-10 md:pb-28">
        <Breadcrumb path={path} />
        <header className="mt-8 max-w-3xl">
          <h1 className="font-display text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
            {seo.h1}
          </h1>
          <p className="mt-5 text-lg text-muted">{topic.intro}</p>
        </header>
        <ArticleList items={items} />
        <TopicLinks exclude={topic.slug} />
        <ArticleCta className="mt-16 max-w-3xl" />
      </Container>
      <RelatedLinks path={path} />
      <ArticleCollectionJsonLd path={path} items={items} />
    </>
  );
}
