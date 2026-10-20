import { z } from "zod";

// Luật cho từng biến
const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_ALLOW_INDEXING: z
    .enum(["true", "false", ""])
    .optional()
    .transform((v) => v === "true"),
  DATABASE_URL: z.string().min(1).optional(), // T-003 mới bắt buộc
});

// Viết tay từng biến: Next chỉ thay được dạng process.env.TEN_BIEN
const result = schema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ALLOW_INDEXING: process.env.NEXT_PUBLIC_ALLOW_INDEXING,
  DATABASE_URL: process.env.DATABASE_URL,
});

// Sai → dừng app. Chỉ in TÊN biến + lý do, không in giá trị (tránh lộ secret)
if (!result.success) {
  const lines = result.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`);
  throw new Error(`Biến môi trường không hợp lệ:\n${lines.join("\n")}`);
}

export const env = result.data;