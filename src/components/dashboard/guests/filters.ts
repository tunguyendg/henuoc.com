import { z } from "zod";
import { first, type RawSearchParams } from "@/lib/search-params";
import type { GuestFilter, GuestGroup } from "@/features/guest/types";
import type { Side } from "@/features/wedding/types";

export const sideLabels: Record<Side, string> = {
  NHA_TRAI: "Nhà trai",
  NHA_GAI: "Nhà gái",
  CHUNG: "Chung",
};

export const sides = Object.keys(sideLabels) as Side[];

const sideSchema = z.enum(["NHA_TRAI", "NHA_GAI", "CHUNG"]);

/**
 * Only side + group live in the URL. Guest names must never go into a URL query (AGENTS.md §4), so
 * the name search is client-side state (guest-results.tsx).
 *
 * URL input is untrusted: anything unknown is dropped (never an error page). `group` must be one of
 * the wedding's own groups, so a foreign/forged id cannot reach the repo.
 */
export function parseGuestFilter(raw: RawSearchParams, groups: readonly GuestGroup[]): GuestFilter {
  const side = sideSchema.safeParse(first(raw.side));
  const groupId = groups.find((g) => g.id === first(raw.group))?.id;
  return {
    side: side.success ? side.data : undefined,
    groupId,
  };
}

/** Builds /dashboard/khach-moi?… from a filter, omitting empty values. */
export function guestsHref(filter: GuestFilter): string {
  const p = new URLSearchParams();
  if (filter.side) p.set("side", filter.side);
  if (filter.groupId) p.set("group", filter.groupId);
  const qs = p.toString();
  return qs ? `/dashboard/khach-moi?${qs}` : "/dashboard/khach-moi";
}
