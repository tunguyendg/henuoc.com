import { describe, expect, it } from "vitest";
import { inviteLine } from "./salutation";

describe("inviteLine", () => {
  it("giữ nguyên câu đã có 'kính mời' (có tiền tố trang trọng)", () => {
    expect(inviteLine("Trân trọng kính mời Anh Minh & Gia đình")).toBe(
      "Trân trọng kính mời Anh Minh & Gia đình",
    );
    expect(inviteLine("Kính mời Chị Lan")).toBe("Kính mời Chị Lan");
  });

  it("chuỗi NFD không bị thêm tiền tố lần nữa", () => {
    const nfd = "Trân trọng kính mời Anh Minh".normalize("NFD");
    expect(inviteLine(nfd)).toBe(nfd);
  });

  it("tên trơn được thêm 'Kính mời' và cắt khoảng trắng", () => {
    expect(inviteLine("  Anh Minh  ")).toBe("Kính mời Anh Minh");
  });
});
