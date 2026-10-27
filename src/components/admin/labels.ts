import type { ThemeStatus } from "@/data/themes";
import type { Plan, ThemeTier, UserRole, WeddingStatus } from "@/features/admin/types";

export const planLabels: Record<Plan, string> = { FREE: "Miễn phí", PREMIUM: "Cao cấp" };

export const statusLabels: Record<WeddingStatus, string> = {
  DRAFT: "Nháp",
  PUBLISHED: "Đã xuất bản",
  ARCHIVED: "Lưu trữ",
};

export const roleLabels: Record<UserRole, string> = { USER: "Người dùng", ADMIN: "Quản trị" };

export const tierLabels: Record<ThemeTier, string> = { free: "Miễn phí", premium: "Cao cấp" };

export const themeStatusLabels: Record<ThemeStatus, string> = {
  live: "Live",
  preview: "Preview",
  planned: "Lộ trình",
};

export const PREVIEW_NOT_SAVED = "Bản mẫu: chưa lưu";

const dateFormat = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** ISO 8601 UTC → "dd/mm/yyyy" in Vietnam time. */
export function formatDateVN(iso: string): string {
  return dateFormat.format(new Date(iso));
}
