import "server-only";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * /admin has NO auth yet, so it must not exist in production. Call this at the top of the admin
 * layout AND every admin page: a layout check alone is not enough, because layouts are not
 * re-rendered on every client navigation and pages can be rendered/prefetched on their own.
 * Remove only once a server-side `session.user.role === "ADMIN"` check replaces it.
 */
export function assertAdminPreview(): void {
  if (process.env.NODE_ENV === "production") notFound();
}

/** Admin pages are never indexed and never listed in the SEO registry or sitemap. */
export function adminMetadata(title: string): Metadata {
  return { title: `${title} · Quản trị`, robots: { index: false, follow: false } };
}
