import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { FeatureJsonLd } from "@/components/feature-pages/feature-page";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { FinalCta } from "@/components/home/final-cta";
import { SectionHeading } from "@/components/home/section-heading";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { RelatedLinks } from "@/components/seo/related-links";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getFaqGroup } from "@/data/faq";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";
import { cn } from "@/lib/utils";

const PATH = "/bang-gia";
const seo = getSeoPage(PATH);

export const metadata = pageMetadata(PATH);

interface Plan {
  name: string;
  price: string;
  priceNote: string;
  summary: string;
  benefits: string[];
  /** `href: null` = not available yet (rendered as a disabled button, not a link). */
  cta: { href: string | null; label: string };
  highlight: boolean;
}

// Benefits follow docs/01-PRD.md. No paid price and no paid photo count: both are not final yet.
// Premium has no CTA link: there is no payment and no official support channel before launch.
const plans: Plan[] = [
  {
    name: "Miễn phí",
    price: "0đ",
    priceNote: "Dùng thử thoải mái, không cần thẻ",
    summary: "Đủ để có một tấm thiệp đẹp và mời những người thân thiết nhất.",
    benefits: [
      "Trang cưới chung để gửi nhóm, đăng mạng xã hội",
      "Tối đa 30 lời mời riêng có tên khách",
      "Khách xác nhận tham dự, quản lý khách nhà trai, nhà gái",
      "QR mừng cưới, ngày âm lịch",
      "Album 12 ảnh",
      "Dòng chữ nhỏ “Tạo bởi Hẹn Ước” ở cuối thiệp",
    ],
    cta: { href: "/tao-thiep", label: "Tạo thiệp miễn phí" },
    highlight: false,
  },
  {
    name: "Cao cấp",
    price: "Sắp công bố",
    priceNote: "Trả một lần cho mỗi đám cưới · không thuê bao",
    summary: "Cho đám cưới đông khách, muốn thiệp gọn gàng và nhiều lựa chọn hơn.",
    benefits: [
      "Mọi thứ trong gói Miễn phí",
      "Không giới hạn lời mời riêng",
      "Bỏ dòng chữ “Tạo bởi Hẹn Ước”",
      "Thêm các mẫu thiệp cao cấp",
      "Album nhiều ảnh hơn",
    ],
    cta: { href: null, label: "Sắp mở" },
    highlight: true,
  },
];

type Cell = boolean | string;

const comparison: { label: string; free: Cell; premium: Cell }[] = [
  { label: "Trang cưới chung", free: true, premium: true },
  { label: "Lời mời riêng có tên khách", free: "30 lời mời", premium: "Không giới hạn" },
  { label: "Khách xác nhận tham dự (RSVP)", free: true, premium: true },
  { label: "Quản lý khách nhà trai, nhà gái", free: true, premium: true },
  { label: "Lễ vu quy, thành hôn, ngày âm lịch", free: true, premium: true },
  { label: "QR mừng cưới", free: true, premium: true },
  { label: "Mẫu thiệp", free: "Mẫu miễn phí", premium: "Thêm mẫu cao cấp" },
  { label: "Album ảnh", free: "12 ảnh", premium: "Nhiều ảnh hơn" },
  { label: "Dòng chữ “Tạo bởi Hẹn Ước”", free: "Có, nhỏ ở cuối thiệp", premium: false },
  { label: "Cách trả", free: "Không mất phí", premium: "Một lần / đám cưới" },
];

function CellValue({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <>
        <Check aria-hidden className="mx-auto size-5 text-success" strokeWidth={2} />
        <span className="sr-only">Có</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus aria-hidden className="mx-auto size-5 text-muted" strokeWidth={2} />
        <span className="sr-only">Không</span>
      </>
    );
  }
  return <span>{value}</span>;
}

