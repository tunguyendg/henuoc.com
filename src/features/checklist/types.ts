export interface ChecklistItemView {
  id: string; // stable template id (src/data/checklist.ts) — also the key of the done-state
  title: string;
  note?: string;
  category: string; // ChecklistCategory
  categoryLabel: string;
  phaseId: string;
  phaseLabel: string;
  daysBefore: number;
  dueDate: string | null; // "YYYY-MM-DD", counted back from the wedding day (Vietnam time)
  done: boolean;
}
