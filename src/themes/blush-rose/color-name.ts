// Vietnamese colour name for a hex code, used as an accessible label for dress-code dots.
// Nearest neighbour in plain RGB space is accurate enough for ~14 named colours.

const PALETTE: readonly (readonly [name: string, r: number, g: number, b: number])[] = [
  ["đỏ đô", 0x6b, 0x1f, 0x2a],
  ["đỏ", 0xd0, 0x2a, 0x2e],
  ["hồng nhạt", 0xf0, 0xc4, 0xcc],
  ["hồng", 0xe8, 0x6a, 0x92],
  ["kem", 0xf5, 0xee, 0xdc],
  ["be", 0xd9, 0xc2, 0x9c],
  ["trắng", 0xff, 0xff, 0xff],
  ["đen", 0x00, 0x00, 0x00],
  ["xám", 0x80, 0x80, 0x80],
  ["nâu", 0x7a, 0x4a, 0x2a],
  ["vàng", 0xf2, 0xc2, 0x2e],
  ["xanh lá", 0x3f, 0x9a, 0x4d],
  ["xanh dương", 0x3a, 0x7b, 0xd5],
  ["xanh navy", 0x1b, 0x2a, 0x4f],
];

/** `#RRGGBB` (case-insensitive) → nearest colour name. Malformed input falls back to "màu khác". */
export function colorName(hex: string): string {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!match) return "màu khác";
  const [r, g, b] = [match[1], match[2], match[3]].map((part) => Number.parseInt(part ?? "0", 16));
  let best = PALETTE[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const entry of PALETTE) {
    const distance =
      (entry[1] - (r ?? 0)) ** 2 + (entry[2] - (g ?? 0)) ** 2 + (entry[3] - (b ?? 0)) ** 2;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = entry;
    }
  }
  return best?.[0] ?? "màu khác";
}
