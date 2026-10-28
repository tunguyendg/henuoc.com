import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// env.client.ts parse lúc import → mỗi case phải reset module rồi import lại
async function loadClientEnv() {
  vi.resetModules();
  return (await import("./env.client")).clientEnv;
}

describe("clientEnv", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://henuoc.com");
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("đọc đúng khi đủ biến hợp lệ", async () => {
    const env = await loadClientEnv();
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://henuoc.com");
    expect(env.NEXT_PUBLIC_ALLOW_INDEXING).toBe(false);
  });

  it("thiếu NEXT_PUBLIC_SITE_URL → dùng localhost", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    const env = await loadClientEnv();
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  it("URL sai → throw, message có tên biến nhưng không lộ giá trị", async () => {
    const badValue = "khong-phai-url-bi-mat-123";
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", badValue);
    const error = await loadClientEnv().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(Error);
    const message = (error as Error).message;
    expect(message).toContain("NEXT_PUBLIC_SITE_URL");
    expect(message).not.toContain(badValue);
  });

  it("ALLOW_INDEXING: 'true' → true, bỏ trống → false", async () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    expect((await loadClientEnv()).NEXT_PUBLIC_ALLOW_INDEXING).toBe(true);

    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    expect((await loadClientEnv()).NEXT_PUBLIC_ALLOW_INDEXING).toBe(false);

    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", undefined);
    expect((await loadClientEnv()).NEXT_PUBLIC_ALLOW_INDEXING).toBe(false);
  });

  it("GOOGLE_MAPS_EMBED_KEY: rỗng hoặc thiếu → undefined", async () => {
    expect((await loadClientEnv()).NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY).toBeUndefined();
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY", undefined);
    expect((await loadClientEnv()).NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY).toBeUndefined();
  });

  it("GOOGLE_MAPS_EMBED_KEY: key hợp lệ được giữ nguyên", async () => {
    const key = "AIzaSyA-fake_key_0123456789abcdefghij";
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY", key);
    expect((await loadClientEnv()).NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY).toBe(key);
  });

  it("GOOGLE_MAPS_EMBED_KEY: có ký tự lạ hoặc quá ngắn → throw, không lộ giá trị", async () => {
    for (const bad of ["AIza&q=evil&padding0123456789", "ngan", "AIza key co khoang trang 12345"]) {
      vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY", bad);
      const error = await loadClientEnv().catch((e: unknown) => e);
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain("NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY");
      expect((error as Error).message).not.toContain(bad);
    }
  });
});
