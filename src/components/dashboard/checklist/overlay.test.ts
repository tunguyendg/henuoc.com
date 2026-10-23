import { describe, expect, it } from "vitest";
import { duePill, matchesFilter, parseOverlay, shortDay } from "./overlay";

const known = new Set(["a", "b"]);

describe("parseOverlay", () => {
  it("đọc record hợp lệ, bỏ id lạ", () => {
    expect(parseOverlay('{"a":true,"zzz":false,"b":false}', known)).toEqual({ a: true, b: false });
  });
  it("hỏng → {}", () => {
    expect(parseOverlay(null, known)).toEqual({});
    expect(parseOverlay("{oops", known)).toEqual({});
    expect(parseOverlay('{"a":"yes"}', known)).toEqual({});
    expect(parseOverlay("[1]", known)).toEqual({});
  });
});

describe("hạn", () => {
  it("pill", () => {
    expect(duePill(true, -3)?.label).toBe("Xong");
    expect(duePill(false, -1)).toEqual({ label: "Quá hạn", tone: "overdue" });
    expect(duePill(false, 0)?.label).toBe("Hôm nay");
    expect(duePill(false, 5)?.label).toBe("Còn 5 ngày");
    expect(duePill(false, null)).toBeNull();
  });
  it("lọc", () => {
    expect(matchesFilter("overdue", false, "2027-01-01", "2027-01-02")).toBe(true);
    expect(matchesFilter("overdue", true, "2027-01-01", "2027-01-02")).toBe(false);
    expect(matchesFilter("todo", true, null, "2027-01-02")).toBe(false);
    expect(matchesFilter("all", true, null, "2027-01-02")).toBe(true);
  });
  it("shortDay", () => expect(shortDay("2027-03-09")).toBe("09/03"));
});
