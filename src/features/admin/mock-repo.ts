import "server-only";
import { themes } from "@/data/themes";
import { mockInvitationRows } from "../guest/mock-repo";
import { deepFreeze } from "../mock-freeze";
import {
  findMockWedding,
  MOCK_OTHER_WEDDING_ID,
  MOCK_WEDDING_ID,
  type MockWeddingRow,
} from "../wedding/mock-repo";
import { maskEmail } from "./mask";
import type { AdminRepo } from "./repo";
import type {
  AdminThemeSummary,
  AdminUserSummary,
  AdminWeddingSummary,
  Plan,
  UserRole,
  WeddingStatus,
} from "./types";

// SAMPLE DATA ONLY — every user, couple and email below is fictional (example.com domains).
// Static on purpose: no Date.now()/new Date(), so renders and tests are deterministic.
// The first two weddings are derived from the dashboard's sample weddings (wedding/mock-repo.ts),
// so /admin and /dashboard show the same couple. Rows are shaped like DB rows (full email,
// ownerId…); the repo maps them to DTOs field by field, like the future Prisma repo will.

interface MockUserRow {
  id: string;
  name: string;
  email: string; // full email stays inside this file — DTOs only get emailMasked
  role: UserRole;
  createdAt: string;
}

interface MockAdminWeddingRow {
  id: string;
  slug: string;
  coupleNames: string;
  weddingDate?: string;
  status: WeddingStatus;
  plan: Plan;
  themeSlug: string;
  ownerId: string;
  guestCount: number;
  createdAt: string;
}

const OWNER_OF_DEMO = "demo-user-1";

const mockUserRows: readonly MockUserRow[] = deepFreeze([
  {
    id: OWNER_OF_DEMO,
    name: "Nguyễn Minh Anh",
    email: "minhanh.demo@example.com",
    role: "USER",
    createdAt: "2026-06-02T03:15:00.000Z",
  },
  {
    id: "demo-user-2",
    name: "Lê Thu Hà",
    email: "thuha.demo@example.com",
    role: "USER",
    createdAt: "2026-06-20T08:40:00.000Z",
  },
  {
    id: "demo-user-3",
    name: "Võ Thanh Tâm",
    email: "thanhtam.demo@example.net",
    role: "USER",
    createdAt: "2026-07-05T12:00:00.000Z",
  },
  {
    id: "demo-user-4",
    name: "Đặng Bảo Ngọc",
    email: "baongoc.demo@example.com",
    role: "USER",
    createdAt: "2026-07-18T01:30:00.000Z",
  },
  {
    id: "demo-user-5",
    name: "Huỳnh Gia Huy",
    email: "giahuy.demo@example.org",
    role: "USER",
    createdAt: "2026-08-09T14:05:00.000Z",
  },
  {
    id: "demo-user-6",
    name: "Phan Khánh Linh",
    email: "khanhlinh.demo@example.com",
    role: "USER",
    createdAt: "2026-08-27T09:20:00.000Z",
  },
  {
    id: "demo-user-7",
    name: "Bùi Quốc Việt",
    email: "qv@example.net",
    role: "USER",
    createdAt: "2026-09-14T06:45:00.000Z",
  },
  {
    id: "demo-user-admin",
    name: "Quản trị viên (mẫu)",
    email: "admin.demo@example.com",
    role: "ADMIN",
    createdAt: "2026-05-01T00:00:00.000Z",
  },
]);

function coupleNamesOf(w: MockWeddingRow): string {
  const bride = w.brideShortName ?? w.brideName;
  const groom = w.groomShortName ?? w.groomName;
  return w.brideFirst ? `${bride} & ${groom}` : `${groom} & ${bride}`;
}

function fromDashboardWedding(
  weddingId: string,
  ownerId: string,
  createdAt: string,
): MockAdminWeddingRow[] {
  const w = findMockWedding(weddingId);
  if (!w) return [];
  return [
    {
      id: w.id,
      slug: w.slug,
      coupleNames: coupleNamesOf(w),
      weddingDate: w.weddingDate,
      status: w.status,
      plan: w.plan,
      themeSlug: w.themeSlug,
      ownerId,
      guestCount: mockInvitationRows.filter((i) => i.weddingId === w.id).length,
      createdAt,
    },
  ];
}

