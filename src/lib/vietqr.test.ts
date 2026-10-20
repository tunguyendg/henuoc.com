import { describe, expect, it } from "vitest";
import { buildVietQrPayload, crc16Ccitt, normalizeMessage, tlv } from "./vietqr";

const input = { bankBin: "970436", accountNumber: "0123456789" };

function readTags(payload: string): Record<string, string> {
  const tags: Record<string, string> = {};
  for (let offset = 0; offset < payload.length;) {
    const id = payload.slice(offset, offset + 2);
    const length = Number(payload.slice(offset + 2, offset + 4));
    const value = payload.slice(offset + 4, offset + 4 + length);
    expect(value).toHaveLength(length);
    tags[id] = value;
    offset += 4 + length;
  }
  return tags;
}

describe("crc16Ccitt", () => {
  it("khớp vector chuẩn CRC-16/CCITT-FALSE", () => {
    expect(crc16Ccitt("123456789")).toBe("29B1");
  });

  it("giữ giá trị khởi tạo cho chuỗi rỗng và đệm số 0 đầu", () => {
    expect(crc16Ccitt("")).toBe("FFFF");
    expect(crc16Ccitt("11")).toBe("0DD9");
    for (const value of ["", "11", "123456789", "VietQR"]) {
      expect(crc16Ccitt(value)).toMatch(/^[0-9A-F]{4}$/);
    }
  });
});

describe("buildVietQrPayload", () => {
  it("tạo đúng cấu trúc TLV lồng khi không có số tiền", () => {
    const payload = buildVietQrPayload(input);
    expect(payload).toMatch(/^000201010211/);
    const tags = readTags(payload);
    expect(tags["38"]).toBe("0010A00000072701240006970436011001234567890208QRIBFTTA");
    const merchant = readTags(tags["38"]!);
    expect(merchant["00"]).toBe("A000000727");
    expect(readTags(merchant["01"]!)).toEqual({ "00": "970436", "01": "0123456789" });
    expect(merchant["02"]).toBe("QRIBFTTA");
    expect(tags["53"]).toBe("704");
    expect(tags["58"]).toBe("VN");
    expect(tags).not.toHaveProperty("54");
  });

  it("dùng mã động và thêm số tiền khi có amount", () => {
    const payload = buildVietQrPayload({ ...input, amount: 500000 });
    expect(payload).toContain("010212");
    expect(payload).toContain("5406500000");
    expect(readTags(payload)["54"]).toBe("500000");
  });

  it("tính CRC bao gồm hậu tố 6304", () => {
    for (const amount of [undefined, 1, 500000, 9_999_999_999_999]) {
      const payload = buildVietQrPayload({ ...input, amount });
      expect(payload.slice(-8, -4)).toBe("6304");
      expect(payload.slice(-4)).toBe(crc16Ccitt(payload.slice(0, -4)));
    }
  });

  it("đưa nội dung chuẩn hoá vào tag 62/08", () => {
    const tags = readTags(buildVietQrPayload({ ...input, message: "Mừng cưới Hà & Nam" }));
    expect(readTags(tags["62"]!)["08"]).toBe("Mung cuoi Ha Nam");
  });

  it("bỏ tag 62 khi nội dung không có hoặc chuẩn hoá thành rỗng", () => {
    for (const message of [undefined, "", "   ", "!@#$ & 🎉"]) {
      expect(readTags(buildVietQrPayload({ ...input, message }))).not.toHaveProperty("62");
    }
  });

  it("từ chối BIN sai định dạng", () => {
    for (const bankBin of ["", "97043", "9704360", "97043a", " 970436"]) {
      expect(() => buildVietQrPayload({ ...input, bankBin })).toThrow(/BIN/);
    }
  });

  it("từ chối số tài khoản sai định dạng", () => {
    for (const accountNumber of ["", "1".repeat(20), "123 456", "123-456", "Đ123"]) {
      expect(() => buildVietQrPayload({ ...input, accountNumber })).toThrow(/Account/);
    }
  });

  it("từ chối số tiền không nguyên dương hoặc quá 13 chữ số", () => {
    for (const amount of [0, -1, 1.5, 10_000_000_000_000, NaN, Infinity, -Infinity]) {
      expect(() => buildVietQrPayload({ ...input, amount })).toThrow(/Amount/);
    }
  });

  it("chấp nhận biên độ dài tài khoản và giữ số 0 đầu", () => {
    for (const accountNumber of ["0", "0123456789AbCdEfGhI"]) {
      const tags = readTags(buildVietQrPayload({ ...input, accountNumber }));
      expect(readTags(readTags(tags["38"]!)["01"]!)["01"]).toBe(accountNumber);
    }
  });

  it("khớp toàn bộ payload được ghép TLV thủ công", () => {
    const expected =
      "000201" +
      "010212" +
      "3854" +
      "0010A000000727" +
      "0124" +
      "0006970436" +
      "01100123456789" +
      "0208QRIBFTTA" +
      "5303704" +
      "5406100000" +
      "5802VN" +
      "6213" +
      "0809Mung cuoi" +
      "63044DDF";
    expect(buildVietQrPayload({ ...input, amount: 100000, message: "Mung cuoi" })).toBe(expected);
  });
});

describe("normalizeMessage", () => {
  it("bỏ dấu tiếng Việt và thay ký tự đặc biệt bằng khoảng trắng", () => {
    expect(normalizeMessage("Mừng cưới Hà & Nam")).toBe("Mung cuoi Ha Nam");
    expect(normalizeMessage("Đám cưới")).toBe("Dam cuoi");
    expect(normalizeMessage("  đường\tđến\nHà  ")).toBe("duong den Ha");
  });

  it("cắt tối đa 25 ký tự rồi bỏ khoảng trắng cuối", () => {
    expect(normalizeMessage("a".repeat(30))).toBe("a".repeat(25));
    expect(normalizeMessage("a".repeat(24) + " bbbb")).toBe("a".repeat(24));
  });
});

describe("tlv", () => {
  it("đệm độ dài hai chữ số và chấp nhận tối đa 99 byte", () => {
    expect(tlv("00", "01")).toBe("000201");
    expect(tlv("08", "")).toBe("0800");
    expect(tlv("08", "a".repeat(99))).toBe("0899" + "a".repeat(99));
  });

  it("từ chối giá trị quá 99 byte hoặc ID sai", () => {
    expect(() => tlv("08", "a".repeat(100))).toThrow(/99/);
    expect(() => tlv("08", "é".repeat(50))).toThrow(/99/);
    expect(() => tlv("8", "test")).toThrow(/ID/);
  });
});
