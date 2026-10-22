import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FinalCta } from "@/components/home/final-cta";
import { Photo } from "@/components/home/photo";
import { SectionHeading } from "@/components/home/section-heading";
import { SupportEmailLink } from "@/components/site/support-email-link";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedLinks } from "@/components/seo/related-links";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

const PATH = "/gioi-thieu";
const seo = getSeoPage(PATH);

export const metadata = pageMetadata(PATH);

// Content follows docs/00-PROJECT_CONTEXT.md and docs/01-PRD.md. No team, founding year or user counts.
const pains = [
  {
    title: "Thiệp giấy đắt và tốn công",
    text: "In thiệp, ghi tên từng tấm rồi đi đưa tận tay mất rất nhiều thời gian, nhất là khi khách ở xa.",
  },
  {
    title: "Thiệp ảnh không biết ai sẽ đến",
    text: "Gửi một tấm ảnh vào nhóm Zalo thì nhanh, nhưng không biết ai đã nhận, ai sẽ đến, đặt bao nhiêu bàn là vừa.",
  },
  {
    title: "Danh sách khách rối giữa hai nhà",
    text: "Khách nhà trai, nhà gái, bạn bè, đồng nghiệp nằm rải rác trong nhiều file và nhiều cuộc trò chuyện.",
  },
];

const values = [
  {
    title: "Đúng xưng hô, đúng lễ nghi",
    text: "Lễ vu quy, thành hôn, tân hôn; nhà trai, nhà gái; ngày âm lịch bên cạnh ngày dương; danh xưng như “Kính mời Anh Minh & Gia đình”. Thiệp đủ trang trọng để bố mẹ yên tâm gửi.",
  },
  {
    title: "Mỗi khách một lời mời mang tên mình",
    text: "Mỗi khách nhận một link riêng, chỉ thấy những buổi lễ mình được mời. Hai bạn sao chép tin nhắn có sẵn link và gửi qua Zalo.",
  },
  {
    title: "Khách mở là xem, bấm là xác nhận",
    text: "Khách không cần cài ứng dụng hay đăng nhập. Người lớn tuổi cũng xem được giờ, địa điểm, chỉ đường và bấm xác nhận tham dự.",
  },
  {
    title: "Mọi thứ đến ngày cưới gọn một chỗ",
    text: "Danh sách khách hai bên, ai sẽ đến, ước tính số bàn và danh sách việc cần làm theo từng mốc trước ngày cưới.",
  },
];

const principles = [
  "Không đưa số liệu hay đánh giá không có thật lên trang.",
  "Không quảng cáo, không link mua sắm trên thiệp gửi khách.",
  "Thiệp riêng của từng khách không xuất hiện trên Google.",
  "Miễn phí để bắt đầu; gói trả phí là trả một lần, không thuê bao.",
];

export default function Page() {
  return (
    <>
      <Container className="pt-8 pb-20 md:pt-10 md:pb-28">
        <Breadcrumb path={PATH} />

        <div className="mt-8 grid items-center gap-12 md:grid-cols-2">
          <header>
            <h1 className="font-display text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
              {seo.h1}
            </h1>
            <p className="mt-5 text-lg text-ink">
              {site.name} giúp cặp đôi Việt tạo thiệp cưới online đẹp trong vài phút, gửi lời mời
              mang tên từng khách qua Zalo và quản lý khách mời, xác nhận tham dự gọn trong một chỗ.
            </p>
            <p className="mt-4 text-lg text-muted">
              Cái tên “Hẹn Ước” đến từ chiếc nhẫn cưới: một lời hẹn ước giữa hai người, và cũng là
              lời mời gửi tới những người thân yêu cùng chung vui.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/tao-thiep" className={buttonVariants({ size: "lg" })}>
                Tạo thiệp miễn phí <ArrowRight aria-hidden />
              </Link>
              <Link
                href="/mau-thiep-cuoi"
                className={buttonVariants({ size: "lg", variant: "secondary" })}
              >
                Xem mẫu thiệp
              </Link>
            </div>
          </header>
          <Photo
            src="/images/wedding/landing-2.jpg"
            alt="Cô dâu đội voan tựa vào chú rể, tay cầm bó hoa cưới"
            sizes="(min-width: 1152px) 524px, (min-width: 768px) 50vw, 100vw"
            className="aspect-4/5 rounded-[2rem]"
            position="45% center"
            priority
          />
        </div>
      </Container>

      <section className="bg-surface py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="Vì sao có Hẹn Ước" title="Mời cưới không nên là việc mệt">
            Chuẩn bị đám cưới đã đủ bận. Ba chuyện dưới đây là lý do chúng mình làm Hẹn Ước.
          </SectionHeading>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {pains.map((p) => (
              <li
                key={p.title}
                className="rounded-(--radius-card) border border-border bg-canvas p-6"
              >
                <h3 className="font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="Hẹn Ước làm gì" title="Thiệp cưới online cho người Việt" />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <li
                key={v.title}
                className="rounded-(--radius-card) border border-border bg-surface p-6 shadow-(--shadow-card) md:p-8"
              >
                <h3 className="text-lg font-bold text-ink">{v.title}</h3>
                <p className="mt-2 text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link
              href="/tinh-nang"
              className="inline-flex items-center gap-1.5 font-semibold text-rose-700 hover:text-rose-600"
            >
              Xem các tính năng <ArrowRight aria-hidden className="size-4" />
            </Link>
          </p>
        </Container>
      </section>

      <section className="bg-rose-50 py-20 md:py-28">
        <Container width="prose">
          <SectionHeading title="Điều chúng mình giữ" />
          <ul className="mt-8 space-y-3">
            {principles.map((p) => (
              <li key={p} className="flex gap-3 text-ink">
                <span
                  aria-hidden
                  className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-rose-600"
                >
                  ✓
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-muted">
            Muốn góp ý hay cần hỗ trợ? Gửi email tới <SupportEmailLink className="font-semibold" />{" "}
            hoặc xem trang{" "}
            <Link href="/lien-he" className="font-semibold text-rose-700 hover:underline">
              Liên hệ
            </Link>
            .
          </p>
        </Container>
      </section>

      <div className="pt-20 md:pt-28">
        <FinalCta />
      </div>

      <RelatedLinks path={PATH} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: seo.h1,
          description: seo.description,
          url: new URL(PATH, site.url).toString(),
          inLanguage: "vi-VN",
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          about: {
            "@type": "Organization",
            name: site.name,
            url: site.url,
            logo: `${site.url}/brand/icon-512.png`,
          },
        }}
      />
    </>
  );
}
