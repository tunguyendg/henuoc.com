import { describe, expect, it } from "vitest";
import { daysBetween, dueDate, isValidDate, todayInVietnam } from "./checklist-schedule";

describe("checklist-schedule", () => {
  it("dueDate lùi đúng số ngày, qua tháng / năm / năm nhuận", () => {
    expect(dueDate("2027-03-15", 0)).toBe("2027-03-15");
    expect(dueDate("2027-03-15", 7)).toBe("2027-03-08");
    expect(dueDate("2027-03-01", 1)).toBe("2027-02-28");
    expect(dueDate("2028-03-01", 1)).toBe("2028-02-29");
    expect(dueDate("2027-01-10", 365)).toBe("2026-01-10");
  });

  it("ngày sai → null", () => {
    for (const bad of ["", "2027-02-30", "2027-13-01", "15/03/2027", "2027-3-5", "abc"]) {
      expect(isValidDate(bad)).toBe(false);
      expect(dueDate(bad, 7)).toBeNull();
    }
  });

  it("daysBetween có dấu", () => {
    expect(daysBetween("2027-03-01", "2027-03-15")).toBe(14);
    expect(daysBetween("2027-03-15", "2027-03-01")).toBe(-14);
    expect(daysBetween("2027-03-15", "x")).toBeNull();
  });

  it("todayInVietnam theo giờ Việt Nam (UTC+7)", () => {
    expect(todayInVietnam(new Date("2027-03-14T16:59:00Z"))).toBe("2027-03-14");
    expect(todayInVietnam(new Date("2027-03-14T17:00:00Z"))).toBe("2027-03-15");
  });
});
