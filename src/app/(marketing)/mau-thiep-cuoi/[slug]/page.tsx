import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MiniInvitation } from "@/components/home/mini-invitation";
import { PhoneFrame } from "@/components/home/phone-frame";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedLinks } from "@/components/seo/related-links";
import { StyleChips } from "@/components/themes/style-chips";
import { ThemeGrid } from "@/components/themes/theme-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getVisibleTheme, similarThemes, visibleThemes } from "@/data/themes";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage, themePath } from "@/lib/seo/pages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return visibleThemes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!getVisibleTheme(slug)) return {};
  return pageMetadata(themePath(slug));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const theme = getVisibleTheme(slug);
  if (!theme) notFound();

  const path = themePath(slug);
  const seo = getSeoPage(path);
  const createHref = `/tao-thiep?mau=${theme.slug}`;

  return (
    <>
      <Container className="pt-8 pb-20 md:pt-10">
        <Breadcrumb path={path} />

        <div className="mt-8 grid items-start gap-12 md:grid-cols-[auto_1fr] md:gap-16">
          <div className="mx-auto md:sticky md:top-24">
            <PhoneFrame>
              <MiniInvitation style={theme.preview} />
            </PhoneFrame>
          </div>

          <div className="max-w-xl">
            <p className="text-xs font-bold tracking-[0.16em] text-rose-700 uppercase">
              {theme.tier === "premium" ? "Mẫu cao cấp" : "Mẫu miễn phí"}
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
              {seo.h1}
            </h1>
            <p className="mt-5 text-lg text-muted">{theme.description}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {theme.status === "live" ? (
                <Link href={createHref} className={buttonVariants({ size: "lg" })}>
                  Dùng mẫu này <ArrowRight aria-hidden />
                </Link>
              ) : (
                <Button size="lg" disabled>
                  Sắp ra mắt
                </Button>
              )}
              <Link
                href="/mau-thiep-cuoi"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Xem mẫu khác
              </Link>
            </div>

            <h2 className="mt-12 text-lg font-bold text-ink">Mẫu này có gì</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {theme.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-ink">
                  <Check aria-hidden className="size-4 text-rose-600" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-lg font-bold text-ink">Bảng màu</h2>
            <ul className="mt-4 flex gap-3">
              {theme.palette.map((c) => (
                <li key={c}>
                  <span
                    className="block size-10 rounded-full border border-border"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-lg font-bold text-ink">Phong cách</h2>
            <div className="mt-4">
              <StyleChips only={theme.styles} />
            </div>

            <p className="mt-10 rounded-xl bg-rose-50 p-4 text-sm text-ink">
              {theme.status === "live"
                ? "Đây là thiệp minh hoạ. Bản hoàn chỉnh có hiệu ứng mở thiệp, nhạc nền và đầy đủ các mục như trên."
                : "Mẫu này đang được hoàn thiện nên chưa dùng được. Đây là bản minh hoạ để hai bạn hình dung phong cách."}
            </p>
          </div>
        </div>
      </Container>

      <section aria-labelledby="mau-tuong-tu" className="bg-surface py-16">
        <Container>
          <h2 id="mau-tuong-tu" className="font-display text-2xl font-extrabold text-ink">
            Mẫu thiệp tương tự
          </h2>
          <div className="mt-8">
            <ThemeGrid items={similarThemes(theme)} />
          </div>
        </Container>
      </section>

      <RelatedLinks path={path} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemPage",
          name: seo.h1,
          description: seo.description,
          url: new URL(path, site.url).toString(),
        }}
      />
    </>
  );
}
