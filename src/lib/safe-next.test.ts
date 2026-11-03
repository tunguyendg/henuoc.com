import { describe, expect, it } from "vitest";
import { safeNext } from "./safe-next";

describe("safeNext: chỉ cho chuyển hướng nội bộ trong vùng /dashboard", () => {
  it.each([
    ["/dashboard", "/dashboard"],
    ["/dashboard/bat-dau?mau=blush-rose", "/dashboard/bat-dau?mau=blush-rose"],
    ["/dashboard?next=//evil.com", "/dashboard?next=//evil.com"], // chỉ là query nội bộ
  ])("%s hợp lệ → giữ nguyên", (input, expected) => {
    expect(safeNext(input)).toBe(expected);
  });

  it.each([
    [null],
    [undefined],
    [""],
    ["//evil.com"], // trình duyệt hiểu là sang domain khác
    ["/\\evil.com"],
    ["https://evil.com/dashboard"], // không phải đường dẫn tương đối
    ["javascript:alert(1)"],
    ["/admin"], // ngoài vùng cho phép
    ["/dashboard-evil"], // prefix giả
    ["/dashboard/../admin"], // URL chuẩn hoá ".." → /admin
    ["/dashboard/%2e%2e/admin"], // "%2e%2e" cũng được coi là ".."
    ["/%2F%2Fevil.com"], // pathname là "/%2F%2Fevil.com", không thuộc /dashboard → bị từ chối
    // "%0d%0a" chỉ là chữ percent-encoded, không phải CR/LF thật; pathname không thuộc /dashboard/ nên về fallback
    ["/dashboard%0d%0a"],
    ["/dashboard\r\nSet-Cookie: x=1"], // CR/LF thật → chặn header injection
    ["/dashboard\t"],
  ])("%j → về fallback /dashboard", (input) => {
    expect(safeNext(input)).toBe("/dashboard");
  });

  it("cho đổi allowPrefix", () => {
    expect(safeNext("/x", { fallback: "/", allowPrefix: "/x" })).toBe("/x");
  });

  it("fallback tuỳ chỉnh được dùng khi đầu vào xấu", () => {
    expect(safeNext("//evil.com", { fallback: "/", allowPrefix: "/x" })).toBe("/");
    expect(safeNext("/dashboard", { fallback: "/", allowPrefix: "/x" })).toBe("/");
  });
});
