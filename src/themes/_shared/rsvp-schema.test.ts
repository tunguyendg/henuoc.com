import { describe, expect, it } from "vitest";
import {
  RSVP_MESSAGE_MAX,
  createRsvpSchema,
  initialRsvpValues,
  validateRsvp,
  type RsvpValues,
} from "./rsvp-schema";

const ctx = { maxAttendees: 3, invitedEventIds: ["vu-quy", "thanh-hon"] };

const attending: RsvpValues = {
  status: "ATTENDING",
  attendeeCount: 2,
  eventIds: ["thanh-hon"],
  message: "  Chúc mừng hai bạn!  ",
};

describe("createRsvpSchema", () => {
  it("accepts a valid ATTENDING answer and trims the message", () => {
    expect(createRsvpSchema(ctx).parse(attending)).toEqual({
      status: "ATTENDING",
      attendeeCount: 2,
      eventIds: ["thanh-hon"],
      message: "Chúc mừng hai bạn!",
    });
  });

  it("enforces 1..maxAttendees when ATTENDING", () => {
    const schema = createRsvpSchema(ctx);
    expect(schema.safeParse({ ...attending, attendeeCount: 0 }).success).toBe(false);
    expect(schema.safeParse({ ...attending, attendeeCount: 4 }).success).toBe(false);
    expect(schema.safeParse({ ...attending, attendeeCount: 1.5 }).success).toBe(false);
    expect(schema.safeParse({ ...attending, attendeeCount: 3 }).success).toBe(true);
  });

  it("requires eventIds ⊆ invitedEventIds", () => {
    const schema = createRsvpSchema(ctx);
    expect(schema.safeParse({ ...attending, eventIds: ["an-hoi"] }).success).toBe(false);
    expect(schema.safeParse({ ...attending, eventIds: ["vu-quy", "an-hoi"] }).success).toBe(false);
  });

  it("requires at least one event when attending", () => {
    expect(createRsvpSchema(ctx).safeParse({ ...attending, eventIds: [] }).success).toBe(false);
  });

  it("caps eventIds count and id length (abuse guard)", () => {
    const schema = createRsvpSchema(ctx);
    expect(
      schema.safeParse({ ...attending, eventIds: ["vu-quy", "thanh-hon", "vu-quy"] }).success,
    ).toBe(false);
    expect(schema.safeParse({ ...attending, eventIds: ["x".repeat(65)] }).success).toBe(false);
  });

  it("dedupes eventIds", () => {
    const data = createRsvpSchema(ctx).parse({ ...attending, eventIds: ["vu-quy", "vu-quy"] });
    expect(data.eventIds).toEqual(["vu-quy"]);
  });

  it("normalizes DECLINED to 0 people and no events", () => {
    expect(
      createRsvpSchema(ctx).parse({
        status: "DECLINED",
        attendeeCount: 9,
        eventIds: [],
        message: "",
      }),
    ).toEqual({ status: "DECLINED", attendeeCount: 0, eventIds: [], message: undefined });
  });

  it("limits the trimmed message to 500 characters", () => {
    const schema = createRsvpSchema(ctx);
    const ok = " " + "a".repeat(RSVP_MESSAGE_MAX) + " ";
    expect(schema.safeParse({ ...attending, message: ok }).success).toBe(true);
    expect(
      schema.safeParse({ ...attending, message: "a".repeat(RSVP_MESSAGE_MAX + 1) }).success,
    ).toBe(false);
  });

  it("rejects an unknown status", () => {
    expect(createRsvpSchema(ctx).safeParse({ ...attending, status: "MAYBE" }).success).toBe(false);
  });
});

describe("validateRsvp", () => {
  it("returns Vietnamese per-field errors", () => {
    const result = validateRsvp({ ...attending, status: null }, ctx);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.status).toMatch(/sẽ đến/);

    const tooMany = validateRsvp({ ...attending, attendeeCount: 5 }, ctx);
    if (tooMany.ok) throw new Error("expected errors");
    expect(tooMany.errors.attendeeCount).toBe("Số người từ 1 đến 3.");
  });

  it("returns the normalized data when valid", () => {
    const result = validateRsvp(attending, ctx);
    expect(result).toMatchObject({ ok: true, data: { attendeeCount: 2 } });
  });
});

describe("initialRsvpValues", () => {
  it("starts empty with every invited event selected", () => {
    expect(initialRsvpValues(ctx)).toEqual({
      status: null,
      attendeeCount: 1,
      eventIds: ["vu-quy", "thanh-hon"],
      message: "",
    });
  });

  it("restores a previous answer, clamped to the current limits", () => {
    expect(
      initialRsvpValues(ctx, {
        status: "ATTENDING",
        attendeeCount: 7,
        eventIds: ["thanh-hon", "removed-event"],
        message: "Hẹn gặp",
      }),
    ).toEqual({
      status: "ATTENDING",
      attendeeCount: 3,
      eventIds: ["thanh-hon"],
      message: "Hẹn gặp",
    });
  });
});
