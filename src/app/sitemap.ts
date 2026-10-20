import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { allowIndexing } from "@/lib/seo/metadata";
import { seoPages } from "@/lib/seo/pages";

/** /sitemap.xml — chỉ gồm trang có `index: true` trong sổ SEO. Trước launch: rỗng. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!allowIndexing) return [];
  return seoPages
    .filter((p) => p.index)
    .map((p) => ({
      url: new URL(p.path, site.url).toString(),
      changeFrequency: "weekly",
      priority: p.priority ?? 0.5,
    }));
}
