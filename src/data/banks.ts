import bankList from "./banks.json";

/**
 * Danh sách ngân hàng hỗ trợ VietQR (BIN theo NAPAS) — MỘT nguồn dữ liệu cho form tài khoản mừng cưới
 * và sinh mã VietQR. Dữ liệu thô nằm trong `banks.json`; chỉ sửa khi NAPAS đổi BIN.
 */

export interface Bank {
  readonly bin: string; // BIN NAPAS 6 số, dùng làm bankBin trong payload VietQR
  readonly shortName: string; // tên ngắn, vd "Vietcombank"
  readonly name: string; // tên pháp lý đầy đủ
}

// Freeze để không request nào sửa được mảng dùng chung trong module cache của server.
export const banks: readonly Bank[] = Object.freeze(
  (bankList satisfies Bank[]).map((bank) => Object.freeze({ ...bank })),
);

export function findBankByBin(bin: string): Bank | undefined {
  return banks.find((bank) => bank.bin === bin);
}
