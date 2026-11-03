import { z } from "zod";

const name = (label: string) =>
  z
    .string()
    .transform((s) => s.replace(/[\p{Cc}\p{Cf}]/gu, ""))
    .pipe(z.string().trim().min(1, `Nhập tên ${label}`).max(60, `Tên ${label} tối đa 60 ký tự`));

export const createWeddingSchema = z.object({
  brideName: name("cô dâu"),
  groomName: name("chú rể"),

  weddingDate: z
    .union([z.iso.date(), z.literal("")])
    .optional()
    .transform((d) => (d ? new Date(`${d}T00:00:00+07:00`) : null)),

  // Mẫu thiệp được chọn từ kho giao diện
  themeSlug: z.string().trim().max(40).optional(),
});

export type CreateWeddingInput = z.infer<typeof createWeddingSchema>;
