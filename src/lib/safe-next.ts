const ORIGIN = "https://henuoc.local"; // chỉ dùng làm gốc để parse, không bao giờ lộ ra ngoài

/**
 * Trả về đường dẫn nội bộ an toàn để chuyển tới sau đăng nhập, hoặc `fallback`.
 * Chỉ nhận đường dẫn tương đối bắt đầu bằng 1 dấu "/" và nằm trong vùng cho phép.
 */
export function safeNext(
  raw: string | null | undefined,
  { fallback = "/dashboard", allowPrefix = "/dashboard" } = {},
): string {
  if (!raw) return fallback;
  // "//evil.com" và "/\evil.com": trình duyệt hiểu là "sang domain evil.com"
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  // ký tự điều khiển (xuống dòng, tab…) dùng để lừa bộ parse
  if (/[\u0000-\u001f\u007f]/.test(raw)) return fallback;

  let url: URL;
  try {
    url = new URL(raw, ORIGIN);
  } catch {
    return fallback;
  }
  // Sau khi parse mà ra domain khác (vd "/%2F%2Fevil.com" bị giải mã) → từ chối
  if (url.origin !== ORIGIN) return fallback;
  // Chỉ cho quay về vùng dashboard, không cho trỏ lung tung trong site
  if (url.pathname !== allowPrefix && !url.pathname.startsWith(`${allowPrefix}/`)) return fallback;

  return url.pathname + url.search;
}
