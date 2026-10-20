import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Container } from "@/components/ui/container";
import { homeFaqs } from "@/data/faq";
import { SectionHeading } from "./section-heading";

/**
 * Short FAQ teaser on the home page. Full list + FAQPage JSON-LD live on /cau-hoi-thuong-gap
 * (only one page on the site carries FAQPage schema).
 */
export function Faq() {
  return (
    <section className="py-20 md:py-28">
      <Container width="prose">
        <SectionHeading
          align="center"
          eyebrow="Câu hỏi thường gặp"
          title="Hai bạn có thể đang thắc mắc"
        />
        <FaqAccordion items={homeFaqs} className="mt-12" />
        <p className="mt-8 text-center">
          <Link
            href="/cau-hoi-thuong-gap"
            className="inline-flex items-center gap-1.5 font-semibold text-rose-700 hover:text-rose-600"
          >
            Xem tất cả câu hỏi <ArrowRight aria-hidden className="size-4" />
          </Link>
        </p>
      </Container>
    </section>
  );
}
