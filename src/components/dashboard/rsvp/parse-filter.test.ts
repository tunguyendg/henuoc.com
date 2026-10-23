import { describe, expect, it } from "vitest";
import { parseRsvpFilter } from "./parse-filter";

describe("parseRsvpFilter", () => {
  it("accepts known values", () => {
    expect(parseRsvpFilter({ status: "ATTENDING", event: "e1" }, ["e1", "e2"])).toEqual({
      status: "ATTENDING",
      eventId: "e1",
    });
  });

  it("ignores unknown values and takes the first of repeated params", () => {
    expect(parseRsvpFilter({ status: "HACK", event: "zzz" }, ["e1"])).toEqual({
      status: undefined,
      eventId: undefined,
    });
    expect(parseRsvpFilter({ status: ["DECLINED", "x"] }, [])).toEqual({
      status: "DECLINED",
      eventId: undefined,
    });
  });
});
