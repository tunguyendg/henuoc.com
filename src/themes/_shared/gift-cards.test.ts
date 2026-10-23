import { describe, expect, it } from "vitest";
import type { GiftView } from "../types";
import { isQrDataUri, toGiftCards } from "./gift-cards";

const base: Omit<GiftView, "id" | "side"> = {
  bankName: "Vietcombank",
  accountNumber: "0123456789",
  accountName: "NGUYEN MINH ANH",
  qrPayload: "000201010211...",
  qrSvg: "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=",
};

describe("toGiftCards", () => {
  it("keeps at most one card per side, nhà trai first, and drops qrPayload", () => {
    const cards = toGiftCards([
      { ...base, id: "g1", side: "nha-gai" },
      { ...base, id: "g2", side: "nha-trai" },
      { ...base, id: "g3", side: "nha-gai" },
    ]);
    expect(cards.map((c) => c.id)).toEqual(["g2", "g1"]);
    expect(cards[0]).not.toHaveProperty("qrPayload");
  });

  it("returns [] for no gifts", () => {
    expect(toGiftCards([])).toEqual([]);
  });

  it("drops a qrSvg that is not our SVG data URI", () => {
    const [card] = toGiftCards([
      { ...base, id: "g1", side: "nha-trai", qrSvg: "https://evil.example/qr.svg" },
    ]);
    expect(card?.qrSvg).toBeUndefined();
  });
});

describe("isQrDataUri", () => {
  it("accepts base64 SVG data URIs only", () => {
    expect(isQrDataUri("data:image/svg+xml;base64,PHN2Zz4=")).toBe(true);
    expect(isQrDataUri("data:image/svg+xml;utf8,<svg onload=alert(1)>")).toBe(false);
    expect(isQrDataUri("data:text/html;base64,PHN2Zz4=")).toBe(false);
    expect(isQrDataUri(undefined)).toBe(false);
  });
});
