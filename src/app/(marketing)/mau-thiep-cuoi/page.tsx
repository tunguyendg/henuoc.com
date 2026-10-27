import { Breadcrumb } from "@/components/seo/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedLinks } from "@/components/seo/related-links";
import { StyleChips } from "@/components/themes/style-chips";
import { ThemeGrid } from "@/components/themes/theme-card";
import { Container } from "@/components/ui/container";
import { visibleThemes } from "@/data/themes";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage, themePath } from "@/lib/seo/pages";

const PATH = "/mau-thiep-cuoi";
const seo = getSeoPage(PATH);

export const metadata = pageMetadata(PATH);

export default function Page() {
  return (
    <>
      <Container className="pt-8 pb-20 md:pt-10">
        <Breadcrumb path={PATH} />

        <header className="mt-8 max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
            {seo.h1}
          </h1>
          <p className="mt-5 text-lg text-muted">
            Chọn một mẫu thiệp cưới, xem thử ngay với tên hai bạn rồi gửi cho từng khách qua Zalo.
            Đổi mẫu bất cứ lúc nào — thông tin đã nhập vẫn giữ nguyên.
          </p>
        </header>

        <nav aria-label="Phong cách thiệp cưới" className="mt-8">
          <StyleChips />
        </nav>

        <h2 className="sr-only">Tất cả mẫu thiệp</h2>
        <div className="mt-10">
          <ThemeGrid items={visibleThemes} />
        </div>

        <p className="mt-8 text-sm text-muted">
          Đây là thiệp minh hoạ phong cách. Mẫu thiệp hoàn chỉnh đang được hoàn thiện.
        </p>
      </Container>

      <RelatedLinks path={PATH} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: seo.h1,
          description: seo.description,
          url: new URL(PATH, site.url).toString(),
          mainEntity: {
            "@type": "ItemList",
            itemListElement: visibleThemes.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.name,
              url: new URL(themePath(t.slug), site.url).toString(),
            })),
          },
        }}
      />
    </>
  );
}
