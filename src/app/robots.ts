import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { allowIndexing } from "@/lib/seo/metadata";

/**
 * /robots.txt
 * - Trước launch: chặn toàn bộ.
 * - Sau launch: cho phép tất cả, chỉ chặn khu app/API. KHÔNG chặn /thiepcuoi/ — các trang đó
 *   tự gắn noindex, Google phải vào được mới đọc được noindex (docs/08-SEO.md §3).
 */
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/admin", "/ui"] }],
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
