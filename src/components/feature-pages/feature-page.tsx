import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { FeatureList, SectionHeading } from "@/components/home/section-heading";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";
import { getSeoPage } from "@/lib/seo/pages";
import { cn } from "@/lib/utils";

/** Hero of a feature page. The only <h1> on the page comes from the SEO registry. */
export function FeatureHero({
  path,
  eyebrow,
  lead,
  highlights,
  visual,
}: {
  path: string;
  eyebrow: string;
  lead: string;
  highlights: string[];
  visual: ReactNode;
}) {
  const seo = getSeoPage(path);
  return (
    <section className="overflow-hidden pt-8 pb-20 md:pt-10 md:pb-28">
      <Container>
        <Breadcrumb path={path} />
        <div className="mt-10 grid items-center gap-14 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-rose-700 uppercase">{eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
              {seo.h1}
            </h1>
            <p className="mt-5 text-lg text-muted">{lead}</p>
            <FeatureList items={highlights} />
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
          </div>
          <div className="flex justify-center">{visual}</div>
        </div>
      </Container>
    </section>
  );
}

export interface Step {
  title: string;
  text: string;
}

const stepCols: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-3",
};

/** "How it works" block: numbered cards, H2 for the section, H3 for each step. */
export function FeatureSteps({
  title,
  intro,
  steps,
}: {
  title: string;
  intro?: string;
  steps: Step[];
}) {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Hoạt động thế nào" title={title}>
          {intro}
        </SectionHeading>
        <ol className={cn("mt-12 grid gap-5 sm:grid-cols-2", stepCols[steps.length])}>
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-(--radius-card) border border-border bg-canvas p-6"
            >
              <span
                aria-hidden
                className="flex size-10 items-center justify-center rounded-full bg-rose-600 font-semibold text-white"
              >
                {i + 1}
              </span>
              <h3 className="mt-5 font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export interface FaqItem {
  q: string;
  a: string;
}

/** Short plain-text FAQ (no FAQPage schema on feature pages). */
export function FeatureFaq({ items }: { items: FaqItem[] }) {
  return (
    <section className="py-20 md:py-28">
      <Container width="prose">
        <SectionHeading title="Câu hỏi thường gặp" />
        <div className="mt-10 divide-y divide-border border-y border-border">
          {items.map((f) => (
            <div key={f.q} className="py-6">
              <h3 className="font-semibold text-ink">{f.q}</h3>
              <p className="mt-2 text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** schema.org WebPage for a feature sub-page, built from the SEO registry. */
export function FeatureJsonLd({ path }: { path: string }) {
  const seo = getSeoPage(path);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: seo.h1,
        description: seo.description,
        url: new URL(path, site.url).toString(),
        inLanguage: "vi-VN",
        isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
      }}
    />
  );
}
