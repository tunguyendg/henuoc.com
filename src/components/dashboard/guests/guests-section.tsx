import { assertDashboardPreview } from "@/components/dashboard/preview-guard";
import { repos } from "@/features/repos";
import type { RawSearchParams } from "@/lib/search-params";
import { parseGuestFilter } from "./filters";
import { GuestFilters } from "./guest-filters";
import { GuestResults, type GuestRow } from "./guest-results";

/** Reads searchParams (runtime API) → must sit inside <Suspense>. */
export async function GuestsSection({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  assertDashboardPreview();
  const wedding = await repos.wedding.getCurrentWedding();
  const groups = await repos.guest.listGroups(wedding.id);
  const filter = parseGuestFilter(await searchParams, groups);
  const guests = await repos.guest.listGuests(wedding.id, filter);
  const filtered = Boolean(filter.side || filter.groupId);
  // Map to exactly what the client list renders; no timestamps or event ids cross the boundary.
  const rows: GuestRow[] = guests.map((g) => ({
    id: g.id,
    displayName: g.displayName,
    salutation: [g.salutationPrefix, g.salutationSuffix].filter(Boolean).join(" … "),
    side: g.side,
    groupName: groups.find((x) => x.id === g.groupId)?.name ?? "Chưa xếp nhóm",
    maxAttendees: g.maxAttendees,
    delivery: g.delivery,
    opened: g.openedAt !== undefined,
    hasRsvp: g.hasRsvp,
    revoked: g.revoked,
  }));

  return (
    <>
      <GuestFilters filter={filter} groups={groups} />
      <GuestResults guests={rows} filtered={filtered} />
    </>
  );
}
