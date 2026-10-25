import "server-only"; // file "use client" nào import file này (kể cả gián tiếp) → build báo lỗi ngay
import { z } from "zod";

// Biến BÍ MẬT: chỉ tồn tại trên server, không bao giờ xuống trình duyệt.
const schema = z.object({
  DATABASE_URL: z.string().startsWith("postgres"),
  DIRECT_URL: z.string().min(1).optional(),
  // Đăng nhập (T-032)
  BETTER_AUTH_SECRET: z.string().min(32), // khoá ký phiên — ngắn quá là dễ bị đoán
  BETTER_AUTH_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().startsWith("re_"),
});

const result = schema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
});

if (!result.success) {
  const lines = result.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`);
  throw new Error(`Biến môi trường (server) không hợp lệ:\n${lines.join("\n")}`);
}

export const serverEnv = result.data;
