import {
  checklistCategoryLabels,
  checklistItems,
  checklistPhases,
  phaseOf,
} from "@/data/checklist";
import { ChecklistRow } from "./checklist-interactive";

const groups = checklistPhases
  .map((phase) => ({
    phase,
    items: checklistItems.filter((item) => phaseOf(item).id === phase.id),
  }))
  .filter((group) => group.items.length > 0);

/** Full checklist grouped by phase. Server-rendered: the text is crawlable and printable. */
export function ChecklistList() {
  return (
    <div className="space-y-10 print:space-y-6">
      {groups.map(({ phase, items }) => (
        <section
          key={phase.id}
          aria-labelledby={`moc-${phase.id}`}
          className="break-inside-avoid-page"
        >
          <h3
            id={`moc-${phase.id}`}
            className="flex items-baseline justify-between gap-3 border-b border-border pb-2 text-lg font-bold text-ink"
          >
            {phase.label}
            <span className="text-sm font-medium text-muted">{items.length} việc</span>
          </h3>
          <ul className="mt-4 space-y-3 print:mt-2 print:space-y-0">
            {items.map((item) => (
              <ChecklistRow key={item.id} id={item.id} daysBefore={item.daysBefore}>
                <span className="font-semibold text-ink group-data-[done=true]:text-muted group-data-[done=true]:line-through">
                  {item.title}
                </span>
                {item.note ? (
                  <span className="mt-0.5 block text-sm text-muted">{item.note}</span>
                ) : null}
                <span className="mt-1 block text-xs font-medium text-rose-700 print:hidden">
                  {checklistCategoryLabels[item.category]}
                </span>
              </ChecklistRow>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
