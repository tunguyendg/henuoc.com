import { describe, expect, it } from "vitest";
import { LIMITS, isoToVnLocal, localToDateLabel, validate, type EditorValues } from "./draft";

const valid: EditorValues = {
  themeSlug: "x",
  brideName: "Minh Anh",
  groomName: "Hoàng Nam",
  brideShortName: "",
  groomShortName: "",
  brideFirst: true,
  brideParents: "",
  groomParents: "",
  inviteMessage: "",
  events: [{ id: "e", title: "Tiệc", startsAtLocal: "", venue: "", address: "" }],
};

describe("isoToVnLocal", () => {
  it("converts UTC to Vietnam time", () => {
    expect(isoToVnLocal("2027-10-17T11:00:00.000Z")).toBe("2027-10-17T18:00");
  });

  it("crosses the date line: 20:00Z is already the next day in Vietnam", () => {
    expect(isoToVnLocal("2027-10-16T20:00:00.000Z")).toBe("2027-10-17T03:00");
  });

  it("returns empty string for an invalid ISO", () => {
    expect(isoToVnLocal("not-a-date")).toBe("");
  });
});

describe("localToDateLabel", () => {
  it("formats a local value and rejects empty/garbage", () => {
    expect(localToDateLabel("2027-10-17T18:00")).toBe("17 · 10 · 2027");
    expect(localToDateLabel("")).toBeUndefined();
  });
});

describe("validate", () => {
  it("accepts valid values", () => {
    expect(validate(valid)).toEqual({});
  });

  it("rejects empty (whitespace) required names", () => {
    const e = validate({ ...valid, brideName: "   ", groomName: "" });
    expect(e.brideName).toBeDefined();
    expect(e.groomName).toBeDefined();
  });

  it("rejects values over the max length, accepts exactly the max", () => {
    expect(validate({ ...valid, brideName: "a".repeat(LIMITS.name) })).toEqual({});
    const e = validate({
      ...valid,
      brideName: "a".repeat(LIMITS.name + 1),
      inviteMessage: "b".repeat(LIMITS.message + 1),
      events: [{ ...valid.events[0]!, venue: "c".repeat(LIMITS.venue + 1) }],
    });
    expect(e.brideName).toBeDefined();
    expect(e.inviteMessage).toBeDefined();
    expect(e["venue-0"]).toBeDefined();
  });
});
