import "server-only";
import { checklistCategoryLabels, checklistItems, phaseOf } from "@/data/checklist";
import { dueDate, todayInVietnam } from "@/lib/checklist-schedule";
import { deepFreeze } from "../mock-freeze";
import { MOCK_WEDDING_ID, findMockWedding } from "../wedding/mock-repo";
import type { ChecklistRepo } from "./repo";
import type { ChecklistItemView } from "./types";

// Sample state: the first 8 template items are already done (real rows: ChecklistProgress table).
const DONE_COUNT = 8;
export const mockDoneIds: Readonly<Record<string, readonly string[]>> = deepFreeze({
  [MOCK_WEDDING_ID]: checklistItems.slice(0, DONE_COUNT).map((i) => i.id),
});

export const mockChecklistRepo: ChecklistRepo = {
  async listItems(weddingId) {
    const wedding = findMockWedding(weddingId);
    if (!wedding) return [];
    const weddingDay = wedding.weddingDate ? todayInVietnam(new Date(wedding.weddingDate)) : null;
    const done = new Set(mockDoneIds[weddingId] ?? []);
    const views = checklistItems.map((item): ChecklistItemView => {
      const phase = phaseOf(item);
      return {
        id: item.id,
        title: item.title,
        note: item.note,
        category: item.category,
        categoryLabel: checklistCategoryLabels[item.category],
        phaseId: phase.id,
        phaseLabel: phase.label,
        daysBefore: item.daysBefore,
        dueDate: weddingDay ? dueDate(weddingDay, item.daysBefore) : null,
        done: done.has(item.id),
      };
    });
    return structuredClone(views);
  },
};
