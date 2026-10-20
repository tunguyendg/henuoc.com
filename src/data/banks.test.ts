import { describe, expect, it } from "vitest";
import { buildVietQrPayload } from "@/lib/vietqr";
import { banks, findBankByBin } from "./banks";

describe("banks", () => {
  it("có ít nhất 20 ngân hàng", () => {
    expect(banks.length).toBeGreaterThanOrEqual(20);
  });

  it("khoá đúng từng cặp BIN – ngân hàng (sửa nhầm BIN là chuyển tiền nhầm ngân hàng)", () => {
    expect(banks.map((bank) => [bank.bin, bank.shortName])).toEqual([
      ["970436", "Vietcombank"],
      ["970415", "VietinBank"],
      ["970418", "BIDV"],
      ["970405", "Agribank"],
      ["970407", "Techcombank"],
      ["970422", "MBBank"],
      ["970416", "ACB"],
      ["970432", "VPBank"],
      ["970423", "TPBank"],
      ["970403", "Sacombank"],
      ["970437", "HDBank"],
      ["970441", "VIB"],
      ["970443", "SHB"],
      ["970431", "Eximbank"],
      ["970426", "MSB"],
      ["970448", "OCB"],
      ["970440", "SeABank"],
      ["970449", "LPBank"],
      ["970428", "NamABank"],
      ["970425", "ABBANK"],
      ["970409", "BacABank"],
      ["970412", "PVcomBank"],
      ["970454", "BVBank"],
    ]);
  });

  it("dữ liệu bị freeze, không sửa được lúc chạy", () => {
    expect(Object.isFrozen(banks)).toBe(true);
    expect(banks.every((bank) => Object.isFrozen(bank))).toBe(true);
  });

  it("mọi BIN gồm đúng 6 chữ số", () => {
    for (const bank of banks) {
      expect(bank.bin).toMatch(/^\d{6}$/);
    }
  });

  it("không trùng BIN", () => {
    const bins = banks.map((bank) => bank.bin);
    expect(new Set(bins).size).toBe(bins.length);
  });

  it("không trùng shortName", () => {
    const names = banks.map((bank) => bank.shortName);
    expect(new Set(names).size).toBe(names.length);
  });

  it("name và shortName không rỗng và đã trim", () => {
    for (const bank of banks) {
      expect(bank.name).not.toBe("");
      expect(bank.shortName).not.toBe("");
      expect(bank.name).toBe(bank.name.trim());
      expect(bank.shortName).toBe(bank.shortName.trim());
    }
  });

  it("mọi BIN sinh được payload VietQR", () => {
    for (const bank of banks) {
      expect(() =>
        buildVietQrPayload({ bankBin: bank.bin, accountNumber: "0123456789" }),
      ).not.toThrow();
    }
  });
});

describe("findBankByBin", () => {
  it("tìm được Vietcombank theo BIN 970436", () => {
    expect(findBankByBin("970436")?.shortName).toBe("Vietcombank");
  });

  it("BIN lạ trả undefined", () => {
    expect(findBankByBin("000000")).toBeUndefined();
    expect(findBankByBin("")).toBeUndefined();
  });
});
