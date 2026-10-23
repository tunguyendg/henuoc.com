import "server-only";
import { notFound } from "next/navigation";

/**
 * Dashboard runs on mock data with no login yet → it must never be served in production.
 *
 * TEMPORARY, until proxy.ts + session + ownership check (session ↔ WeddingMember) exist.
 * Do NOT rely on layout.tsx to block: layout and page render in parallel, and a notFound() in the
 * layout does not stop a page's <Suspense> content from streaming into the RSC payload (data leak).
 * So call this as the FIRST line of every dashboard page AND of every async component that reads
 * `repos`, before any repo call.
 */
export function assertDashboardPreview(): void {
  if (process.env.NODE_ENV === "production") notFound();
}
