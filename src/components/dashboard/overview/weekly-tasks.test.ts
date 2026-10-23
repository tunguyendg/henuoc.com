import { describe, expect, it } from "vitest";
import { dueLabel, pickWeeklyTasks } from "./weekly-tasks";

const WEDDING = "2027-10-17T11:00:00.000Z"; // 17/10/2027 18:00 VN

describe("pickWeeklyTasks", () => {
  it("returns tasks due within 7 days, soonest first, max 5", () => {
    const r = pickWeeklyTasks(WEDDING, new Date("2027-10-10T05:00:00.000Z"));
    expect(r.mode).toBe("due");
    expect(r.tasks.length).toBeGreaterThan(0);
    expect(r.tasks.length).toBeLessThanOrEqual(5);
    expect(r.tasks[0]?.daysLeft).toBeGreaterThanOrEqual(0);
  });

  it("falls back to the nearest phase when nothing is due or overdue", () => {
    // Far before the 12-month phase: nothing overdue, nothing this week.
    const r = pickWeeklyTasks(WEDDING, new Date("2025-01-01T00:00:00.000Z"));
    expect(r.mode).toBe("next");
    expect(r.phaseLabel).toBe("12 tháng trước");
    expect(r.tasks.every((t) => t.daysLeft > 7)).toBe(true);
  });

  it("shows overdue items (most recent first) when behind schedule", () => {
    const r = pickWeeklyTasks(WEDDING, new Date("2027-09-01T00:00:00.000Z"));
    expect(r.mode).toBe("due");
    expect(r.tasks.some((t) => t.daysLeft < 0)).toBe(true);
  });

  it("returns none after the wedding or for an invalid date", () => {
    expect(pickWeeklyTasks(WEDDING, new Date("2028-01-01T00:00:00.000Z")).mode).toBe("none");
    expect(pickWeeklyTasks("nope", new Date("2027-01-01T00:00:00.000Z")).mode).toBe("none");
  });
});

describe("dueLabel", () => {
  it("formats today, future and overdue", () => {
    expect(dueLabel(0)).toBe("Hôm nay");
    expect(dueLabel(3)).toBe("Còn 3 ngày");
    expect(dueLabel(-6)).toBe("Quá hạn 6 ngày");
  });
});
