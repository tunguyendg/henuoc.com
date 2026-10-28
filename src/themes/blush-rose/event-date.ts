import { formatLunarDate, solarToLunar } from "../_shared/lunar";
import { civilDateInVietnam } from "./month-grid";

// Pure helpers for the ceremony/reception cards. Every value derives from the ISO `startsAt`
// (single source): we never parse dateLabel/lunarLabel strings.

const WEEKDAYS = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
] as const;

export interface EventDateParts {
  weekday: string;
  day: number;
  month: number;
  year: number;
}

/** Civil date in Asia/Ho_Chi_Minh plus Vietnamese weekday name. Invalid input → null. */
export function eventDateParts(startsAt: string): EventDateParts | null {
  const civil = civilDateInVietnam(startsAt);
  if (!civil) return null;
  const weekday = WEEKDAYS[new Date(Date.UTC(civil.year, civil.month - 1, civil.day)).getUTCDay()];
  return { weekday: weekday ?? "", ...civil };
}

/** "(Tức ngày 17 tháng 9 năm Đinh Mùi)" for the civil date of `startsAt`; null if invalid/out of range. */
export function lunarLine(startsAt: string): string | null {
  const civil = civilDateInVietnam(startsAt);
  if (!civil) return null;
  const iso = `${String(civil.year).padStart(4, "0")}-${String(civil.month).padStart(2, "0")}-${String(civil.day).padStart(2, "0")}`;
  try {
    const text = formatLunarDate(solarToLunar(iso));
    return `(${text.charAt(0).toLocaleUpperCase("vi")}${text.slice(1)})`;
  } catch {
    return null; // year outside 1800–2199
  }
}
