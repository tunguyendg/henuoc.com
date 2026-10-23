import { describe, expect, it, vi } from "vitest";

// "server-only" only means something inside Next's bundler → replace it with an empty module here
vi.mock("server-only", () => ({}));

const { repos } = await import("../repos");
const { mockAdminDataForTests } = await import("./mock-repo");
const { MOCK_WEDDING_ID } = await import("../wedding/mock-repo");

const FORBIDDEN_KEYS = new Set(["email", "phone", "token", "tokenHash", "tokenCipher"]);
const SENSITIVE_KEY = /token|cipher|hash|phone|^email$/i;

function collectKeys(value: unknown, keys: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => collectKeys(v, keys));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      keys.push(k);
      collectKeys(v, keys);
    }
  }
  return keys;
}

describe("admin repo", () => {
  it("getStats khớp với danh sách (đếm từ dữ liệu, không hằng số)", async () => {
    const [stats, users, weddings] = await Promise.all([
      repos.admin.getStats(),
      repos.admin.listUsers(),
      repos.admin.listWeddings(),
    ]);
    expect(stats).toEqual({
      users: users.length,
      weddings: weddings.length,
      premiumWeddings: weddings.filter((w) => w.plan === "PREMIUM").length,
      publishedWeddings: weddings.filter((w) => w.status === "PUBLISHED").length,
    });
    expect(users).toHaveLength(8);
    expect(weddings).toHaveLength(10);
    const totalOwned = users.reduce((n, u) => n + u.weddingCount, 0);
    expect(totalOwned).toBe(weddings.length);
  });

  it("wedding mẫu của dashboard có trong admin, khớp tên cặp đôi", async () => {
    const weddings = await repos.admin.listWeddings();
    const demo = weddings.find((w) => w.id === MOCK_WEDDING_ID);
    const current = await repos.wedding.getCurrentWedding();
    expect(demo).toMatchObject({
      slug: current.slug,
      coupleNames: current.coupleNames,
      plan: current.plan,
      status: current.status,
      guestCount: (await repos.guest.listGuests(MOCK_WEDDING_ID)).length,
    });
  });

  it("lọc theo plan, status, q (không phân biệt hoa thường) và kết hợp", async () => {
    const premium = await repos.admin.listWeddings({ plan: "PREMIUM" });
    expect(premium.length).toBeGreaterThan(0);
    expect(premium.every((w) => w.plan === "PREMIUM")).toBe(true);

    const drafts = await repos.admin.listWeddings({ status: "DRAFT" });
    expect(drafts.length).toBeGreaterThan(0);
    expect(drafts.every((w) => w.status === "DRAFT")).toBe(true);

    const q = await repos.admin.listWeddings({ q: "  MINH ANH " });
    expect(q.map((w) => w.id)).toEqual([MOCK_WEDDING_ID]);
    const bySlug = await repos.admin.listWeddings({ q: "giahuy" });
    expect(bySlug).toHaveLength(2);

    const combo = await repos.admin.listWeddings({ plan: "PREMIUM", status: "PUBLISHED" });
    expect(combo.every((w) => w.plan === "PREMIUM" && w.status === "PUBLISHED")).toBe(true);
    expect(await repos.admin.listWeddings({ q: "khong-co-ai" })).toEqual([]);
  });

  it("listThemes: lấy từ data/themes, weddingCount đếm từ wedding mẫu", async () => {
    const [list, weddings] = await Promise.all([
      repos.admin.listThemes(),
      repos.admin.listWeddings(),
    ]);
    expect(list.length).toBeGreaterThan(0);
    for (const t of list) {
      expect(t.weddingCount).toBe(weddings.filter((w) => w.themeSlug === t.slug).length);
    }
    expect(list.find((t) => t.slug === "hong-pastel")?.weddingCount).toBe(2);
  });

  it("không DTO nào có key email/phone/token/tokenHash/tokenCipher", async () => {
    const dtos = [
      await repos.admin.listUsers(),
      await repos.admin.listWeddings(),
      await repos.admin.listThemes(),
      await repos.admin.getStats(),
    ];
    const keys = collectKeys(dtos);
    expect(keys.filter((k) => FORBIDDEN_KEYS.has(k))).toEqual([]);
    expect(keys.filter((k) => SENSITIVE_KEY.test(k))).toEqual([]);
  });

  it("emailMasked không chứa email đầy đủ hay phần trước @", async () => {
    const users = await repos.admin.listUsers();
    const serialized = JSON.stringify(users);
    for (const row of mockAdminDataForTests.mockUserRows) {
      const local = row.email.split("@")[0]!;
      expect(serialized).not.toContain(row.email);
      expect(serialized).not.toContain(`${local}@`);
    }
    expect(users.every((u) => u.emailMasked.includes("***@"))).toBe(true);
  });

  it("dữ liệu gốc bị đóng băng; sửa kết quả không đổi dữ liệu gốc", async () => {
    const { mockUserRows, mockAdminWeddingRows } = mockAdminDataForTests;
    expect(Object.isFrozen(mockUserRows)).toBe(true);
    expect(Object.isFrozen(mockUserRows[0])).toBe(true);
    expect(Object.isFrozen(mockAdminWeddingRows)).toBe(true);
    expect(Object.isFrozen(mockAdminWeddingRows[0])).toBe(true);

    const weddings = await repos.admin.listWeddings();
    weddings[0]!.plan = weddings[0]!.plan === "FREE" ? "PREMIUM" : "FREE";
    const again = await repos.admin.listWeddings();
    expect(again[0]!.plan).not.toBe(weddings[0]!.plan);
  });
});
