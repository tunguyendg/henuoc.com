import type { GuestCompanion } from "../types";

// One pasted/typed guest line → structured { honorific, name, companion }. Pure, never throws.
// The host corrects any wrong guess in the UI (e.g. "Anh Thư" is read as honorific Anh + name Thư).

export const HONORIFICS = [
  "Anh",
  "Chị",
  "Anh Chị",
  "Em",
  "Bạn",
  "Cô",
  "Chú",
  "Cô Chú",
  "Bác",
  "Ông",
  "Bà",
  "Ông Bà",
  "Gia đình",
] as const;

export interface ParsedGuestLine {
  honorific: string;
  name: string;
  companion?: GuestCompanion;
}

const MAX_LENGTH = 120;
const LOCALE = "vi";

const fold = (text: string) => text.toLocaleLowerCase(LOCALE);

// Key = lowercase NFC words. Unaccented SINGLE words ("chi", "co") are deliberately absent: they are
// names or typos. "c" is absent too (Chị / Cô / Chú), and so is "anh chi" ("Anh Chi Mai" would lose the name). Longest alias wins at match time.
const ALIASES = new Map<string, string>([
  ...HONORIFICS.map((value): [string, string] => [fold(value), value]),
  ["a chị", "Anh Chị"],
  ["a c", "Anh Chị"],
  ["ac", "Anh Chị"],
  ["co chu", "Cô Chú"],
  ["ong ba", "Ông Bà"],
  ["gia dinh", "Gia đình"],
  ["a", "Anh"],
  ["e", "Em"],
]);
const MAX_ALIAS_WORDS = 2;

const FAMILY = "& Gia đình" satisfies GuestCompanion;
const PARTNER = "& Người thương" satisfies GuestCompanion;
const COMPANIONS = new Map<string, GuestCompanion>([
  ["gia đình", FAMILY],
  ["gia dinh", FAMILY],
  ["gđ", FAMILY],
  ["gd", FAMILY],
  ["người thương", PARTNER],
  ["nguoi thuong", PARTNER],
  ["người yêu", PARTNER],
  ["nguoi yeu", PARTNER],
  ["ny", PARTNER],
  ["vợ", PARTNER],
  ["chồng", PARTNER],
]);
// Without a connector only "gia đình" is clear enough to count.
const BARE_COMPANIONS = new Set(["gia đình", "gia dinh"]);
const CONNECTORS = new Set(["&", "+", "và", "cùng"]);
const MAX_COMPANION_WORDS = 2;

const LIST_MARKER = /^\s*(?:\d+\s*[.)]|[-•*])\s+/u;
const DISALLOWED = /[^\p{L}\p{M}\s&+\-']/gu;

function capitalise(word: string): string {
  if (word === "&") return word;
  const [first = "", ...rest] = Array.from(word);
  return first.toLocaleUpperCase(LOCALE) + fold(rest.join(""));
}

function tokenise(line: string): string[] {
  const cleaned = line
    .normalize("NFC")
    .replace(LIST_MARKER, "")
    .replace(/[/,]/g, " ")
    .replace(DISALLOWED, "");
  const spaced = cleaned
    .replace(/([&+])/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
  // By code point: String.slice could split a surrogate pair and leave a malformed string.
  return Array.from(spaced)
    .slice(0, MAX_LENGTH)
    .join("")
    .split(" ")
    .filter((token) => token !== "" && token !== "-");
}

function takeCompanion(tokens: string[]): { rest: string[]; companion?: GuestCompanion } {
  for (let size = MAX_COMPANION_WORDS; size >= 1; size--) {
    if (tokens.length <= size) continue; // something must remain before the companion
    const key = fold(tokens.slice(-size).join(" "));
    const companion = COMPANIONS.get(key);
    if (!companion) continue;
    const before = tokens.slice(0, -size);
    const connector = fold(before.at(-1) ?? "");
    if (CONNECTORS.has(connector)) {
      const rest = before.slice(0, -1);
      if (rest.length > 0) return { rest, companion };
    } else if (BARE_COMPANIONS.has(key)) {
      return { rest: before, companion };
    }
  }
  return { rest: tokens };
}

function takeHonorific(tokens: string[]): { honorific: string; rest: string[] } {
  for (let size = Math.min(MAX_ALIAS_WORDS, tokens.length); size >= 1; size--) {
    const honorific = ALIASES.get(fold(tokens.slice(0, size).join(" ")));
    if (honorific) return { honorific, rest: tokens.slice(size) };
  }
  return { honorific: "", rest: tokens };
}

export function parseGuestLine(line: string): ParsedGuestLine {
  const tokens = tokenise(typeof line === "string" ? line : "");
  while (tokens.length > 0 && /^[&+]$/.test(tokens.at(-1)!)) tokens.pop();
  while (tokens.length > 0 && /^[&+]$/.test(tokens[0]!)) tokens.shift();

  const { rest: withoutCompanion, companion } = takeCompanion(tokens);
  const { honorific, rest } = takeHonorific(withoutCompanion);
  const name = rest.map(capitalise).join(" ");
  return companion ? { honorific, name, companion } : { honorific, name };
}