const paymentFaq = getFaqGroup("thanh-toan");

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
            Bắt đầu miễn phí, xem thiệp đẹp rồi mới quyết định. Khi cần mời nhiều khách hơn, gói Cao
            cấp chỉ trả một lần cho đám cưới của hai bạn, không có phí hằng tháng.
          </p>
        </header>

        <h2 className="sr-only">Các gói</h2>
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <li
              key={plan.name}
              className={cn(
                "flex flex-col rounded-(--radius-card) border bg-surface p-6 shadow-(--shadow-card) md:p-8",
                plan.highlight ? "border-rose-500" : "border-border",
              )}
            >
              <h3 className="text-xl font-bold text-ink">{plan.name}</h3>
              <p className="mt-1 text-muted">{plan.summary}</p>
              <p className="mt-6 font-display text-3xl font-extrabold tracking-[-0.03em] text-ink">
                {plan.price}
              </p>
              <p className="mt-1 text-sm font-medium text-rose-700">{plan.priceNote}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-ink">
                    <Check
                      aria-hidden
                      className="mt-0.5 size-5 shrink-0 text-rose-600"
                      strokeWidth={2}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {plan.cta.href ? (
                <Link
                  href={plan.cta.href}
                  className={buttonVariants({ size: "lg", className: "mt-8 w-full" })}
                >
                  {plan.cta.label} <ArrowRight aria-hidden />
                </Link>
              ) : (
                <>
                  {/* Not a link on purpose: nothing to buy and no support channel before launch. */}
                  <span
                    className={buttonVariants({
                      size: "lg",
                      variant: "secondary",
                      className:
                        "mt-8 w-full cursor-not-allowed text-muted hover:border-border hover:text-muted",
                    })}
                  >
                    {plan.cta.label}
                  </span>
                  <p className="mt-3 text-center text-sm text-muted">
                    Gói Cao cấp mở khi ra mắt, hiện bạn dùng miễn phí đầy đủ để thử.
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted">
          Quyền lợi có thể điều chỉnh trước khi ra mắt. Hẹn Ước chưa có thanh toán online; kênh hỗ
          trợ chính thức sẽ được công bố tại trang{" "}
          <Link href="/lien-he" className="font-medium text-rose-700 hover:underline">
            Liên hệ
          </Link>{" "}
          khi ra mắt.
        </p>
      </Container>

      <section className="bg-surface py-20 md:py-28">
        <Container width="prose">
          <SectionHeading title="So sánh hai gói" />
          <div className="mt-10 overflow-x-auto rounded-(--radius-card) border border-border">
            <table className="w-full table-fixed border-collapse text-left text-sm md:text-base">
              <caption className="sr-only">So sánh quyền lợi gói Miễn phí và gói Cao cấp</caption>
              <thead className="bg-rose-50 text-ink">
                <tr>
                  <th scope="col" className="w-[42%] p-3 font-semibold md:p-4">
                    Quyền lợi
                  </th>
                  <th scope="col" className="p-3 text-center font-semibold md:p-4">
                    Miễn phí
                  </th>
                  <th scope="col" className="p-3 text-center font-semibold md:p-4">
                    Cao cấp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-canvas">
                {comparison.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="p-3 font-medium text-ink md:p-4">
                      {row.label}
                    </th>
                    <td className="p-3 text-center text-muted md:p-4">
                      <CellValue value={row.free} />
                    </td>
                    <td className="p-3 text-center text-muted md:p-4">
                      <CellValue value={row.premium} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">Quyền lợi có thể điều chỉnh trước khi ra mắt.</p>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container width="prose">
          <SectionHeading title="Câu hỏi về thanh toán" />
          <FaqAccordion items={paymentFaq.items} className="mt-10" />
          <p className="mt-6">
            <Link
              href="/cau-hoi-thuong-gap"
              className="inline-flex items-center gap-1.5 font-semibold text-rose-700 hover:text-rose-600"
            >
              Xem tất cả câu hỏi thường gặp <ArrowRight aria-hidden className="size-4" />
            </Link>
          </p>
        </Container>
      </section>

      <FinalCta />

      <RelatedLinks path={PATH} />

      <FeatureJsonLd path={PATH} />
    </>
  );
}
