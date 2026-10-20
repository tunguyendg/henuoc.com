import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// "server-only" chỉ có nghĩa trong bundler của Next → trong Vitest thay bằng module rỗng
vi.mock("server-only", () => ({}));

// env.server.ts parse lúc import → mỗi case phải reset module rồi import lại
async function loadServerEnv() {
  vi.resetModules();
  return (await import("./env.server")).serverEnv;
}

describe("serverEnv", () => {
  beforeEach(() => {
    vi.stubEnv("DATABASE_URL", undefined);
    vi.stubEnv("DIRECT_URL", undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("đọc đúng khi đủ biến hợp lệ", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://u:p@localhost:5432/henuoc");
    vi.stubEnv("DIRECT_URL", "postgresql://u:p@localhost:5432/henuoc-direct");
    const env = await loadServerEnv();
    expect(env.DATABASE_URL).toBe("postgresql://u:p@localhost:5432/henuoc");
    expect(env.DIRECT_URL).toBe("postgresql://u:p@localhost:5432/henuoc-direct");
  });

  it("thiếu DATABASE_URL vẫn qua (optional tới T-003)", async () => {
    const env = await loadServerEnv();
    expect(env.DATABASE_URL).toBeUndefined();
    expect(env.DIRECT_URL).toBeUndefined();
  });

  it("biến sai → throw, message có tên biến nhưng không lộ secret", async () => {
    const secret = "postgresql://admin:mat-khau-bi-mat@db.local/henuoc";
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("DIRECT_URL", secret);
    const error = await loadServerEnv().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(Error);
    const message = (error as Error).message;
    expect(message).toContain("DATABASE_URL");
    expect(message).not.toContain(secret);
    expect(message).not.toContain("mat-khau-bi-mat");
  });
});
