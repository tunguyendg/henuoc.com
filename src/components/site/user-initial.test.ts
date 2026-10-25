import { describe, expect, it } from "vitest";
import { userInitial } from "./user-initial";

describe("userInitial", () => {
  it("lấy chữ đầu của tên và viết hoa", () => {
    expect(userInitial({ name: "linh", email: "a@b.vn" })).toBe("L");
  });
  it("viết hoa đúng chữ có dấu", () => {
    expect(userInitial({ name: "đức", email: "a@b.vn" })).toBe("Đ");
  });
  it("tên dạng NFD (dấu tách rời) vẫn giữ dấu", () => {
    expect(userInitial({ name: "ánh".normalize("NFD"), email: "a@b.vn" })).toBe("Á");
  });
  it("tên rỗng hoặc toàn khoảng trắng thì lấy email", () => {
    expect(userInitial({ name: "", email: "minh@b.vn" })).toBe("M");
    expect(userInitial({ name: "   ", email: "minh@b.vn" })).toBe("M");
    expect(userInitial({ name: null, email: "minh@b.vn" })).toBe("M");
  });
  it("không cắt đôi emoji", () => {
    expect(userInitial({ name: "😀 vui", email: "a@b.vn" })).toBe("😀");
  });
  it("không có gì thì trả ?", () => {
    expect(userInitial({ name: "", email: "" })).toBe("?");
  });
});
