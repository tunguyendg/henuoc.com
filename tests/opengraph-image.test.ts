import { afterEach, expect, it, vi } from "vitest";
import OpenGraphImage, { alt, contentType, size } from "@/app/opengraph-image";

afterEach(() => vi.restoreAllMocks());

it("renders the shared Vietnamese OG image offline as a 1200×630 PNG", async () => {
  const originalFetch = globalThis.fetch;
  const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
    // next/og loads its bundled WASM using a data URL, which needs no network.
    if (typeof input === "string" && input.startsWith("data:")) return originalFetch(input, init);
    throw new Error("Network disabled");
  });
  const response = OpenGraphImage();
  const png = Buffer.from(await response.arrayBuffer());

  expect(response.headers.get("content-type")).toBe(contentType);
  expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(png.readUInt32BE(16)).toBe(size.width);
  expect(png.readUInt32BE(20)).toBe(size.height);
  expect(alt).toBe("Hẹn Ước — Thiệp cưới online đẹp, gửi đúng tên từng khách");
  expect(fetchSpy.mock.calls.every(([input]) => String(input).startsWith("data:"))).toBe(true);
});
