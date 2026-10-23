/** Shape of the `searchParams` object Next gives a page (repeated keys arrive as arrays). */
export type RawSearchParams = Record<string, string | string[] | undefined>;

/** First value of a possibly repeated query param; undefined when absent. */
export function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
