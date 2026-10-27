import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { articleListPaths } from "@/data/article-topics";
import { visibleThemes } from "@/data/themes";

const ARTICLE_LIST_PATHS = articleListPaths();
const VISIBLE_THEME_PATHS = new Set(visibleThemes.map((t) => `/mau-thiep-cuoi/${t.slug}`));

// Chạy TRƯỚC mọi request khớp matcher. Chỉ xem có cookie phiên hay không, không hỏi DB → rẻ.
// Đây là lớp tiện lợi, KHÔNG phải lớp an toàn: cookie giả vẫn qua được, lớp 2 mới bắt.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/cam-nang/")) {
    // Cache Components stream trang trước khi notFound() kịp đổi status → param lạ ra 200.
    // Rewrite sang path không có route để Next trả 404 thật; path hợp lệ đi tiếp (vẫn static).
    if (ARTICLE_LIST_PATHS.has(pathname)) return NextResponse.next();
    return NextResponse.rewrite(new URL("/_khong-ton-tai", request.url));
  }

  if (pathname.startsWith("/mau-thiep-cuoi/")) {
    // Mẫu planned / slug lạ → 404 thật (cùng lý do với cẩm nang ở trên).
    if (VISIBLE_THEME_PATHS.has(pathname)) return NextResponse.next();
    return NextResponse.rewrite(new URL("/_khong-ton-tai", request.url));
  }

  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/dang-nhap", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cam-nang/trang/:path*",
    "/cam-nang/chu-de/:path*",
    "/mau-thiep-cuoi/:slug",
  ],
};
