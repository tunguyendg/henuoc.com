import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
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
    // giữ trang đang mở trong ?next= để đăng nhập xong quay lại đúng chỗ
    expect(res.headers.get("location")).toBe(
      "https://henuoc.com/dang-nhap?next=%2Fdashboard%2Fkhach-moi",
    );
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

  it("chỉ chạy cho /dashboard và danh sách cẩm nang", () => {
    expect(config.matcher).toEqual([
      "/dashboard/:path*",
      "/tao-thiep",
      "/cam-nang/trang/:path*",
      "/cam-nang/chu-de/:path*",
      "/mau-thiep-cuoi/:slug",
    ]);
  });
});

describe("proxy: danh sách cẩm nang lạ → 404 thật", () => {
  const at = (path: string) => proxy(new NextRequest(`https://henuoc.com${path}`));

  it.each(["/cam-nang/trang/2", "/cam-nang/chu-de/phong-tuc"])("%s hợp lệ → đi tiếp", (path) => {
    expect(at(path).headers.get("x-middleware-next")).toBe("1");
  });

  it.each([
    "/cam-nang/trang/99",
    "/cam-nang/trang/02",
    "/cam-nang/trang/abc",
    "/cam-nang/chu-de/xyz",
    "/cam-nang/chu-de/phong-tuc/x",
  ])("%s → rewrite sang path không có route", (path) => {
    // x-middleware-rewrite là header NỘI BỘ của NextResponse.rewrite()
    expect(at(path).headers.get("x-middleware-rewrite")).toBe("https://henuoc.com/_khong-ton-tai");
  });

  it("không cookie vẫn xem được cẩm nang (không bị đẩy về /dang-nhap)", () => {
    expect(at("/cam-nang/trang/2").status).not.toBe(307);
  });
});

describe("proxy: mẫu thiệp chưa hiện công khai → 404 thật", () => {
  const at = (path: string) => proxy(new NextRequest(`https://henuoc.com${path}`));

  it("mẫu preview → đi tiếp", () => {
    expect(at("/mau-thiep-cuoi/song-hy-do-son").headers.get("x-middleware-next")).toBe("1");
  });

  it.each(["/mau-thiep-cuoi/royal-gold", "/mau-thiep-cuoi/khong-co-mau-nay"])(
    "%s (planned / lạ) → rewrite sang path không có route",
    (path) => {
      expect(at(path).headers.get("x-middleware-rewrite")).toBe(
        "https://henuoc.com/_khong-ton-tai",
      );
    },
  );

  it("không cookie vẫn xem được mẫu visible", () => {
    expect(at("/mau-thiep-cuoi/song-hy-do-son").status).not.toBe(307);
  });
});

describe("proxy: luồng /tao-thiep", () => {
  const COOKIE = "better-auth.session_token=gia";
  const ORIGIN = "https://henuoc.com";

  afterEach(() => vi.unstubAllEnvs());

  // CREATE_FLOW_ENABLED tính lúc nạp module → phải nạp lại proxy sau khi đổi NODE_ENV
  async function load(env: "development" | "production") {
    vi.stubEnv("NODE_ENV", env);
    vi.resetModules();
    return (await import("./proxy")).proxy;
  }

  function at(mau: string | null, cookie?: string) {
    const qs = mau === null ? "" : `?${new URLSearchParams({ mau })}`;
    return new NextRequest(`${ORIGIN}/tao-thiep${qs}`, {
      headers: cookie ? { cookie } : {},
    });
  }

  it("dev, chưa đăng nhập → về /dang-nhap, next giữ lại mẫu đã chọn", async () => {
    const proxy = await load("development");
    const res = proxy(at("blush-rose"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      `${ORIGIN}/dang-nhap?next=%2Fdashboard%2Fbat-dau%3Fmau%3Dblush-rose`,
    );
  });

  it("dev, đã đăng nhập → thẳng /dashboard/bat-dau kèm mẫu", async () => {
    const proxy = await load("development");
    const res = proxy(at("blush-rose", COOKIE));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(`${ORIGIN}/dashboard/bat-dau?mau=blush-rose`);
  });

  it.each(["../x", "A B", "a".repeat(41)])("dev, đã đăng nhập, mẫu lạ %j → bỏ mau", async (mau) => {
    const proxy = await load("development");
    const res = proxy(at(mau, COOKIE));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(`${ORIGIN}/dashboard/bat-dau`);
  });

  it("dev, đã đăng nhập, không có mau → /dashboard/bat-dau", async () => {
    const proxy = await load("development");
    expect(proxy(at(null, COOKIE)).headers.get("location")).toBe(`${ORIGIN}/dashboard/bat-dau`);
  });

  it("dev, chưa đăng nhập, mẫu lạ → next chỉ còn /dashboard/bat-dau", async () => {
    const proxy = await load("development");
    expect(proxy(at("../x")).headers.get("location")).toBe(
      `${ORIGIN}/dang-nhap?next=%2Fdashboard%2Fbat-dau`,
    );
  });

  it.each([undefined, COOKIE])(
    "production (cookie=%s) → đi tiếp, giữ trang Đang xây dựng",
    async (cookie) => {
      const proxy = await load("production");
      const res = proxy(at("blush-rose", cookie));
      expect(res.headers.get("x-middleware-next")).toBe("1");
      expect(res.headers.get("location")).toBeNull();
    },
  );
});
