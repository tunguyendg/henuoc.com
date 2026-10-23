import { z } from "zod";

// One RSVP schema for the client form AND (later) /api/rsvp. The server must build it from the
// invitation in the DB, never from values the client sent.

export const RSVP_MESSAGE_MAX = 500;

export type RsvpStatus = "ATTENDING" | "DECLINED";

export interface RsvpContext {
  maxAttendees: number;
  invitedEventIds: readonly string[];
}

/** Normalized answer: DECLINED always has attendeeCount 0 and no events. */
export interface RsvpAnswer {
  status: RsvpStatus;
  attendeeCount: number;
  eventIds: string[];
  message?: string;
}

/** Form state before validation (status not chosen yet). */
export interface RsvpValues {
  status: RsvpStatus | null;
  attendeeCount: number;
  eventIds: string[];
  message: string;
}

export type RsvpField = "status" | "attendeeCount" | "eventIds" | "message";
export type RsvpErrors = Partial<Record<RsvpField, string>>;

export function createRsvpSchema(ctx: RsvpContext) {
  const max = Math.max(1, Math.floor(ctx.maxAttendees));
  const invited = new Set(ctx.invitedEventIds);

  return z
    .object({
      status: z.enum(["ATTENDING", "DECLINED"], { error: "Bạn chọn giúp sẽ đến hay không nhé." }),
      attendeeCount: z.number({ error: "Số người không hợp lệ." }).int("Số người không hợp lệ."),
      eventIds: z.array(z.string().max(64)).max(invited.size),
      message: z
        .string()
        .trim()
        .max(RSVP_MESSAGE_MAX, `Lời nhắn tối đa ${RSVP_MESSAGE_MAX} ký tự.`)
        .optional(),
    })
    .superRefine((value, issue) => {
      if (value.eventIds.some((id) => !invited.has(id))) {
        issue.addIssue({
          code: "custom",
          path: ["eventIds"],
          message: "Có sự kiện không nằm trong lời mời.",
        });
      }
      if (value.status !== "ATTENDING") return;
      if (value.attendeeCount < 1 || value.attendeeCount > max) {
        issue.addIssue({
          code: "custom",
          path: ["attendeeCount"],
          message: max === 1 ? "Lời mời dành cho 1 người." : `Số người từ 1 đến ${max}.`,
        });
      }
      if (invited.size > 0 && value.eventIds.length === 0) {
        issue.addIssue({
          code: "custom",
          path: ["eventIds"],
          message: "Chọn ít nhất một sự kiện bạn sẽ đến.",
        });
      }
    })
    .transform((value): RsvpAnswer =>
      value.status === "DECLINED"
        ? {
            status: "DECLINED",
            attendeeCount: 0,
            eventIds: [],
            message: value.message || undefined,
          }
        : {
            status: "ATTENDING",
            attendeeCount: value.attendeeCount,
            eventIds: [...new Set(value.eventIds)],
            message: value.message || undefined,
          },
    );
}

/** Validate form values → either the normalized answer or one Vietnamese message per field. */
export function validateRsvp(
  values: RsvpValues,
  ctx: RsvpContext,
): { ok: true; data: RsvpAnswer } | { ok: false; errors: RsvpErrors } {
  const result = createRsvpSchema(ctx).safeParse({
    ...values,
    status: values.status ?? undefined,
  });
  if (result.success) return { ok: true, data: result.data };
  const errors: RsvpErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (
      (field === "status" ||
        field === "attendeeCount" ||
        field === "eventIds" ||
        field === "message") &&
      !errors[field]
    ) {
      errors[field] = issue.message;
    }
  }
  return { ok: false, errors };
}

/** Starting values: previous answer if any (clamped to the current limits), else all invited events. */
export function initialRsvpValues(ctx: RsvpContext, previous?: RsvpAnswer): RsvpValues {
  const max = Math.max(1, Math.floor(ctx.maxAttendees));
  if (!previous) {
    return { status: null, attendeeCount: 1, eventIds: [...ctx.invitedEventIds], message: "" };
  }
  const eventIds = previous.eventIds.filter((id) => ctx.invitedEventIds.includes(id));
  return {
    status: previous.status,
    attendeeCount: Math.min(max, Math.max(1, previous.attendeeCount)),
    eventIds:
      previous.status === "DECLINED" || eventIds.length === 0 ? [...ctx.invitedEventIds] : eventIds,
    message: previous.message ?? "",
  };
}
