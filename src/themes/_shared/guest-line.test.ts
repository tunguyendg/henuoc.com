import { describe, expect, it } from "vitest";
import { HONORIFICS, parseGuestLine } from "./guest-line";

const F = "& Gia đình";
const P = "& Người thương";

type Row = [line: string, honorific: string, name: string, companion?: string];

const rows: Row[] = [
  ["Cô Chú Năm Hoà & gia đình", "Cô Chú", "Năm Hoà", F],
  ["a chị Minh", "Anh Chị", "Minh"],
  ["AC Tuấn", "Anh Chị", "Tuấn"],
  ["a/c Tuấn", "Anh Chị", "Tuấn"],
  ["Anh/Chị Tuấn", "Anh Chị", "Tuấn"],
  ["Anh Minh", "Anh", "Minh"],
  ["a Minh", "Anh", "Minh"],
  ["e Hương", "Em", "Hương"],
  ["anh minh & người thương", "Anh", "Minh", P],
  ["Minh Anh", "", "Minh Anh"],
  ["Nguyễn Văn Hùng", "", "Nguyễn Văn Hùng"],
  ["Chi Mai", "", "Chi Mai"],
  ["Anh Chi Mai", "Anh", "Chi Mai"],
  ["c Lan", "", "C Lan"],
  ["Ông Bà Nội", "Ông Bà", "Nội"],
  ["Bác Ba + gđ", "Bác", "Ba", F],
  ["CÔ CHÚ TƯ", "Cô Chú", "Tư"],
  ["Cô Lan", "Cô", "Lan"],
  ["Côn Sơn", "", "Côn Sơn"],
  ["Chúc Mai", "", "Chúc Mai"],
  ["Gia đình anh Bình", "Gia đình", "Anh Bình"],
  ["1. Chị Thảo 0901234567", "Chị", "Thảo"],
  ["2) - Chú Tám", "Chú", "Tám"],
  ["• Bà Sáu", "Bà", "Sáu"],
  ["🎉 Bạn Thu Hà!!!", "Bạn", "Thu Hà"],
  ["Em Hương và người yêu", "Em", "Hương", P],
  ["Anh Bình cùng vợ", "Anh", "Bình", P],
  ["Chị Mai Gia đình", "Chị", "Mai", F],
  ["Anh Minh & Các cháu", "Anh", "Minh & Các Cháu"],
  ["Anh Minh và Chị Lan", "Anh", "Minh Và Chị Lan"],
  ["Chị Lan & chồng", "Chị", "Lan", "& Người thương"],
  ["Cô Chú", "Cô Chú", ""],
  ["Gia đình", "Gia đình", ""],
  ["co chu Tư", "Cô Chú", "Tư"],
  ["   ", "", ""],
  ["", "", ""],
  ["😀😀 0909", "", ""],
  // Known ambiguity: Thư is read as a name; the host fixes it in the UI.
  ["Anh Thư", "Anh", "Thư"],
];

describe("parseGuestLine", () => {
  it.each(rows)("%j", (line, honorific, name, companion) => {
    const expected = companion ? { honorific, name, companion } : { honorific, name };
    expect(parseGuestLine(line)).toStrictEqual(expected);
  });

  it("đưa dạng NFD về NFC", () => {
    const parsed = parseGuestLine("Cô Chú Năm Hoà".normalize("NFD"));
    expect(parsed).toStrictEqual({ honorific: "Cô Chú", name: "Năm Hoà" });
    expect(parsed.name).toBe(parsed.name.normalize("NFC"));
  });

  it("cắt dòng quá dài ở 120 ký tự và không ném lỗi", () => {
    const parsed = parseGuestLine(`Anh ${"Nguyễn ".repeat(100)}`);
    expect(parsed.honorific).toBe("Anh");
    expect(parsed.name.length).toBeLessThanOrEqual(120);
  });

  it("mọi danh xưng trong danh sách tự nhận ra chính nó", () => {
    for (const honorific of HONORIFICS) {
      expect(parseGuestLine(`${honorific} Lan`).honorific).toBe(honorific);
    }
  });

  it("cắt 120 ký tự không làm vỡ ký tự ngoài BMP", () => {
    const { name } = parseGuestLine("𠀀".repeat(200));
    expect(Array.from(name)).toHaveLength(120);
    expect(() => encodeURIComponent(name)).not.toThrow(); // throws on a lone surrogate
  });

  it("lọc ký tự vô hình: tên chỉ gồm ký tự vô hình thành rỗng", () => {
    expect(parseGuestLine("\u3164\u3164")).toEqual({ honorific: "", name: "" });
    expect(parseGuestLine("Anh Mi\u034Fnh\uFE0F")).toEqual({ honorific: "Anh", name: "Minh" });
  });

  it("giới hạn dấu chồng, không mất dấu tiếng Việt", () => {
    const { name } = parseGuestLine(`Z${"\u0301".repeat(116)}`);
    expect(Array.from(name).length).toBeLessThanOrEqual(3);
    expect(parseGuestLine("Nguyễn Thị Thuỷ")).toEqual({ honorific: "", name: "Nguyễn Thị Thuỷ" });
  });

  it("đầu vào rất dài vẫn trả kết quả trong giới hạn", () => {
    expect(Array.from(parseGuestLine("a".repeat(2_000_000)).name).length).toBeLessThanOrEqual(120);
  });
});
