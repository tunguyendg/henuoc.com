import Image from "next/image";
import Link from "next/link";
import { MiniInvitation } from "@/components/home/mini-invitation";
import { getStyle, type Theme } from "@/data/themes";
import { getThemeThumbnail } from "@/components/themes/theme-thumbnails";
import { themePath } from "@/lib/seo/pages";

/** Thẻ 1 mẫu thiệp → link sang trang chi tiết. Dùng ở trang chủ, gallery, trang phong cách. */
export function ThemeCard({
  theme,
  headingLevel = "h3",
}: {
  theme: Theme;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const thumbnail = getThemeThumbnail(theme);
  return (
    <Link href={themePath(theme.slug)} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-(--radius-card) border border-border shadow-(--shadow-card) transition-transform duration-300 group-hover:-translate-y-1">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={`Thiệp mẫu ${theme.name}: ảnh chụp bìa thiệp`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <MiniInvitation style={theme.preview} />
        )}
        {theme.tier === "premium" && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-ink/85 px-2 py-0.5 text-[11px] font-semibold text-gold-400">
            Cao cấp
          </span>
        )}
      </div>
      <Heading className="mt-3 font-semibold text-ink group-hover:text-rose-700">
        {theme.name}
      </Heading>
      <p className="text-sm text-muted">{getStyle(theme.styles[0] ?? "")?.name}</p>
    </Link>
  );
}

export function ThemeGrid({ items, headingLevel }: { items: Theme[]; headingLevel?: "h2" | "h3" }) {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {items.map((t) => (
        <li key={t.slug}>
          <ThemeCard theme={t} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
