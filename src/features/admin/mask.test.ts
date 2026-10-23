import { describe, expect, it } from "vitest";
import { maskEmail } from "./mask";

describe("maskEmail", () => {
  it("masks valid emails and handles missing @", () => {
    expect(maskEmail("minhanh@gmail.com")).toBe("mi***@gmail.com");
    expect(maskEmail("qv@example.net")).toBe("q***@example.net");
    expect(maskEmail("khong-hop-le")).toBe("***");
    expect(maskEmail("a@example.com")).toBe("***@example.com");
    expect(maskEmail("abc@example.com")).toBe("ab***@example.com");
    expect(maskEmail("@example.com")).toBe("***");
    expect(maskEmail("a@b@example.com")).toBe("a@***@example.com");
  });
});
