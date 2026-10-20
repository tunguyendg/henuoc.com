import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MiniInvitation, miniStyles, type MiniStyle } from "./mini-invitation";
import { SectionHeading } from "./section-heading";

const order: MiniStyle[] = ["pastel", "songhy", "bantin", "sage", "hanquoc", "vintage"];

export function FeaturedThemes() {
  return (
    <section id="mau-thiep" className="py-20 md:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Mẫu thiệp" title="Một mẫu cho mỗi câu chuyện">
            Mỗi mẫu có bố cục, màu sắc và hiệu ứng riêng — đổi mẫu bất cứ lúc nào mà không mất thông
            tin đã nhập.
          </SectionHeading>
          <Link
            href="/mau-thiep-cuoi"
            className="inline-flex items-center gap-1.5 font-semibold text-rose-600 hover:text-rose-700"
          >
            Xem tất cả mẫu <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-6">
          {order.map((key) => (
            <li key={key}>
              <Link href="/mau-thiep-cuoi" className="group block">
                <div className="aspect-[3/4] overflow-hidden rounded-(--radius-card) border border-border shadow-(--shadow-card) transition-transform duration-300 group-hover:-translate-y-1">
                  <MiniInvitation style={key} />
                </div>
                <p className="mt-3 font-semibold text-ink">{miniStyles[key].label}</p>
                <p className="text-sm text-muted">{miniStyles[key].category}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted">
          Ảnh minh hoạ phong cách. Bộ sưu tập mẫu thiệp đang được hoàn thiện.
        </p>
      </Container>
    </section>
  );
}
