import { z } from "zod";

// Allowlists for URLs that come from the DB or from users and end up in src/href attributes of themes.
// Rule: never pass a user URL through raw — every one must go through one of these schemas.

// R2 custom domain is not final yet: change this list when the media domain is decided.
export const MEDIA_HOSTS = ["media.henuoc.com"] as const;

export const MAP_HOSTS = [
  "www.google.com",
  "google.com",
  "maps.google.com",
  "www.google.com.vn",
  "maps.app.goo.gl",
  "goo.gl",
] as const;

// Google hosts expose open redirects (e.g. maps.google.com/url?q=https://evil.com), so the pathname
// must always be "/maps" or "/maps/…". maps.google.com also allows exactly "/" (legacy "?q=address").
// "/url" and every other path are rejected on all hosts. maps.app.goo.gl is always a Maps short link.
const MAP_HOSTS_ROOT_ALLOWED: readonly string[] = ["maps.google.com"];

export const MAX_URL_LENGTH = 2048;

// Printable ASCII only (no whitespace, no control chars, no non-ASCII look-alikes), no backslash.
const SAFE_CHARS = /^[\x21-\x5b\x5d-\x7e]+$/;

/**
 * Internal path such as "/images/a.webp" or "/api/x/ics".
 * Rejects protocol-relative "//host", traversal ("..", also percent-encoded "%2e"), backslashes,
 * whitespace and control characters.
 */
export function isInternalPath(value: string): boolean {
  if (value.length === 0 || value.length > MAX_URL_LENGTH) return false;
  if (!SAFE_CHARS.test(value)) return false;
  if (!value.startsWith("/") || value.startsWith("//")) return false;
  if (value.includes("..") || /%2e/i.test(value)) return false;
  return true;
}

/**
 * Parses an absolute https URL and returns it only if it is "clean": https scheme written with "//",
 * no credentials, no explicit port. The hostname is lower-cased by the WHATWG URL parser.
 */
function parseCleanHttpsUrl(value: string): URL | null {
  if (value.length === 0 || value.length > MAX_URL_LENGTH) return null;
  // Raw check BEFORE parsing: the URL parser silently strips tabs/newlines and treats "\" as "/".
  if (!SAFE_CHARS.test(value)) return null;
  if (!/^https:\/\//i.test(value)) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username !== "" || url.password !== "") return null;
  if (url.port !== "") return null;
  return url;
}

const IMAGE_PATH_PREFIXES = ["/images/", "/themes/"] as const;
const MUSIC_PATH_PREFIXES = ["/audio/"] as const;

function isAllowedMediaUrl(value: string, prefixes: readonly string[]): boolean {
  if (isInternalPath(value)) return prefixes.some((prefix) => value.startsWith(prefix));
  const url = parseCleanHttpsUrl(value);
  return url !== null && (MEDIA_HOSTS as readonly string[]).includes(url.hostname);
}

export function isAllowedImageUrl(value: string): boolean {
  return isAllowedMediaUrl(value, IMAGE_PATH_PREFIXES);
}

export function isAllowedMusicUrl(value: string): boolean {
  return isAllowedMediaUrl(value, MUSIC_PATH_PREFIXES);
}

export function isAllowedMapUrl(value: string): boolean {
  const url = parseCleanHttpsUrl(value);
  if (url === null) return false;
  if (!(MAP_HOSTS as readonly string[]).includes(url.hostname)) return false;
  if (url.hostname === "maps.app.goo.gl") return true;
  if (url.pathname === "/maps" || url.pathname.startsWith("/maps/")) return true;
  return url.pathname === "/" && MAP_HOSTS_ROOT_ALLOWED.includes(url.hostname);
}

// Absolute URLs are re-serialised (url.href) so downstream code always gets the normalised form.
function normalise(value: string): string {
  return isInternalPath(value) ? value : new URL(value).href;
}

export const imageUrlSchema = z
  .string()
  .max(MAX_URL_LENGTH)
  .refine(isAllowedImageUrl, { message: "URL ảnh không hợp lệ" })
  .transform(normalise);

export const musicUrlSchema = z
  .string()
  .max(MAX_URL_LENGTH)
  .refine(isAllowedMusicUrl, { message: "URL nhạc không hợp lệ" })
  .transform(normalise);

export const mapUrlSchema = z
  .string()
  .max(MAX_URL_LENGTH)
  .refine(isAllowedMapUrl, { message: "Link bản đồ không hợp lệ" })
  .transform((value) => new URL(value).href);

// Internal routes only (e.g. icsUrl "/api/…/ics"): no prefix restriction, but never an absolute URL.
export const internalPathSchema = z
  .string()
  .max(MAX_URL_LENGTH)
  .refine(isInternalPath, { message: "Đường dẫn nội bộ không hợp lệ" });
