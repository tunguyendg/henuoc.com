"use server";

import { z } from "zod";
import { repos } from "@/features/repos";

// Safe-looking ids only: short, no slashes/spaces/dots. Shape check, NOT an ownership check.
const guestIdSchema = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);

const GENERIC_ERROR = "Không tạo được link";

export type InviteLinkResult = { ok: true; link: string } | { ok: false; error: string };

/**
 * Returns the personal invite link of ONE guest (relative path; the client adds the origin).
 *
 * A Server Action is a public POST endpoint even if the page that renders the button is gated, so
 * it must defend itself:
 *  1. Dashboard has no auth yet → refuse in production.
 *  2. Validate the input with Zod.
 *  3. weddingId is resolved on the SERVER; the client never sends it.
 *
 * TODO(auth): replace step 1 + 3 with session + ownership check (session user ↔ WeddingMember) once
 * the IDOR decision in docs/STATUS.md is made. Never log the returned link (it holds a secret token).
 */
export async function getInviteLinkAction(guestId: string): Promise<InviteLinkResult> {
  if (process.env.NODE_ENV === "production") return { ok: false, error: GENERIC_ERROR };

  const parsed = guestIdSchema.safeParse(guestId);
  if (!parsed.success) return { ok: false, error: GENERIC_ERROR };

  try {
    const wedding = await repos.wedding.getCurrentWedding();
    const link = await repos.guest.getInviteLink(wedding.id, parsed.data);
    return { ok: true, link };
  } catch {
    // NotFoundError (unknown, foreign or revoked guest) and any other failure look the same to the
    // caller, so ids cannot be probed. Nothing is logged: the error text could hold ids.
    return { ok: false, error: GENERIC_ERROR };
  }
}
