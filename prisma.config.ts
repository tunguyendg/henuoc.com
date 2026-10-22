import { defineConfig } from "prisma/config";

// Prisma CLI không tự đọc .env.local → dùng hàm có sẵn của Node 22 (không cần thư viện dotenv)
try {
  process.loadEnvFile(".env.local");
} catch {
  // CI / production: biến đã có sẵn trong môi trường, không có file → bỏ qua
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // CLI (migrate) dùng kết nối THẲNG cổng 5432
  datasource: { url: process.env.DIRECT_URL },
});
