import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featureCatalog } from "@/data/features";
import { FinalCta } from "@/components/home/final-cta";
import { VietnamFeatures } from "@/components/home/vietnam-features";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedLinks } from "@/components/seo/related-links";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

const PATH = "/tinh-nang";
const seo = getSeoPage(PATH);

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
            Hẹn Ước không chỉ là một tấm thiệp đẹp. Hai bạn gửi cho từng khách một lời mời đúng tên,
            biết ai sẽ đến, quản lý khách hai bên gọn trong một chỗ và có sẵn danh sách việc cần làm
            đến ngày cưới.
          </p>
        </header>

        <h2 className="sr-only">Các tính năng chính</h2>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {featureCatalog.map(({ path, icon: Icon, title, text }) => (
            <li key={path}>
              <Link
                href={path}
                className="group flex h-full flex-col rounded-(--radius-card) border border-border bg-surface p-6 shadow-(--shadow-card) transition-colors hover:border-rose-500 md:p-8"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <Icon aria-hidden className="size-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 flex-1 text-muted">{text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700">
                  Xem chi tiết
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <VietnamFeatures />

      <div className="pt-20 md:pt-28">
        <FinalCta />
      </div>

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
            itemListElement: featureCatalog.map((f, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: getSeoPage(f.path).h1,
              url: new URL(f.path, site.url).toString(),
            })),
          },
        }}
      />
    </>
  );
}
