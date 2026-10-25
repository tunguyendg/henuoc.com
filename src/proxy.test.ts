import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { config, proxy } from "./proxy";

// proxy chỉ xem CÓ cookie hay không (không hỏi DB) → token giả là đủ để đi qua.
function request(cookie?: string) {
  return new NextRequest("https://henuoc.com/dashboard/khach-moi", {
    headers: cookie ? { cookie } : {},
  });
}

describe("proxy (lớp 1: chỉ kiểm có cookie phiên)", () => {
  it("không cookie → 307 về /dang-nhap", () => {
    const res = proxy(request());
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://henuoc.com/dang-nhap");
  });

  it("cookie khác tên → vẫn 307", () => {
    expect(proxy(request("theme=dark; other_token=abc")).status).toBe(307);
  });

  it.each(["better-auth.session_token=gia", "__Secure-better-auth.session_token=gia"])(
    "có cookie %s → cho đi tiếp",
    (cookie) => {
      const res = proxy(request(cookie));
      // x-middleware-next là header NỘI BỘ của NextResponse.next() — đổi bản Next mà test vỡ thì xem lại đây
      expect(res.headers.get("x-middleware-next")).toBe("1");
      expect(res.headers.get("location")).toBeNull();
    },
  );

  it("chỉ chạy cho /dashboard", () => {
    expect(config.matcher).toEqual(["/dashboard/:path*"]);
  });
});
