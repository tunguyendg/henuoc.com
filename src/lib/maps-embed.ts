// URL nhúng Google Maps Embed (iframe) cho thiệp.
// CHỈ truyền tên địa điểm + địa chỉ của sự kiện. KHÔNG BAO GIỜ truyền dữ liệu khách hay token.
// Iframe phía theme PHẢI đặt referrerPolicy="strict-origin-when-cross-origin" để Google chỉ thấy
// origin (URL thiệp có token khách không lọt sang Google), vẫn đủ cho giới hạn HTTP referrer của key.

const MAX_QUERY_LENGTH = 200;

export function mapEmbedUrl(query: string, apiKey: string | undefined): string | undefined {
  if (!apiKey) return undefined;
  const q = query.replace(/\s+/g, " ").trim().slice(0, MAX_QUERY_LENGTH).trim();
  if (q === "") return undefined;
  const url = new URL("https://www.google.com/maps/embed/v1/place");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", q);
  url.searchParams.set("language", "vi");
  url.searchParams.set("region", "VN");
  return url.href;
}
