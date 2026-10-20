export type VietQrInput = {
  bankBin: string;
  accountNumber: string;
  amount?: number;
  message?: string;
};

export function crc16Ccitt(data: string): string {
  let crc = 0xffff;

  for (const byte of new TextEncoder().encode(data)) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = ((crc << 1) ^ (crc & 0x8000 ? 0x1021 : 0)) & 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function tlv(id: string, value: string): string {
  if (!/^\d{2}$/.test(id)) {
    throw new Error("TLV ID must contain exactly two digits");
  }
  const length = new TextEncoder().encode(value).length;
  if (length > 99) {
    throw new Error("TLV value must not exceed 99 bytes");
  }
  return id + length.toString().padStart(2, "0") + value;
}

export function normalizeMessage(message: string): string {
  return message
    .slice(0, 200)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .replace(/ +/g, " ")
    .trim()
    .slice(0, 25)
    .trim();
}

export function buildVietQrPayload(input: VietQrInput): string {
  const { bankBin, accountNumber, amount, message } = input;
  if (typeof bankBin !== "string" || !/^\d{6}$/.test(bankBin)) {
    throw new Error("Bank BIN must contain exactly six digits");
  }
  if (typeof accountNumber !== "string" || !/^[0-9A-Za-z]{1,19}$/.test(accountNumber)) {
    throw new Error("Account number must contain 1–19 letters or digits");
  }
  if (
    amount !== undefined &&
    (!Number.isInteger(amount) || amount <= 0 || amount > 9_999_999_999_999)
  ) {
    throw new Error("Amount must be a positive integer with at most 13 digits");
  }
  if (message !== undefined && typeof message !== "string") {
    throw new Error("Message must be a string");
  }

  const beneficiary = tlv("00", bankBin) + tlv("01", accountNumber);
  const merchant = tlv("00", "A000000727") + tlv("01", beneficiary) + tlv("02", "QRIBFTTA");
  const normalizedMessage = normalizeMessage(message ?? "");
  const payload =
    tlv("00", "01") +
    tlv("01", amount === undefined ? "11" : "12") +
    tlv("38", merchant) +
    tlv("53", "704") +
    (amount === undefined ? "" : tlv("54", amount.toString())) +
    tlv("58", "VN") +
    (normalizedMessage ? tlv("62", tlv("08", normalizedMessage)) : "") +
    "6304";

  return payload + crc16Ccitt(payload);
}
