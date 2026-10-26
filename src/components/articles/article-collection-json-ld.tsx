import { JsonLd } from "@/components/seo/json-ld";
import { articlePath, type Article } from "@/data/articles";
import { site } from "@/lib/site";
import { getSeoPage } from "@/lib/seo/pages";

export function ArticleCollectionJsonLd({ path, items }: { path: string; items: Article[] }) {
  const seo = getSeoPage(path);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: seo.h1,
        description: seo.description,
        url: new URL(path, site.url).toString(),
        inLanguage: "vi-VN",
        mainEntity: {
          "@type": "ItemList",
          itemListElement: items.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: a.h1,
            url: new URL(articlePath(a.slug), site.url).toString(),
          })),
        },
      }}
    />
  );
}
