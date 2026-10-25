import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// "server-only" chỉ có nghĩa trong bundler của Next → trong Vitest thay bằng module rỗng
vi.mock("server-only", () => ({}));

// env.server.ts parse lúc import → mỗi case phải reset module rồi import lại
async function loadServerEnv() {
  vi.resetModules();
  return (await import("./env.server")).serverEnv;
}

describe("serverEnv", () => {
  // Toàn giá trị giả — không bao giờ dán secret thật vào test
  const validEnv = {
    DATABASE_URL: "postgresql://u:p@localhost:5432/henuoc",
    BETTER_AUTH_SECRET: "test-secret-gia-it-nhat-32-ky-tu-0000",
    BETTER_AUTH_URL: "http://localhost:3000",
    GOOGLE_CLIENT_ID: "test-google-client-id",
    GOOGLE_CLIENT_SECRET: "test-google-client-secret",
    RESEND_API_KEY: "re_test",
  };

  function stubValidEnv() {
    for (const [key, value] of Object.entries(validEnv)) vi.stubEnv(key, value);
  }

  beforeEach(() => {
    for (const key of [...Object.keys(validEnv), "DIRECT_URL"]) vi.stubEnv(key, undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("đọc đúng khi đủ biến hợp lệ", async () => {
    stubValidEnv();
    vi.stubEnv("DIRECT_URL", "postgresql://u:p@localhost:5432/henuoc-direct");
    const env = await loadServerEnv();
    expect(env).toEqual({
      ...validEnv,
      DIRECT_URL: "postgresql://u:p@localhost:5432/henuoc-direct",
    });
  });

  it("thiếu RESEND_API_KEY → throw, message chỉ có tên biến", async () => {
    stubValidEnv();
    vi.stubEnv("RESEND_API_KEY", undefined);
    const error = await loadServerEnv().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(Error);
    const message = (error as Error).message;
    expect(message).toContain("RESEND_API_KEY");
    expect(message).not.toContain("BETTER_AUTH_SECRET"); // chỉ báo đúng biến thiếu
    for (const [key, value] of Object.entries(validEnv)) {
      expect(message).not.toContain(key === "RESEND_API_KEY" ? "re_test" : value);
    }
  });

  it("thiếu DATABASE_URL → throw (bắt buộc từ T-003)", async () => {
    stubValidEnv();
    vi.stubEnv("DATABASE_URL", undefined);
    const error = await loadServerEnv().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain("DATABASE_URL");
  });

  it("DATABASE_URL sai → throw, message có tên biến nhưng không lộ giá trị", async () => {
    const badValue = "mysql://admin:mat-khau-bi-mat@db.local/henuoc";
    stubValidEnv();
    vi.stubEnv("DATABASE_URL", badValue);
    const error = await loadServerEnv().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(Error);
    const message = (error as Error).message;
    expect(message).toContain("DATABASE_URL");
    expect(message).not.toContain(badValue);
    expect(message).not.toContain("mat-khau-bi-mat");
  });
});
