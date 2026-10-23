import { afterEach, describe, expect, it, vi } from "vitest";

// "server-only" only means something inside Next's bundler → empty module in tests
vi.mock("server-only", () => ({}));

afterEach(() => vi.unstubAllEnvs());

const searchParams = Promise.resolve({});
const NOT_FOUND = { digest: expect.stringMatching(/^NEXT_HTTP_ERROR_FALLBACK;404/) };

// Every dashboard entry that can reach `repos` must refuse in production BEFORE touching data:
// the layout's notFound() does not stop a page's <Suspense> content from streaming (data leak).
describe("dashboard production guard", () => {
  const pages: [string, () => Promise<{ default: (props: never) => unknown }>][] = [
    ["overview", () => import("@/app/(app)/dashboard/page")],
    ["rsvp", () => import("@/app/(app)/dashboard/rsvp/page")],
    ["mua-sam", () => import("@/app/(app)/dashboard/mua-sam/page")],
    ["khach-moi", () => import("@/app/(app)/dashboard/khach-moi/page")],
    ["thiep", () => import("@/app/(app)/dashboard/thiep/page")],
  ];

  it.each(pages)("page %s throws notFound in production", async (_name, load) => {
    vi.stubEnv("NODE_ENV", "production");
    const { default: Page } = await load();
    expect(() => Page({ searchParams } as never)).toThrow(expect.objectContaining(NOT_FOUND));
  });

  it("assertDashboardPreview is a no-op outside production", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { assertDashboardPreview } = await import("./preview-guard");
    expect(() => assertDashboardPreview()).not.toThrow();
  });

  const sections: [string, () => Promise<unknown>][] = [
    [
      "OverviewContent",
      async () => (await import("./overview/overview-content")).OverviewContent(),
    ],
    [
      "RsvpContent",
      async () => (await import("./rsvp/rsvp-content")).RsvpContent({ searchParams }),
    ],
    [
      "ShoppingContent",
      async () => (await import("./shopping/shopping-content")).ShoppingContent({ searchParams }),
    ],
    [
      "GuestsSection",
      async () => (await import("./guests/guests-section")).GuestsSection({ searchParams }),
    ],
    ["EditorSection", async () => (await import("./card/editor-section")).EditorSection()],
  ];

  it.each(sections)("%s rejects with notFound in production", async (_name, run) => {
    vi.stubEnv("NODE_ENV", "production");
    await expect(run()).rejects.toMatchObject(NOT_FOUND);
  });
});
