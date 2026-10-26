import { describe, expect, it } from "vitest";
import { toSlug, weddingSlug } from "./slug";

describe("toSlug", () => {
  it("bỏ dấu tiếng Việt và viết liền", () => {
    expect(toSlug("Nguyễn Minh Anh")).toBe("nguyenminhanh");
  });

  it("chữ Đ/đ được đổi thành d", () => {
    expect(toSlug("Đặng Đức")).toBe("dangduc");
  });

  it("chuỗi NFD (kiểu macOS) ra cùng kết quả với chuỗi NFC", () => {
    const nfd = "Nguyễn Minh Anh".normalize("NFD");
    expect(nfd).not.toBe("Nguyễn Minh Anh");
    expect(toSlug(nfd)).toBe(toSlug("Nguyễn Minh Anh".normalize("NFC")));
    expect(toSlug(nfd)).toBe("nguyenminhanh");
  });

  it("bỏ khoảng trắng thừa ở đầu, cuối và giữa", () => {
    expect(toSlug("  Minh   Anh  ")).toBe("minhanh");
  });
});

describe("weddingSlug", () => {
  it("ghép tên cô dâu và chú rể bằng dấu gạch ngang", () => {
    expect(weddingSlug("Minh Anh", "Hoàng Nam")).toBe("minhanh-hoangnam");
  });

  it("cả hai tên toàn emoji hoặc ký tự lạ thì dùng 'thiep'", () => {
    expect(weddingSlug("😀🎉", "!!!")).toBe("thiep");
  });

  it("một tên hỏng một tên tốt thì chỉ giữ phần tốt, không có dấu gạch thừa", () => {
    expect(weddingSlug("😀", "Hoàng Nam")).toBe("hoangnam");
    expect(weddingSlug("Minh Anh", "!!!")).toBe("minhanh");
  });
});
