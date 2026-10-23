// Pure helpers for the invitation editor (no React, easy to unit-test).

export interface EditorEvent {
  id: string;
  title: string;
  /** "YYYY-MM-DDTHH:mm" in Vietnam time, the format <input type="datetime-local"> uses. */
  startsAtLocal: string;
  venue: string;
  address: string;
}

export interface EditorValues {
  themeSlug: string;
  brideName: string;
  groomName: string;
  brideShortName: string;
  groomShortName: string;
  brideFirst: boolean;
  brideParents: string;
  groomParents: string;
  inviteMessage: string;
  events: EditorEvent[];
}

export const LIMITS = {
  name: 60,
  shortName: 30,
  parents: 120,
  message: 500,
  venue: 100,
  address: 200,
} as const;

const VN_OFFSET_MS = 7 * 60 * 60 * 1000; // Asia/Ho_Chi_Minh has no DST

/** ISO 8601 UTC → "YYYY-MM-DDTHH:mm" in Vietnam time. */
export function isoToVnLocal(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  return new Date(t + VN_OFFSET_MS).toISOString().slice(0, 16);
}

/** "2027-10-17T18:00" → "17 · 10 · 2027" (preview label). */
export function localToDateLabel(local: string): string | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(local);
  return m ? `${m[3]} · ${m[2]} · ${m[1]}` : undefined;
}

export type EditorErrors = Partial<Record<string, string>>;

/** Client-side length checks only; nothing is sent anywhere yet. */
export function validate(v: EditorValues): EditorErrors {
  const e: EditorErrors = {};
  const need = (key: string, value: string, max: number, label: string) => {
    if (!value.trim()) e[key] = `${label} không được để trống`;
    else if (value.length > max) e[key] = `${label} tối đa ${max} ký tự`;
  };
  const cap = (key: string, value: string, max: number, label: string) => {
    if (value.length > max) e[key] = `${label} tối đa ${max} ký tự`;
  };
  need("brideName", v.brideName, LIMITS.name, "Tên cô dâu");
  need("groomName", v.groomName, LIMITS.name, "Tên chú rể");
  cap("brideShortName", v.brideShortName, LIMITS.shortName, "Tên gọi");
  cap("groomShortName", v.groomShortName, LIMITS.shortName, "Tên gọi");
  cap("brideParents", v.brideParents, LIMITS.parents, "Phần này");
  cap("groomParents", v.groomParents, LIMITS.parents, "Phần này");
  cap("inviteMessage", v.inviteMessage, LIMITS.message, "Lời mời");
  v.events.forEach((ev, i) => {
    cap(`venue-${i}`, ev.venue, LIMITS.venue, "Tên địa điểm");
    cap(`address-${i}`, ev.address, LIMITS.address, "Địa chỉ");
  });
  return e;
}
