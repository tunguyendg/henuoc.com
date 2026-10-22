import { describe, expect, it } from "vitest";
import { dashboardNav, isNavItemActive } from "./nav-items";

describe("isNavItemActive", () => {
  it("matches /dashboard only on the overview page", () => {
    expect(isNavItemActive("/dashboard", "/dashboard")).toBe(true);
    expect(isNavItemActive("/dashboard/rsvp", "/dashboard")).toBe(false);
  });

  it("matches sub-pages but not look-alike prefixes", () => {
    expect(isNavItemActive("/dashboard/khach-moi", "/dashboard/khach-moi")).toBe(true);
    expect(isNavItemActive("/dashboard/khach-moi/abc", "/dashboard/khach-moi")).toBe(true);
    expect(isNavItemActive("/dashboard/khach-moi-cu", "/dashboard/khach-moi")).toBe(false);
  });
});

describe("dashboardNav", () => {
  it("fits the mobile tab bar: 4 tabs + the 'Thêm' slot", () => {
    expect(dashboardNav.filter((i) => i.mobile === "tab")).toHaveLength(4);
  });

  it("has unique hrefs", () => {
    const hrefs = dashboardNav.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
