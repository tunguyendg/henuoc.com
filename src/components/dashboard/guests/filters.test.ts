import { describe, expect, it } from "vitest";
import type { GuestGroup } from "@/features/guest/types";
import { guestsHref, parseGuestFilter } from "./filters";

const groups: GuestGroup[] = [
  { id: "g1", name: "Họ hàng", side: "NHA_TRAI" },
] as unknown as GuestGroup[];

describe("parseGuestFilter", () => {
  it("accepts a valid side and an own group", () => {
    expect(parseGuestFilter({ side: "NHA_GAI", group: "g1" }, groups)).toEqual({
      side: "NHA_GAI",
      groupId: "g1",
    });
  });

  it("drops an unknown side and a foreign group", () => {
    expect(parseGuestFilter({ side: "HACK", group: "other" }, groups)).toEqual({
      side: undefined,
      groupId: undefined,
    });
  });

  it("uses the first value of repeated params", () => {
    expect(parseGuestFilter({ side: ["CHUNG", "NHA_TRAI"], group: ["g1", "x"] }, groups)).toEqual({
      side: "CHUNG",
      groupId: "g1",
    });
  });
});

describe("guestsHref", () => {
  it("omits empty values", () => {
    expect(guestsHref({})).toBe("/dashboard/khach-moi");
    expect(guestsHref({ side: "CHUNG" })).toBe("/dashboard/khach-moi?side=CHUNG");
  });
});
