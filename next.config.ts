import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build ra .next/standalone/server.js — chạy được trên Passenger (AZDIGI) mà không cần `npm install` trên host.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  // Không chạy sharp trên shared hosting: ảnh được tối ưu sẵn (WebP) trước khi đưa lên public/ hoặc R2.
  images: { unoptimized: true },
  poweredByHeader: false,
  // Đăng nhập và đăng ký là một luồng (Google / email OTP tự tạo tài khoản) → giữ một URL duy nhất.
  async redirects() {
    return [
      { source: "/dang-ky", destination: "/dang-nhap", permanent: true },
      { source: "/cam-nang/trang/1", destination: "/cam-nang", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// No remark/rehype plugins on purpose: Turbopack only accepts serializable plugin options, and
// every extra plugin is a new dependency. Article metadata lives in src/data/articles.ts.
// .mdx is only imported from src/content/ (not used as routes), so pageExtensions stays default.
const withMDX = createMDX();

export default withMDX(nextConfig);
