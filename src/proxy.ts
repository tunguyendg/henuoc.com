import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { articleListPaths } from "@/data/article-topics";
import { visibleThemes } from "@/data/themes";

const ARTICLE_LIST_PATHS = articleListPaths();
const VISIBLE_THEME_PATHS = new Set(visibleThemes.map((t) => `/mau-thiep-cuoi/${t.slug}`));

// Luồng tạo thiệp chỉ mở khi dashboard mở (cùng điều kiện guard dashboard). Gỡ ở P6.
const CREATE_FLOW_ENABLED = process.env.NODE_ENV !== "production";
// Chỉ nhận slug dạng "blush-rose". Còn mẫu có live hay không thì createWedding kiểm lại trên server.
const SLUG_RE = /^[a-z0-9-]{1,40}$/;

/** Chuyển sang /dang-nhap kèm ?next= để đăng nhập xong quay lại đúng chỗ (safeNext kiểm ở form). */
function toLogin(request: NextRequest, next: string) {
  const login = new URL("/dang-nhap", request.url);
  login.searchParams.set("next", next);
  return NextResponse.redirect(login);
}

// Chạy TRƯỚC mọi request khớp matcher. Chỉ xem có cookie phiên hay không, không hỏi DB → rẻ.
// Đây là lớp tiện lợi, KHÔNG phải lớp an toàn: cookie giả vẫn qua được, lớp 2 mới bắt.
export function proxy(request: NextRequest) {
  const { pathname, searchParams, search } = request.nextUrl;

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

  if (pathname === "/tao-thiep") {
    if (!CREATE_FLOW_ENABLED) return NextResponse.next(); // production: giữ trang "Đang xây dựng"
    const dest = new URL("/dashboard/bat-dau", request.url);
    const mau = searchParams.get("mau");
    if (mau && SLUG_RE.test(mau)) dest.searchParams.set("mau", mau);
    if (getSessionCookie(request)) return NextResponse.redirect(dest);
    return toLogin(request, dest.pathname + dest.search);
  }

  // /dashboard/*: chưa có cookie → đăng nhập, xong quay lại đúng trang đang mở
  if (!getSessionCookie(request)) return toLogin(request, pathname + search);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tao-thiep",
    "/cam-nang/trang/:path*",
    "/cam-nang/chu-de/:path*",
    "/mau-thiep-cuoi/:slug",
  ],
};
