import { z } from "zod";
import { checklistItems } from "@/data/checklist";
import { isValidDate, todayInVietnam } from "@/lib/checklist-schedule";

/**
 * Local-only state of the public checklist tool: wedding date + ticked item ids, kept in
 * localStorage on this device. Nothing is sent anywhere.
 *
 * Exposed as an external store for `useSyncExternalStore`: every row subscribes on its own,
 * so the page needs no context provider and the server render stays a plain list.
 */

export const STORAGE_KEY = "henuoc:checklist:v1";

export interface ChecklistState {
  weddingDate: string | null;
  done: readonly string[];
}

export const emptyChecklistState: ChecklistState = Object.freeze({
  weddingDate: null,
  done: Object.freeze([]),
});

const storedSchema = z.object({
  weddingDate: z.string().nullish(),
  done: z.array(z.string()).optional(),
});

const knownIds: ReadonlySet<string> = new Set(checklistItems.map((i) => i.id));

/** Parse whatever is in storage; anything malformed falls back to the empty state. */
export function parseChecklistState(raw: string | null): ChecklistState {
  if (!raw) return emptyChecklistState;
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return emptyChecklistState;
  }
  const parsed = storedSchema.safeParse(json);
  if (!parsed.success) return emptyChecklistState;
  const { weddingDate, done = [] } = parsed.data;
  return {
    weddingDate: weddingDate && isValidDate(weddingDate) ? weddingDate : null,
    // drop ids removed from the template and duplicates
    done: [...new Set(done.filter((id) => knownIds.has(id)))],
  };
}

let current: ChecklistState | null = null;
const listeners = new Set<() => void>();

function readStorage(): ChecklistState {
  try {
    return parseChecklistState(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    // storage disabled (private mode, blocked cookies) → in-memory only
    return emptyChecklistState;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function write(next: ChecklistState) {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // keep working in memory
  }
  emit();
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  current = readStorage();
  emit();
}

export function subscribeChecklist(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

/** Must return the same object until something changes, or React re-renders forever. */
export function getChecklistSnapshot(): ChecklistState {
  current ??= readStorage();
  return current;
}

/** Server + hydration render: nothing chosen yet, so server HTML and first client render match. */
export function getChecklistServerSnapshot(): ChecklistState {
  return emptyChecklistState;
}

export function setWeddingDate(date: string) {
  const state = getChecklistSnapshot();
  write({ ...state, weddingDate: isValidDate(date) ? date : null });
}

export function toggleDone(id: string, done: boolean) {
  if (!knownIds.has(id)) return;
  const state = getChecklistSnapshot();
  const rest = state.done.filter((d) => d !== id);
  write({ ...state, done: done ? [...rest, id] : rest });
}

export function resetChecklist() {
  write(emptyChecklistState);
}

// Known limitation: "today" is read once per render and not re-read at midnight; a page left
// open overnight shows yesterday's countdown until the next interaction re-renders it.
const noopSubscribe = () => () => {};

export const todayStore = {
  subscribe: noopSubscribe,
  // A string is compared by value, so a fresh call each render is a stable snapshot.
  getSnapshot: () => todayInVietnam(),
  getServerSnapshot: (): string | null => null,
};

/** "2027-03-15" → "15/03/2027". */
export function formatVnDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}
