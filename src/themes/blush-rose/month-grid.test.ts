import { describe, expect, it } from "vitest";
import { civilDateInVietnam, getMonthGrid } from "./month-grid";

function locate(weeks: (number | null)[][], day: number) {
  for (const [row, week] of weeks.entries()) {
    const col = week.indexOf(day);
    if (col !== -1) return { row, col };
  }
  return null;
}

describe("civilDateInVietnam", () => {
  it("17:30 UTC ngày 16/10 là ngày 17/10 ở Việt Nam (UTC+7)", () => {
    expect(civilDateInVietnam("2027-10-16T17:30:00.000Z")).toEqual({
      year: 2027,
      month: 10,
      day: 17,
    });
  });

  it("11:00 UTC ngày 17/10 vẫn là ngày 17/10 ở Việt Nam", () => {
    expect(civilDateInVietnam("2027-10-17T11:00:00.000Z")).toEqual({
      year: 2027,
      month: 10,
      day: 17,
    });
  });

  it("ranh giới 17:00 UTC là nửa đêm VN: 16:59:59 còn hôm nay, 17:00:00 sang hôm sau", () => {
    expect(civilDateInVietnam("2027-10-17T16:59:59.000Z")?.day).toBe(17);
    expect(civilDateInVietnam("2027-10-17T17:00:00.000Z")?.day).toBe(18);
  });

  it("qua nửa đêm giao thừa dương lịch thì sang năm mới ở Việt Nam", () => {
    expect(civilDateInVietnam("2027-12-31T17:00:00.000Z")).toEqual({
      year: 2028,
      month: 1,
      day: 1,
    });
  });

  it("chuỗi không phải ngày hợp lệ trả về null", () => {
    expect(civilDateInVietnam("khong-phai-ngay")).toBeNull();
    expect(civilDateInVietnam("")).toBeNull();
  });
});

describe("getMonthGrid", () => {
  it("lưu lại đúng năm, tháng, ngày cưới theo giờ Việt Nam", () => {
    const grid = getMonthGrid("2027-10-16T17:30:00.000Z");
    expect(grid).toMatchObject({ year: 2027, month: 10, day: 17 });
  });

  it("mọi hàng đều đúng 7 ô", () => {
    for (const iso of [
      "2027-10-17T11:00:00.000Z",
      "2027-02-10T00:00:00.000Z",
      "2027-08-10T00:00:00.000Z",
      "2028-02-10T00:00:00.000Z",
    ]) {
      const grid = getMonthGrid(iso);
      expect(grid).not.toBeNull();
      for (const week of grid!.weeks) expect(week).toHaveLength(7);
    }
  });

  it("tuần bắt đầu Thứ Hai: tháng 10/2027 (1/10 là Thứ Sáu) có 4 ô trống đầu tuần", () => {
    const { weeks } = getMonthGrid("2027-10-17T11:00:00.000Z")!;
    expect(weeks[0]).toEqual([null, null, null, null, 1, 2, 3]);
    expect(weeks).toHaveLength(5);
  });

  it("tháng 10/2027 có 31 ngày, ô cuối tuần cuối là 31 (Chủ Nhật) nên không còn ô trống", () => {
    const { weeks } = getMonthGrid("2027-10-17T11:00:00.000Z")!;
    expect(weeks[4]).toEqual([25, 26, 27, 28, 29, 30, 31]);
    expect(weeks.flat().filter((cell) => cell !== null)).toHaveLength(31);
  });

  it("ngày cưới 17/10/2027 là Chủ Nhật nên nằm ở cột cuối (cột 7)", () => {
    const { weeks } = getMonthGrid("2027-10-16T17:30:00.000Z")!;
    expect(locate(weeks, 17)).toEqual({ row: 2, col: 6 });
  });

  it("ngày 1 đầu tháng nằm đúng cột thứ (1/10/2027 là Thứ Sáu, cột 5)", () => {
    const { weeks } = getMonthGrid("2027-10-01T05:00:00.000Z")!;
    expect(locate(weeks, 1)).toEqual({ row: 0, col: 4 });
  });

  it("thiếu ngày cuối tháng thì ô cuối được đệm null cho đủ 7 ô", () => {
    // 9/2027: 1/9 là Thứ Tư, 30 ngày -> 2 + 30 = 32 ô, đệm 3 ô.
    const { weeks } = getMonthGrid("2027-09-15T00:00:00.000Z")!;
    const last = weeks[weeks.length - 1];
    expect(last).toHaveLength(7);
    expect(last).toEqual([27, 28, 29, 30, null, null, null]);
  });

  it("ngày cuối tháng 31 nằm đúng cột thứ (31/8/2027 là Thứ Ba, cột 2)", () => {
    const { weeks } = getMonthGrid("2027-08-31T05:00:00.000Z")!;
    expect(locate(weeks, 31)).toEqual({ row: 5, col: 1 });
  });

  it("năm nhuận: 29/2/2028 có trong lưới, đúng Thứ Ba (cột 2)", () => {
    const { weeks, day } = getMonthGrid("2028-02-29T05:00:00.000Z")!;
    expect(day).toBe(29);
    expect(locate(weeks, 29)).toEqual({ row: 4, col: 1 });
    expect(weeks.flat().filter((cell) => cell !== null)).toHaveLength(29);
  });

  it("năm không nhuận: tháng 2/2027 chỉ có 28 ngày, không có ô 29", () => {
    const { weeks } = getMonthGrid("2027-02-10T05:00:00.000Z")!;
    expect(locate(weeks, 29)).toBeNull();
    expect(weeks.flat().filter((cell) => cell !== null)).toHaveLength(28);
  });

  it("tháng bắt đầu Thứ Hai (2/2027) không có ô trống đầu tuần và vừa đúng 4 hàng", () => {
    const { weeks } = getMonthGrid("2027-02-10T05:00:00.000Z")!;
    expect(weeks[0]?.[0]).toBe(1);
    expect(weeks).toHaveLength(4);
    expect(weeks.flat()).not.toContain(null);
  });

  it("tháng bắt đầu Chủ Nhật (8/2027) có 6 ô trống đầu tuần, ngày 1 ở cột cuối", () => {
    const { weeks } = getMonthGrid("2027-08-10T05:00:00.000Z")!;
    expect(weeks[0]).toEqual([null, null, null, null, null, null, 1]);
    expect(weeks).toHaveLength(6);
  });

  it("ngày cưới lệch sang tháng sau theo giờ VN thì lưới là của tháng sau", () => {
    // 17:00 UTC ngày 31/10 = 0h ngày 1/11 ở VN.
    const grid = getMonthGrid("2027-10-31T17:00:00.000Z");
    expect(grid).toMatchObject({ year: 2027, month: 11, day: 1 });
  });

  it("đầu vào không hợp lệ trả về null thay vì ném lỗi hay tạo lưới NaN", () => {
    expect(getMonthGrid("khong-phai-ngay")).toBeNull();
    expect(getMonthGrid("")).toBeNull();
  });
});
