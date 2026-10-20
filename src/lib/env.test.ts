import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// env.ts parse lúc import → mỗi case phải reset module rồi import lại
async function loadEnv() {
  vi.resetModules();
  return (await import("./env")).env;
}

describe("env", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://henuoc.com");
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    vi.stubEnv("DATABASE_URL", undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("đọc đúng khi đủ biến hợp lệ", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://u:p@localhost:5432/henuoc");
    const env = await loadEnv();
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://henuoc.com");
    expect(env.NEXT_PUBLIC_ALLOW_INDEXING).toBe(false);
    expect(env.DATABASE_URL).toBe("postgresql://u:p@localhost:5432/henuoc");
  });

  it("thiếu NEXT_PUBLIC_SITE_URL → dùng localhost", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    const env = await loadEnv();
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  it("URL sai → throw, message có tên biến nhưng không lộ giá trị", async () => {
    const badValue = "khong-phai-url-bi-mat-123";
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", badValue);
    const error = await loadEnv().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(Error);
    const message = (error as Error).message;
    expect(message).toContain("NEXT_PUBLIC_SITE_URL");
    expect(message).not.toContain(badValue);
  });

  it("ALLOW_INDEXING: 'true' → true, bỏ trống → false", async () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    expect((await loadEnv()).NEXT_PUBLIC_ALLOW_INDEXING).toBe(true);

    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    expect((await loadEnv()).NEXT_PUBLIC_ALLOW_INDEXING).toBe(false);

    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", undefined);
    expect((await loadEnv()).NEXT_PUBLIC_ALLOW_INDEXING).toBe(false);
  });
});
