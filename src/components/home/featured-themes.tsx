import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ThemeCard } from "@/components/themes/theme-card";
import { themes } from "@/data/themes";
import { SectionHeading } from "./section-heading";

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
          {themes.map((t) => (
            <li key={t.slug}>
              <ThemeCard theme={t} />
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
