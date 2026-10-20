import "server-only"; // file "use client" nào import file này (kể cả gián tiếp) → build báo lỗi ngay
import { z } from "zod";

// Biến BÍ MẬT: chỉ tồn tại trên server, không bao giờ xuống trình duyệt.
const schema = z.object({
  DATABASE_URL: z.string().min(1).optional(), // T-003 sẽ bỏ .optional()
  DIRECT_URL: z.string().min(1).optional(),
});

const result = schema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
});

if (!result.success) {
  const lines = result.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`);
  throw new Error(`Biến môi trường (server) không hợp lệ:\n${lines.join("\n")}`);
}

export const serverEnv = result.data;
