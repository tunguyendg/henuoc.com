const TZ = "Asia/Ho_Chi_Minh";

const dayFormat = new Intl.DateTimeFormat("vi-VN", {
  timeZone: TZ,
  weekday: "long",
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

const dateTimeFormat = new Intl.DateTimeFormat("vi-VN", {
  timeZone: TZ,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** "Chủ nhật, 17/10/2027" in Vietnam time; undefined for an invalid timestamp. */
export function formatLongDate(iso: string): string | undefined {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : dayFormat.format(d);
}

/** "20:00 16/09/2027" in Vietnam time; undefined for an invalid timestamp. */
export function formatDateTime(iso: string): string | undefined {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : dateTimeFormat.format(d);
}

/** "YYYY-MM-DD" → "DD/MM/YYYY" (pure string work, no time zone involved). */
export function formatIsoDay(day: string): string {
  const [y, m, d] = day.split("-");
  return `${d}/${m}/${y}`;
}
