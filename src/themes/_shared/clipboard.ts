// Copy helpers for the gift sheet. Pure: the clipboard is injected so this runs in tests.

export interface ClipboardLike {
  writeText: (text: string) => Promise<void>;
}

/** Returns true when the text reached the clipboard. false → caller falls back to selecting the text. */
export async function copyText(text: string, clipboard?: ClipboardLike | null): Promise<boolean> {
  if (!clipboard || typeof clipboard.writeText !== "function") return false;
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    // Permission denied, insecure context, some in-app browsers (Zalo)…
    return false;
  }
}

/** Account number as banks expect it: digits/letters only, no spaces or dots. */
export function normalizeAccountNumber(value: string): string {
  return value.replace(/[^0-9a-zA-Z]/g, "");
}

/** "0123456789012" → "0123 4567 8901 2" for reading; copy the normalized value, not this. */
export function formatAccountNumber(value: string): string {
  return normalizeAccountNumber(value).replace(/(.{4})(?=.)/g, "$1 ");
}
