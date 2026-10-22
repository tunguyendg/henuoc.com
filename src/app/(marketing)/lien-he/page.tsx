import Link from "next/link";
import { ArrowRight, Mail, ShieldAlert } from "lucide-react";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedLinks } from "@/components/seo/related-links";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { dataDeletionVerification, site, supportMailto } from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

const PATH = "/lien-he";
const seo = getSeoPage(PATH);

export const metadata = pageMetadata(PATH);

// Email is the only official channel (decided by Tony). No response-time promise, no phone, no address.
const topics: { title: string; text: string; subject: string; note?: string }[] = [
  {
    title: "Hỗ trợ tạo thiệp",
    text: "Gặp khó khi điền thông tin, chọn mẫu, tải ảnh hay gửi lời mời cho khách.",
    subject: "Hỗ trợ tạo thiệp",
  },
  {
    title: "Nâng cấp gói Cao cấp",
    text: "Muốn được báo giá và hướng dẫn nâng cấp khi gói Cao cấp mở.",
    subject: "Nâng cấp gói Cao cấp",
  },
  {
    title: "Yêu cầu xoá dữ liệu",
    text: "Muốn xoá tài khoản, dữ liệu đám cưới, hoặc là khách mời muốn gỡ thông tin của mình.",
    subject: "Yêu cầu xoá dữ liệu",
    note: dataDeletionVerification,
  },
  {
    title: "Hợp tác",
    text: "Studio ảnh cưới, nhà hàng tiệc cưới, wedding planner hoặc đơn vị muốn làm việc cùng Hẹn Ước.",
    subject: "Hợp tác với Hẹn Ước",
  },
];

const emailTips = [
  "Bạn cần giúp việc gì, càng cụ thể càng dễ hỗ trợ.",
  "Link trang cưới hoặc thiệp của hai bạn, nếu đã tạo.",
  "Email bạn dùng để đăng nhập Hẹn Ước, nếu có tài khoản.",
  "Ảnh chụp màn hình chỗ bị lỗi, nếu có.",
];

export default function Page() {
  return (
    <>
      <Container width="prose" className="pt-8 pb-20 md:pt-10 md:pb-28">
        <Breadcrumb path={PATH} />

        <header className="mt-8">
          <h1 className="font-display text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
            {seo.h1}
          </h1>
          <p className="mt-5 text-lg text-muted">
            Kênh liên hệ chính thức của {site.name} là email. Hai bạn cứ viết cho chúng mình, chúng
            mình sẽ phản hồi sớm nhất có thể.
          </p>
        </header>

        <section
          aria-labelledby="email-title"
          className="mt-10 rounded-(--radius-card) border border-rose-100 bg-rose-50 p-6 md:p-8"
        >
          <h2 id="email-title" className="text-sm font-semibold text-rose-700">
            Email hỗ trợ
          </h2>
          {/* Plain selectable text so people can copy it into any mail app. */}
          <p className="mt-2 font-display text-2xl font-extrabold tracking-[-0.02em] break-all text-ink select-all md:text-3xl">
            {site.supportEmail}
          </p>
          <a
            href={supportMailto()}
            className={buttonVariants({ size: "lg", className: "mt-6 w-full sm:w-auto" })}
          >
            <Mail aria-hidden /> Gửi email cho Hẹn Ước
          </a>
        </section>

        <section aria-labelledby="topics-title" className="mt-14">
          <h2
            id="topics-title"
            className="font-display text-2xl font-extrabold tracking-[-0.03em] text-ink md:text-3xl"
          >
            Khi nào nên gửi email
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {topics.map((t) => (
              <li
                key={t.title}
                className="flex flex-col rounded-(--radius-card) border border-border bg-surface p-5 shadow-(--shadow-card)"
              >
                <h3 className="font-semibold text-ink">{t.title}</h3>
                <p className="mt-2 text-muted">{t.text}</p>
                {t.note ? <p className="mt-2 text-sm text-muted">{t.note}</p> : null}
                <span aria-hidden className="flex-1" />
                <a
                  href={supportMailto(t.subject)}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:text-rose-600"
                >
                  Gửi email về việc này <ArrowRight aria-hidden className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="tips-title" className="mt-14">
          <h2
            id="tips-title"
            className="font-display text-2xl font-extrabold tracking-[-0.03em] text-ink md:text-3xl"
          >
            Nên ghi gì trong email
          </h2>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-ink marker:text-rose-500">
            {emailTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <div
            role="note"
            className="mt-6 flex gap-3 rounded-(--radius-card) border border-gold-400 bg-gold-100 p-4 text-ink"
          >
            <ShieldAlert aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
            <p>
              <strong className="font-semibold">
                Đừng gửi mật khẩu, mã đăng nhập hay liên kết đăng nhập.
              </strong>{" "}
              {site.name} không bao giờ cần những thông tin này để hỗ trợ bạn.
            </p>
          </div>
        </section>

        <p className="mt-14 text-muted">
          Nhiều câu hỏi về chi phí, cách gửi thiệp và dữ liệu khách mời đã có lời giải tại{" "}
          <Link
            href="/cau-hoi-thuong-gap"
            className="font-semibold text-rose-700 underline-offset-4 hover:underline"
          >
            Câu hỏi thường gặp
          </Link>
          .
        </p>

        <div className="mt-10">
          <Link href="/tao-thiep" className={buttonVariants({ size: "lg" })}>
            Tạo thiệp miễn phí <ArrowRight aria-hidden />
          </Link>
        </div>
      </Container>

      <RelatedLinks path={PATH} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: seo.h1,
          description: seo.description,
          url: new URL(PATH, site.url).toString(),
          inLanguage: "vi-VN",
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          about: {
            "@type": "Organization",
            name: site.name,
            url: site.url,
            email: site.supportEmail,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: site.supportEmail,
              availableLanguage: ["vi"],
            },
          },
        }}
      />
    </>
  );
}
