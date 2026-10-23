import { ChipLink } from "@/components/dashboard/chip-link";
import type { GuestFilter, GuestGroup } from "@/features/guest/types";
import { guestsHref, sideLabels, sides } from "./filters";

function Chip({ href, active, children }: { href: string; active: boolean; children: string }) {
  return (
    <ChipLink href={href} active={active} variant="soft">
      {children}
    </ChipLink>
  );
}

// Chips scroll sideways inside their own row; the page itself never does.
const rowClass = "-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0";

export function GuestFilters({
  filter,
  groups,
}: {
  filter: GuestFilter;
  groups: readonly GuestGroup[];
}) {
  const visibleGroups = filter.side ? groups.filter((g) => g.side === filter.side) : groups;
  return (
    <div className="flex flex-col gap-4">
      <nav aria-label="Lọc theo bên" className={rowClass}>
        <Chip href={guestsHref({})} active={!filter.side && !filter.groupId}>
          Tất cả
        </Chip>
        {sides.map((s) => (
          <Chip
            key={s}
            href={guestsHref({
              side: s,
              // Keep the group only if it belongs to the chosen side, else the result is always empty.
              groupId:
                groups.find((g) => g.id === filter.groupId)?.side === s
                  ? filter.groupId
                  : undefined,
            })}
            active={filter.side === s}
          >
            {sideLabels[s]}
          </Chip>
        ))}
      </nav>

      {visibleGroups.length > 0 ? (
        <nav aria-label="Lọc theo nhóm" className={rowClass}>
          {visibleGroups.map((g) => (
            <Chip
              key={g.id}
              href={guestsHref({
                side: filter.side,
                groupId: filter.groupId === g.id ? undefined : g.id,
              })}
              active={filter.groupId === g.id}
            >
              {filter.side ? g.name : `${g.name} · ${sideLabels[g.side]}`}
            </Chip>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
