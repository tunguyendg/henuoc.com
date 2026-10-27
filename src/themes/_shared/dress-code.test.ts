import { describe, expect, it } from "vitest";
import { dressCodeSchema } from "./dress-code";
import { optionsSchema } from "../placeholder/manifest";

describe("dress code", () => {
  it("accepts one to five full RGB hex colors, preserving case and order", () => {
    for (const colors of [["#FFFFFF"], ["#E8436A", "#f6c76b", "#123456", "#abcdef", "#000000"]]) {
      expect(dressCodeSchema.parse(colors)).toEqual(colors);
      expect(optionsSchema.parse({ dressCode: colors }).dressCode).toEqual(colors);
    }
  });
  it.each(
    [
      [],
      Array(6).fill("#ffffff"),
      ["#fff"],
      ["ffffff"],
      ["#12345678"],
      ["#GGGGGG"],
      ["red"],
      [" #FFFFFF"],
      [null],
      "#FFFFFF",
    ].map((input) => [input]),
  )("rejects invalid palette %j", (input) => {
    expect(dressCodeSchema.safeParse(input).success).toBe(false);
    expect(optionsSchema.safeParse({ dressCode: input }).success).toBe(false);
  });
  it("keeps dress code optional for existing theme options", () => {
    expect(optionsSchema.safeParse({}).success).toBe(true);
    expect(optionsSchema.safeParse({ musicSlug: "canon-in-d-usaf" }).success).toBe(true);
  });
});
