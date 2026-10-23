import { describe, expect, it } from "vitest";
import { copyText, formatAccountNumber, normalizeAccountNumber } from "./clipboard";

describe("copyText", () => {
  it("writes to the clipboard and reports success", async () => {
    let written = "";
    const ok = await copyText("0123", {
      writeText: async (t) => {
        written = t;
      },
    });
    expect(ok).toBe(true);
    expect(written).toBe("0123");
  });

  it("reports failure when the API is missing or rejects", async () => {
    expect(await copyText("0123", undefined)).toBe(false);
    expect(await copyText("0123", null)).toBe(false);
    expect(
      await copyText("0123", {
        writeText: () => Promise.reject(new Error("NotAllowedError")),
      }),
    ).toBe(false);
  });
});

describe("account number formatting", () => {
  it("normalizes spaces, dots and dashes away", () => {
    expect(normalizeAccountNumber(" 0123 456.789-0 ")).toBe("01234567890");
  });

  it("groups by 4 for reading", () => {
    expect(formatAccountNumber("0123456789012")).toBe("0123 4567 8901 2");
    expect(formatAccountNumber("1234")).toBe("1234");
    expect(formatAccountNumber("")).toBe("");
  });
});
