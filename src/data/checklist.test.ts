import { describe, expect, it } from "vitest";
import { checklistCategoryLabels, checklistItems, checklistPhases, phaseOf } from "./checklist";

describe("checklist", () => {
  it("có khoảng 40 việc", () => {
    expect(checklistItems.length).toBeGreaterThanOrEqual(35);
    expect(checklistItems.length).toBeLessThanOrEqual(45);
  });

  it("id duy nhất, kebab-case (trạng thái tick lưu theo id)", () => {
    const ids = checklistItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("hạn nằm trong 12 tháng → ngày cưới, xếp từ xa đến gần", () => {
    const days = checklistItems.map((item) => item.daysBefore);
    for (const d of days) {
      expect(Number.isInteger(d)).toBe(true);
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(365);
    }
    expect(days).toEqual([...days].sort((a, b) => b - a));
  });

  it("mọi category có nhãn", () => {
    for (const item of checklistItems) expect(checklistCategoryLabels[item.category]).toBeTruthy();
  });

  it("không chứa con số tiền / phần trăm bịa", () => {
    for (const item of checklistItems) {
      expect(`${item.title} ${item.note ?? ""}`).not.toMatch(/\d|%|triệu|nghìn/);
    }
  });

  it("phaseOf xếp đúng nhóm", () => {
    expect(phaseOf({ daysBefore: 365 }).id).toBe("12-thang");
    expect(phaseOf({ daysBefore: 330 }).id).toBe("12-thang");
    expect(phaseOf({ daysBefore: 270 }).id).toBe("9-thang");
    expect(phaseOf({ daysBefore: 5 }).id).toBe("1-tuan");
    expect(phaseOf({ daysBefore: 0 }).id).toBe("ngay-cuoi");
    expect(phaseOf({ daysBefore: 400 }).id).toBe("12-thang");
  });

  it("nhóm xếp từ xa đến gần, id nhóm không trùng (phaseOf dựa vào thứ tự này)", () => {
    const days = checklistPhases.map((phase) => phase.daysBefore);
    expect(days).toEqual([...days].sort((a, b) => b - a));
    expect(new Set(checklistPhases.map((phase) => phase.id)).size).toBe(checklistPhases.length);
  });

  it("khoá danh sách id: đổi tên id = mất tick đã lưu của người dùng", () => {
    expect(checklistItems.map((item) => item.id)).toMatchInlineSnapshot(`
      [
        "thong-nhat-hai-gia-dinh",
        "du-tru-ngan-sach",
        "chon-mua-cuoi",
        "phac-thao-danh-sach-khach",
        "le-dam-ngo",
        "xem-ngay-cuoi",
        "dat-nha-hang",
        "chon-phong-cach-cuoi",
        "dat-chup-anh-cuoi",
        "dat-trang-phuc-cuoi",
        "dat-quay-phim-mc",
        "chon-phu-dau-phu-re",
        "chup-anh-cuoi",
        "dat-trang-diem",
        "dat-trang-tri",
        "kham-tien-hon-nhan",
        "mua-nhan-cuoi",
        "chot-danh-sach-khach",
        "dat-tra-le-an-hoi",
        "chon-mau-thiep",
        "in-thiep-giay",
        "tao-thiep-online",
        "dat-xe-hoa",
        "chon-qua-cam-on",
        "len-kich-ban-le",
        "dang-ky-ket-hon",
        "gui-thiep",
        "chuan-bi-phong-bi-an-hoi",
        "le-an-hoi",
        "thu-trang-phuc",
        "chuan-bi-phong-cuoi",
        "nhac-khach-xac-nhan",
        "bao-so-ban",
        "phan-cong-nguoi-nha",
        "trang-diem-thu",
        "so-do-ban",
        "xac-nhan-dich-vu",
        "chuan-bi-phong-bi-ruoc-dau",
        "chuan-bi-ban-tho-gia-tien",
        "nghi-ngoi",
        "le-vu-quy-thanh-hon",
        "tiec-cuoi",
      ]
    `);
  });

  it("mỗi nhóm có ít nhất một việc", () => {
    const used = new Set(checklistItems.map((item) => phaseOf(item).id));
    for (const phase of checklistPhases) expect(used).toContain(phase.id);
  });
});
