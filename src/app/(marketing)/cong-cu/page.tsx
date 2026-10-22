import Link from "next/link";
import { ArrowRight, ListChecks, MessageSquareHeart, type LucideIcon } from "lucide-react";
import { FinalCta } from "@/components/home/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedLinks } from "@/components/seo/related-links";
import { ToolHero } from "@/components/tools/tool-hero";
import { Container } from "@/components/ui/container";
import { checklistItems } from "@/data/checklist";
import { invitationStyles } from "@/data/invitation-templates";
import { site } from "@/lib/site";
import { getSeoPage } from "@/lib/seo/pages";
import { pageMetadata } from "@/lib/seo/metadata";

const PATH = "/cong-cu";

export const metadata = pageMetadata(PATH);

const tools: { path: string; icon: LucideIcon; text: string }[] = [
  {
    path: "/cong-cu/checklist-dam-cuoi",
    icon: ListChecks,
    text: `${checklistItems.length} việc chuẩn bị cưới, tự tính hạn theo ngày cưới. Tick việc đã xong, lưu trên máy, in ra giấy.`,
  },
  {
    path: "/cong-cu/mau-loi-moi-dam-cuoi",
    icon: MessageSquareHeart,
    text: `${invitationStyles.length} kiểu lời mời: trang trọng, thân mật, đồng nghiệp, tin nhắn Zalo, mời kèm link thiệp. Điền tên khách rồi sao chép.`,
  },
];

export default function Page() {
  const seo = getSeoPage(PATH);
  return (
    <>
      <section className="pt-8 pb-16 md:pt-10 md:pb-24">
        <Container>
          <ToolHero path={PATH} eyebrow="Miễn phí, không cần đăng nhập">
            <p>
              Vài công cụ nhỏ giúp hai bạn chuẩn bị đám cưới nhẹ nhàng hơn. Mở trên điện thoại là
              dùng được ngay, không cần tạo tài khoản.
            </p>
          </ToolHero>
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {tools.map(({ path, icon: Icon, text }) => {
              const tool = getSeoPage(path);
              return (
                <li key={path}>
                  <Link
                    href={path}
                    className="group flex h-full flex-col rounded-(--radius-card) border border-border bg-surface p-6 shadow-(--shadow-card) transition-colors hover:border-rose-500"
                  >
                    <span
                      aria-hidden
                      className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"
                    >
                      <Icon className="size-6" strokeWidth={1.75} />
                    </span>
                    <h2 className="mt-5 text-xl font-bold text-ink">{tool.h1}</h2>
                    <p className="mt-2 flex-1 text-muted">{text}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-rose-700">
                      Dùng ngay
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
      <FinalCta />
      <RelatedLinks path={PATH} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: seo.h1,
          description: seo.description,
          url: new URL(PATH, site.url).toString(),
          inLanguage: "vi-VN",
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          hasPart: tools.map(({ path }) => ({
            "@type": "WebPage",
            name: getSeoPage(path).h1,
            url: new URL(path, site.url).toString(),
          })),
        }}
      />
    </>
  );
}
