import Link from "next/link";
import { articlesPagePath, pageCount } from "@/data/article-topics";

export function ArticlePagination({ currentPage }: { currentPage: number }) {
  const total = pageCount();
  const linkClass =
    "rounded-lg border border-border px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50";
  return (
    <nav aria-label="Phân trang" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link className={linkClass} href={articlesPagePath(currentPage - 1)}>
          Trang trước
        </Link>
      )}
      {Array.from({ length: total }, (_, i) => i + 1).map((n) =>
        n === currentPage ? (
          <span
            key={n}
            aria-current="page"
            className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white"
          >
            {n}
          </span>
        ) : (
          <Link key={n} className={linkClass} href={articlesPagePath(n)}>
            {n}
          </Link>
        ),
      )}
      {currentPage < total && (
        <Link className={linkClass} href={articlesPagePath(currentPage + 1)}>
          Trang sau
        </Link>
      )}
    </nav>
  );
}
