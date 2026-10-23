import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { repos } = await import("../repos");
const { checklistItems } = await import("@/data/checklist");
const { dueDate } = await import("@/lib/checklist-schedule");
const { MOCK_OTHER_WEDDING_ID, MOCK_WEDDING_ID } = await import("../wedding/mock-repo");

describe("checklist repo", () => {
  it("id khớp checklistItems, đúng thứ tự", async () => {
    const items = await repos.checklist.listItems(MOCK_WEDDING_ID);
    expect(items.map((i) => i.id)).toEqual(checklistItems.map((i) => i.id));
  });

  it("dueDate tính từ ngày cưới (giờ VN) bằng dueDate()", async () => {
    const items = await repos.checklist.listItems(MOCK_WEDDING_ID);
    // 2027-10-17T11:00Z = 17/10/2027 giờ VN
    for (const i of items) expect(i.dueDate).toBe(dueDate("2027-10-17", i.daysBefore));
  });

  it("8 việc đầu đã xong, còn lại chưa", async () => {
    const items = await repos.checklist.listItems(MOCK_WEDDING_ID);
    expect(items.filter((i) => i.done).map((i) => i.id)).toEqual(
      checklistItems.slice(0, 8).map((i) => i.id),
    );
  });

  it("wedding lạ → [], wedding khác không thừa kế trạng thái xong", async () => {
    expect(await repos.checklist.listItems("nope")).toEqual([]);
    const other = await repos.checklist.listItems(MOCK_OTHER_WEDDING_ID);
    expect(other.some((i) => i.done)).toBe(false);
  });

  it("trả bản sao, sửa không ảnh hưởng lần đọc sau", async () => {
    const a = await repos.checklist.listItems(MOCK_WEDDING_ID);
    a[0]!.done = false;
    const b = await repos.checklist.listItems(MOCK_WEDDING_ID);
    expect(b[0]!.done).toBe(true);
  });

  it("dữ liệu mẫu bị đóng băng: sửa phải throw", async () => {
    const { mockDoneIds } = await import("./mock-repo");
    const ids = mockDoneIds[MOCK_WEDDING_ID]!;
    expect(() => (ids as string[]).push("x")).toThrow();
    expect(() => {
      (mockDoneIds as Record<string, string[]>)[MOCK_WEDDING_ID] = [];
    }).toThrow();
  });
});
