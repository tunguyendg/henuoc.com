import { describe, expect, it } from "vitest";
import { createScrollLock } from "./scroll-lock";

describe("createScrollLock", () => {
  it("locks once and restores the previous value after the last release", () => {
    const body = { style: { overflow: "auto" } };
    const lock = createScrollLock(() => body);
    const releaseA = lock();
    const releaseB = lock();
    expect(body.style.overflow).toBe("hidden");
    releaseA();
    expect(body.style.overflow).toBe("hidden");
    releaseA(); // double release is ignored
    expect(body.style.overflow).toBe("hidden");
    releaseB();
    expect(body.style.overflow).toBe("auto");
  });

  it("is a no-op without a target", () => {
    const lock = createScrollLock(() => undefined);
    expect(() => lock()()).not.toThrow();
  });
});
