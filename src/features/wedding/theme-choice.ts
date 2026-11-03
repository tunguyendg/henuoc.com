import { getTheme, themes } from "@/data/themes";
import { getThemeEntry } from "@/themes/registry";

/** Dùng được để tạo thiệp: catalog đánh dấu "live" VÀ registry có code render thật. */
export function isCreatableTheme(slug: string): boolean {
  return getTheme(slug)?.status === "live" && getThemeEntry(slug) !== undefined;
}

/** Vào thẳng /dashboard/bat-dau không kèm ?mau= → mẫu live đầu tiên trong catalog. */
export function defaultThemeSlug(): string | undefined {
  return themes.find((t) => isCreatableTheme(t.slug))?.slug;
}

/**
 * Không gửi mẫu → dùng mẫu mặc định.
 * Gửi mẫu mà không dùng được → null: báo lỗi cho người dùng, KHÔNG tự đổi sang mẫu khác sau lưng họ.
 */
export function resolveThemeSlug(raw: string | undefined): string | null {
  if (!raw) return defaultThemeSlug() ?? null;
  return isCreatableTheme(raw) ? raw : null;
}
