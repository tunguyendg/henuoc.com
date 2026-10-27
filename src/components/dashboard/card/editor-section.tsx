import { assertDashboardPreview } from "@/components/dashboard/preview-guard";
import { visibleThemes } from "@/data/themes";
import { repos } from "@/features/repos";
import { connection } from "next/server";
import { CardEditor, type ThemeChoice } from "./card-editor";
import { isoToVnLocal, type EditorValues } from "./draft";

/** Per-user data (session later) → resolved at request time. Render inside <Suspense>. */
export async function EditorSection() {
  assertDashboardPreview();
  await connection();
  const wedding = await repos.wedding.getCurrentWedding();
  const draft = await repos.wedding.getDraft(wedding.id);

  // Pass only what the editor edits, as plain strings/booleans (the owner's own data, no tokens).
  // Mock preview: no theme is "live" yet, so preview themes are allowed here. Switch to live-only
  // when real data replaces the mock (docs/STATUS.md).
  const initial: EditorValues = {
    themeSlug: visibleThemes.some((t) => t.slug === draft.themeSlug)
      ? draft.themeSlug
      : (visibleThemes[0]?.slug ?? ""),
    brideName: draft.brideName,
    groomName: draft.groomName,
    brideShortName: draft.brideShortName ?? "",
    groomShortName: draft.groomShortName ?? "",
    brideFirst: draft.brideFirst,
    brideParents: draft.brideParents ?? "",
    groomParents: draft.groomParents ?? "",
    inviteMessage: draft.inviteMessage ?? "",
    events: draft.events.map((e) => ({
      id: e.id,
      title: e.title,
      startsAtLocal: isoToVnLocal(e.startsAt),
      venue: e.venue,
      address: e.address,
    })),
  };
  const choices: ThemeChoice[] = visibleThemes.map((t) => ({
    slug: t.slug,
    name: t.name,
    preview: t.preview,
    premium: t.tier === "premium",
  }));

  return <CardEditor initial={initial} themes={choices} />;
}
