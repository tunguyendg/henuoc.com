import type { Metadata } from "next";
import { site } from "@/lib/site";
import { getSeoPage } from "./pages";

/**
 * Chỉ cho Google index khi đã launch (NEXT_PUBLIC_ALLOW_INDEXING=true lúc build).
 * Trước launch: mọi trang noindex, robots.txt chặn hết → tránh Google lưu bản dở dang.
 */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

/** Metadata cho 1 trang, lấy từ sổ SEO. Dùng: `export const metadata = pageMetadata("/bang-gia")`. */
export function pageMetadata(path: string): Metadata {
  const p = getSeoPage(path);
  const indexable = allowIndexing && p.index;
  return {
    title: { absolute: p.title }, // absolute: không ghép thêm "· Hẹn Ước" lần nữa
    description: p.description,
    alternates: { canonical: p.path },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: site.name,
      url: p.path,
      title: p.title,
      description: p.description,
    },
  };
}
