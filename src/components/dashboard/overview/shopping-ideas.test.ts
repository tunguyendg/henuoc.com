import { describe, expect, it } from "vitest";
import type { ProductCategory, ProductView } from "@/features/shopping/types";
import { pickIdeas } from "./shopping-ideas";

const p = (id: string, category: ProductCategory): ProductView => ({ id, name: id, category });

describe("pickIdeas", () => {
  it("takes one product per category, max 3, keeping order", () => {
    const out = pickIdeas([
      p("a", "gia-tien"),
      p("b", "gia-tien"),
      p("c", "an-hoi"),
      p("d", "co-dau"),
      p("e", "trang-tri"),
    ]);
    expect(out.map((x) => x.id)).toEqual(["a", "c", "d"]);
  });

  it("handles fewer categories than max and empty input", () => {
    expect(pickIdeas([p("a", "gia-tien"), p("b", "gia-tien")])).toHaveLength(1);
    expect(pickIdeas([])).toEqual([]);
  });
});
