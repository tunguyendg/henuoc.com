// Mock-only helper: freezes sample data recursively so a stray mutation throws (strict mode)
// instead of silently corrupting the shared dataset for every later request/test.
export function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}
