import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultThemeSlug, isCreatableTheme, resolveThemeSlug } from "./theme-choice";

describe("isCreatableTheme", () => {
  it("mẫu live có code trong registry thì dùng được", () => {
    expect(isCreatableTheme("blush-rose")).toBe(true);
  });

  it.each([
    ["planned", "royal-gold"],
    ["preview", "song-hy-do-son"],
    ["lạ", "mau-khac"],
  ])("mẫu %s (%s) thì không dùng được", (_ten, slug) => {
    expect(isCreatableTheme(slug)).toBe(false);
  });
});

describe("mẫu live nhưng registry không có code render", () => {
  afterEach(() => {
    vi.doUnmock("@/themes/registry");
    vi.resetModules();
  });

  it("thì không dùng được và không có mẫu mặc định", async () => {
    vi.resetModules();
    vi.doMock("@/themes/registry", () => ({ getThemeEntry: () => undefined }));
    const mod = await import("./theme-choice");
    expect(mod.isCreatableTheme("blush-rose")).toBe(false);
    expect(mod.defaultThemeSlug()).toBeUndefined();
    expect(mod.resolveThemeSlug(undefined)).toBeNull();
  });
});

describe("defaultThemeSlug", () => {
  it("là mẫu live đầu tiên: blush-rose", () => {
    expect(defaultThemeSlug()).toBe("blush-rose");
  });
});

describe("resolveThemeSlug", () => {
  it.each([
    ["không gửi mẫu", undefined],
    ["gửi chuỗi rỗng", ""],
    ["gửi blush-rose", "blush-rose"],
  ])("%s thì ra blush-rose", (_ten, raw) => {
    expect(resolveThemeSlug(raw)).toBe("blush-rose");
  });

  it.each(["royal-gold", "mau-khac", "../x"])(
    "gửi mẫu không dùng được (%s) thì ra null, không tự đổi sang mẫu khác",
    (raw) => {
      expect(resolveThemeSlug(raw)).toBeNull();
    },
  );
});
