import { z } from "zod";

// Biến PUBLIC: được nhúng vào JS gửi xuống trình duyệt → chỉ chứa thứ ai xem cũng được.
const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_ALLOW_INDEXING: z
    .enum(["true", "false", ""])
    .optional()
    .transform((v) => v === "true"),
});

// Viết tay từng biến: Next chỉ thay được dạng process.env.TEN_BIEN lúc build
const result = schema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ALLOW_INDEXING: process.env.NEXT_PUBLIC_ALLOW_INDEXING,
});

if (!result.success) {
  const lines = result.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`);
  throw new Error(`Biến môi trường (public) không hợp lệ:\n${lines.join("\n")}`);
}

export const clientEnv = result.data;