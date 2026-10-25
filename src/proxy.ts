import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// Chạy TRƯỚC mọi request khớp matcher. Chỉ xem có cookie phiên hay không, không hỏi DB → rẻ.
// Đây là lớp tiện lợi, KHÔNG phải lớp an toàn: cookie giả vẫn qua được, lớp 2 mới bắt.
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/dang-nhap", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
