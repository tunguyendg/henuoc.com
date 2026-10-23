import { describe, expect, it, vi } from "vitest";

import { qrSvgDataUri } from "./qr";
import { buildVietQrPayload } from "./vietqr";

// "server-only" only means something inside the Next bundler → replace with an empty module in Vitest
vi.mock("server-only", () => ({}));

const PREFIX = "data:image/svg+xml;base64,";

function decode(dataUri: string): string {
  return Buffer.from(dataUri.slice(PREFIX.length), "base64").toString("utf8");
}

describe("qrSvgDataUri", () => {
  it("trả về data URI SVG base64", async () => {
    const uri = await qrSvgDataUri("hello");
    expect(uri.startsWith(PREFIX)).toBe(true);
    expect(uri.slice(PREFIX.length)).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  it("decode ra SVG, không có <script>", async () => {
    const svg = decode(await qrSvgDataUri("<script>alert(1)</script>"));
    expect(svg.trimStart().startsWith("<svg")).toBe(true);
    expect(svg.toLowerCase()).not.toContain("<script");
  });

  it("chạy được với payload VietQR thật", async () => {
    const payload = buildVietQrPayload({
      bankBin: "970436",
      accountNumber: "0123456789",
      amount: 500000,
      message: "Mừng cưới Minh & Lan",
    });
    const svg = decode(await qrSvgDataUri(payload));
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("payload rỗng → throw", async () => {
    await expect(qrSvgDataUri("")).rejects.toThrow();
  });

  it("payload quá 512 ký tự → throw", async () => {
    await expect(qrSvgDataUri("a".repeat(513))).rejects.toThrow();
    await expect(qrSvgDataUri("a".repeat(512))).resolves.toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it("cùng input → cùng output", async () => {
    expect(await qrSvgDataUri("henuoc")).toBe(await qrSvgDataUri("henuoc"));
  });
});
