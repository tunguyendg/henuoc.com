import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build ra .next/standalone/server.js — chạy được trên Passenger (AZDIGI) mà không cần `npm install` trên host.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  // Không chạy sharp trên shared hosting: ảnh được tối ưu sẵn (WebP) trước khi đưa lên public/ hoặc R2.
  images: { unoptimized: true },
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
