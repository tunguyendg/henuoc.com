import type { ChecklistItemView } from "./types";

/** Read side of the checklist for the dashboard. Every method is scoped to `weddingId`. */
export interface ChecklistRepo {
  /**
   * Template items in template order with due dates and done flags of that wedding.
   * Unknown/foreign wedding → [].
   */
  listItems(weddingId: string): Promise<ChecklistItemView[]>;
}
