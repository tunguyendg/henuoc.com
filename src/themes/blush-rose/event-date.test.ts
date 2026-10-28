import { describe, expect, it } from "vitest";
import { eventDateParts, lunarLine } from "./event-date";

describe("lunarLine", () => {
  it("16.10.2027 là 17/9 Đinh Mùi, 17.10.2027 là 18/9", () => {
    expect(lunarLine("2027-10-16T02:00:00.000Z")).toBe("(Tức ngày 17 tháng 9 năm Đinh Mùi)");
    expect(lunarLine("2027-10-17T11:00:00.000Z")).toBe("(Tức ngày 18 tháng 9 năm Đinh Mùi)");
  });

  it("tính theo ngày ở Việt Nam, không theo UTC: 17:30 UTC đã sang ngày hôm sau", () => {
    expect(lunarLine("2027-10-16T17:30:00.000Z")).toBe(lunarLine("2027-10-17T03:00:00.000Z"));
  });

  it("Tết 2027 (6.2.2027) là mùng 1 tháng 1 năm Đinh Mùi", () => {
    expect(lunarLine("2027-02-06T05:00:00.000Z")).toBe("(Tức ngày 1 tháng 1 năm Đinh Mùi)");
  });

  it("input sai trả null", () => {
    expect(lunarLine("khong-phai-ngay")).toBeNull();
  });
});

describe("eventDateParts", () => {
  it("thứ, ngày, tháng, năm theo giờ Việt Nam", () => {
    expect(eventDateParts("2027-10-16T02:00:00.000Z")).toEqual({
      weekday: "Thứ Bảy",
      day: 16,
      month: 10,
      year: 2027,
    });
    expect(eventDateParts("2027-10-17T11:00:00.000Z")?.weekday).toBe("Chủ Nhật");
  });

  it("input sai trả null", () => {
    expect(eventDateParts("x")).toBeNull();
  });
});
