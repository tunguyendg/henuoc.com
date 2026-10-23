import { notFound } from "next/navigation";
import { ArticleCta, ArticleDate } from "@/components/articles/article-meta";
import { ArticleImage, createArticleImage } from "@/components/articles/article-image";
import { getArticleImages } from "@/lib/article-images";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedLinks } from "@/components/seo/related-links";
import { Container } from "@/components/ui/container";
import { articlePath, articles } from "@/data/articles";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

type Props = { params: Promise<{ slug: string }> };

function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!getArticle(slug)) return {};
  return pageMetadata(articlePath(slug));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const images = (await getArticleImages()).filter((image) => image.slug === article.slug);
  const cover = images[0];

  // Only slugs from articles.ts reach this import, so the path is never user-controlled.
  const { default: Body } = await import(`@/content/cam-nang/${article.slug}.mdx`);

  const path = articlePath(article.slug);
  const seo = getSeoPage(path);
  const url = new URL(path, site.url).toString();
  const modified = article.updatedAt ?? article.publishedAt;
  const org = { "@type": "Organization", name: site.name, url: site.url };

  return (
    <>
      <Container className="pt-8 pb-20 md:pt-10 md:pb-28">
        <Breadcrumb path={path} />

        <article className="mt-8 max-w-[70ch]">
          <header>
            <h1 className="font-display text-4xl leading-[1.1] font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
              {seo.h1}
            </h1>
            <p className="mt-4 text-sm text-muted">
              Đăng ngày <ArticleDate iso={article.publishedAt} />
              {article.updatedAt && (
                <>
                  {" · "}Cập nhật <ArticleDate iso={article.updatedAt} />
                </>
              )}
            </p>
          </header>
          {cover && <ArticleImage image={cover} />}

          <div className="mt-8 text-[17px] text-ink [&>:first-child]:mt-0">
            {/* `ArticleCta` is passed in so the .mdx body can place <ArticleCta /> mid-article without imports. */}
            <Body components={{ ArticleCta, ArticleImage: createArticleImage(images) }} />
          </div>

          <ArticleCta
            className="mt-14"
            title="Làm thiệp cho hai bạn ngay hôm nay"
            text="Miễn phí để bắt đầu. Hai bạn có thể sửa lời mời, tên khách và thông tin lễ cưới bất cứ lúc nào."
          />
        </article>
      </Container>

      <RelatedLinks path={path} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: seo.h1,
          description: seo.description,
          datePublished: article.publishedAt,
          dateModified: modified,
          author: org,
          publisher: org,
          url,
          inLanguage: "vi-VN",
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
        }}
      />
    </>
  );
}
