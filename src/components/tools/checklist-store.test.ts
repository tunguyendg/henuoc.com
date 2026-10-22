import { describe, expect, it } from "vitest";
import { checklistItems } from "@/data/checklist";
import { emptyChecklistState, formatVnDate, parseChecklistState } from "./checklist-store";

const [first, second] = checklistItems.map((i) => i.id);

describe("parseChecklistState", () => {
  it("không có dữ liệu / JSON hỏng / sai kiểu → trạng thái rỗng", () => {
    for (const raw of [null, "", "{", "[]", '"x"', '{"done":"abc"}', '{"weddingDate":5}']) {
      expect(parseChecklistState(raw)).toEqual(emptyChecklistState);
    }
  });

  it("giữ ngày hợp lệ, bỏ id không còn trong checklist và id trùng", () => {
    const raw = JSON.stringify({
      weddingDate: "2027-03-15",
      done: [first, "viec-da-bi-xoa", first, second],
    });
    expect(parseChecklistState(raw)).toEqual({ weddingDate: "2027-03-15", done: [first, second] });
  });

  it("ngày sai → bỏ ngày nhưng giữ việc đã tick", () => {
    for (const weddingDate of ["2027-02-30", "15/03/2027", ""]) {
      expect(parseChecklistState(JSON.stringify({ weddingDate, done: [first] }))).toEqual({
        weddingDate: null,
        done: [first],
      });
    }
  });
});

it("formatVnDate", () => {
  expect(formatVnDate("2027-03-05")).toBe("05/03/2027");
});
