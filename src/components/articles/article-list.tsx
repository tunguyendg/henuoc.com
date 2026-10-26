import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleDate } from "@/components/articles/article-meta";
import { ArticleImage } from "@/components/articles/article-image";
import { getArticleCover } from "@/lib/article-images";
import { articlePath, type Article } from "@/data/articles";

export function ArticleList({ items }: { items: Article[] }) {
  return (
    <ul className="mt-12 grid gap-5 md:grid-cols-2">
      {items.map((a) => {
        const href = articlePath(a.slug);
        const cover = getArticleCover(a.slug);
        return (
          <li key={a.slug}>
            <article className="group relative flex h-full flex-col rounded-(--radius-card) border border-border bg-surface p-6 shadow-(--shadow-card) transition-colors hover:border-rose-500 md:p-8">
              <ArticleImage image={cover} card className="mt-0 mb-5" />
              <ArticleDate iso={a.publishedAt} className="text-sm text-muted" />
              <h2 className="mt-3 text-xl leading-snug font-bold text-ink">
                {/* Stretched link: the whole card is clickable, but only the title is the link text. */}
                <Link href={href} className="after:absolute after:inset-0">
                  {a.h1}
                </Link>
              </h2>
              <p className="mt-3 flex-1 text-muted">{a.description}</p>
              <span
                aria-hidden
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700"
              >
                Đọc bài
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
