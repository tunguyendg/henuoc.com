import { assertDashboardPreview } from "@/components/dashboard/preview-guard";
import { connection } from "next/server";
import { checklistPhases } from "@/data/checklist";
import { repos } from "@/features/repos";
import { todayInVietnam } from "@/lib/checklist-schedule";
import { ChecklistInteractive } from "./checklist-interactive";

export async function ChecklistSection() {
  assertDashboardPreview();
  await connection(); // "today" is request-time data
  const wedding = await repos.wedding.getCurrentWedding();
  const items = await repos.checklist.listItems(wedding.id);
  const today = todayInVietnam();

  // Narrow arrays for the client: no notes, no wedding fields.
  const rows = items.map(({ id, title, categoryLabel, phaseId, dueDate, done }) => ({
    id,
    title,
    categoryLabel,
    phaseId,
    dueDate,
    done,
  }));
  const groups = checklistPhases.map(({ id, label }) => ({ id, label }));
  return <ChecklistInteractive weddingId={wedding.id} today={today} groups={groups} rows={rows} />;
}

export function ChecklistFallback() {
  return (
    <div aria-hidden className="flex flex-col gap-4">
      <div className="h-28 animate-pulse rounded-(--radius-card) bg-rose-50" />
      <div className="h-64 animate-pulse rounded-(--radius-card) bg-rose-50" />
    </div>
  );
}
