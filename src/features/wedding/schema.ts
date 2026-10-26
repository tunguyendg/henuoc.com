import { z } from "zod";

const name = (label: string) =>
  z
    .string()
    // xoá ký tự điều khiển + zero-width (vô hình, dùng để giả tên / phá giao diện)
    .transform((s) => s.replace(/[\p{Cc}\p{Cf}]/gu, ""))
    .pipe(z.string().trim().min(1, `Nhập tên ${label}`).max(60, `Tên ${label} tối đa 60 ký tự`));
export const createWeddingSchema = z.object({
  brideName: name("cô dâu"),
  groomName: name("chú rể"),
  // <input type="date"> gửi "2026-12-20" hoặc "" nếu bỏ trống
  weddingDate: z
    .union([z.iso.date(), z.literal("")])
    .optional()
    // Ngày cưới tính theo giờ VN → nửa đêm +07:00, Postgres lưu ra UTC (17:00 hôm trước)
    .transform((d) => (d ? new Date(`${d}T00:00:00+07:00`) : null)),
});

export type CreateWeddingInput = z.infer<typeof createWeddingSchema>;
