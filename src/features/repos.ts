import "server-only";
import { mockGuestRepo } from "./guest/mock-repo";
import type { GuestRepo } from "./guest/repo";
import { mockRsvpRepo } from "./rsvp/mock-repo";
import type { RsvpRepo } from "./rsvp/repo";
import { mockShoppingRepo } from "./shopping/mock-repo";
import type { ShoppingRepo } from "./shopping/repo";
import { mockWeddingRepo } from "./wedding/mock-repo";
import type { WeddingRepo } from "./wedding/repo";

// The ONE place that decides which implementation the dashboard uses.
// UI/server components import `repos` and the DTO types only — never a *-repo.ts file directly.
//
// Switching to the database later (per feature, one at a time):
//   1. write features/<name>/prisma-repo.ts exporting e.g. `prismaGuestRepo: GuestRepo`
//      (every query filtered by weddingId);
//   2. change that one import + property below. `satisfies` makes tsc fail if the new
//      implementation does not match the interface, so the UI keeps compiling unchanged.
//
// Ownership check (session ↔ WeddingMember) là BẮT BUỘC trước khi dùng bản Prisma — vị trí (service
// hay repo) Tony sẽ chốt, xem docs/STATUS.md. Until then a weddingId from the client is NOT trusted.
//
// `server-only`: importing this from a "use client" file is a build error, so repo code (and later
// Prisma + secrets) can never end up in the browser bundle.
export const repos = {
  wedding: mockWeddingRepo,
  guest: mockGuestRepo,
  rsvp: mockRsvpRepo,
  shopping: mockShoppingRepo,
} satisfies {
  wedding: WeddingRepo;
  guest: GuestRepo;
  rsvp: RsvpRepo;
  shopping: ShoppingRepo;
};