const mockAdminWeddingRows: readonly MockAdminWeddingRow[] = deepFreeze([
  ...fromDashboardWedding(MOCK_WEDDING_ID, OWNER_OF_DEMO, "2026-06-02T03:30:00.000Z"),
  ...fromDashboardWedding(MOCK_OTHER_WEDDING_ID, "demo-user-2", "2026-06-20T09:00:00.000Z"),
  {
    id: "demo-wedding-3",
    slug: "thanhtam-mylinh",
    coupleNames: "Thanh Tâm & Mỹ Linh",
    weddingDate: "2026-12-12T10:00:00.000Z",
    status: "PUBLISHED",
    plan: "PREMIUM",
    themeSlug: "modern-editorial",
    ownerId: "demo-user-3",
    guestCount: 120,
    createdAt: "2026-07-05T12:20:00.000Z",
  },
  {
    id: "demo-wedding-4",
    slug: "baongoc-ducanh",
    coupleNames: "Bảo Ngọc & Đức Anh",
    weddingDate: "2027-01-09T10:30:00.000Z",
    status: "PUBLISHED",
    plan: "FREE",
    themeSlug: "blush-rose",
    ownerId: "demo-user-4",
    guestCount: 64,
    createdAt: "2026-07-18T02:00:00.000Z",
  },
  {
    id: "demo-wedding-5",
    slug: "giahuy-phuongthao",
    coupleNames: "Gia Huy & Phương Thảo",
    weddingDate: "2027-02-20T11:00:00.000Z",
    status: "DRAFT",
    plan: "PREMIUM",
    themeSlug: "seoul-romance",
    ownerId: "demo-user-5",
    guestCount: 15,
    createdAt: "2026-08-09T14:30:00.000Z",
  },
  {
    id: "demo-wedding-6",
    slug: "khanhlinh-minhquan",
    coupleNames: "Khánh Linh & Minh Quân",
    weddingDate: "2027-03-14T10:00:00.000Z",
    status: "DRAFT",
    plan: "FREE",
    themeSlug: "song-hy-do-son",
    ownerId: "demo-user-6",
    guestCount: 0,
    createdAt: "2026-08-27T09:40:00.000Z",
  },
  {
    id: "demo-wedding-7",
    slug: "quocviet-ngocmai",
    coupleNames: "Quốc Việt & Ngọc Mai",
    status: "DRAFT",
    plan: "FREE",
    themeSlug: "botanical-garden",
    ownerId: "demo-user-7",
    guestCount: 0,
    createdAt: "2026-09-14T07:00:00.000Z",
  },
  {
    id: "demo-wedding-8",
    slug: "thanhtam-mylinh-lequy",
    coupleNames: "Thanh Tâm & Mỹ Linh (lễ quê)",
    weddingDate: "2026-12-05T02:00:00.000Z",
    status: "PUBLISHED",
    plan: "PREMIUM",
    themeSlug: "song-hy-do-son",
    ownerId: "demo-user-3",
    guestCount: 85,
    createdAt: "2026-07-06T03:10:00.000Z",
  },
  {
    id: "demo-wedding-9",
    slug: "vanhung-thuytien",
    coupleNames: "Văn Hùng & Thủy Tiên",
    weddingDate: "2026-04-18T10:00:00.000Z",
    status: "ARCHIVED",
    plan: "FREE",
    themeSlug: "sai-gon-xua",
    ownerId: "demo-user-4",
    guestCount: 42,
    createdAt: "2026-05-10T05:00:00.000Z",
  },
  {
    id: "demo-wedding-10",
    slug: "giahuy-phuongthao-tiec",
    coupleNames: "Gia Huy & Phương Thảo (tiệc)",
    weddingDate: "2027-02-21T11:00:00.000Z",
    status: "PUBLISHED",
    plan: "FREE",
    themeSlug: "blush-rose",
    ownerId: "demo-user-5",
    guestCount: 30,
    createdAt: "2026-08-10T04:00:00.000Z",
  },
]);

const newestFirst = (a: { createdAt: string }, b: { createdAt: string }) =>
  b.createdAt.localeCompare(a.createdAt);

function toUserSummary(u: MockUserRow): AdminUserSummary {
  return {
    id: u.id,
    displayName: u.name,
    emailMasked: maskEmail(u.email),
    createdAt: u.createdAt,
    weddingCount: mockAdminWeddingRows.filter((w) => w.ownerId === u.id).length,
    role: u.role,
  };
}

function toWeddingSummary(w: MockAdminWeddingRow): AdminWeddingSummary {
  return {
    id: w.id,
    slug: w.slug,
    coupleNames: w.coupleNames,
    weddingDate: w.weddingDate,
    status: w.status,
    plan: w.plan,
    themeSlug: w.themeSlug,
    ownerId: w.ownerId,
    guestCount: w.guestCount,
    createdAt: w.createdAt,
  };
}

function toThemeSummary(t: (typeof themes)[number]): AdminThemeSummary {
  return {
    slug: t.slug,
    name: t.name,
    tier: t.tier,
    // Default until admin toggles exist: only themes that passed QA ("published") are enabled.
    enabled: t.status === "published",
    weddingCount: mockAdminWeddingRows.filter((w) => w.themeSlug === t.slug).length,
  };
}

export const mockAdminRepo: AdminRepo = {
  async listUsers() {
    return mockUserRows.toSorted(newestFirst).map(toUserSummary);
  },

  async listWeddings(filter = {}) {
    const q = filter.q?.trim().toLowerCase();
    return mockAdminWeddingRows
      .filter(
        (w) =>
          (!filter.plan || w.plan === filter.plan) &&
          (!filter.status || w.status === filter.status) &&
          (!q || w.slug.toLowerCase().includes(q) || w.coupleNames.toLowerCase().includes(q)),
      )
      .toSorted(newestFirst)
      .map(toWeddingSummary);
  },

  async listThemes() {
    return themes.map(toThemeSummary);
  },

  async getStats() {
    return {
      users: mockUserRows.length,
      weddings: mockAdminWeddingRows.length,
      premiumWeddings: mockAdminWeddingRows.filter((w) => w.plan === "PREMIUM").length,
      publishedWeddings: mockAdminWeddingRows.filter((w) => w.status === "PUBLISHED").length,
    };
  },
};

export const mockAdminDataForTests = { mockUserRows, mockAdminWeddingRows };
