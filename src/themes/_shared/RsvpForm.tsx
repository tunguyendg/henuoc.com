"use client";

import { Minus, Plus } from "lucide-react";
import { useId, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { EventView, ThemeProps } from "../types";
import { RSVP_MESSAGE_MAX, type RsvpAnswer, type RsvpStatus } from "./rsvp-schema";
import { useRsvpForm } from "./use-rsvp-form";

export type RsvpEventOption = Pick<EventView, "id" | "title" | "dateLabel" | "timeLabel">;

export interface RsvpFormProps {
  mode: ThemeProps["mode"];
  /** From GuestContext — pass these fields one by one, never the whole guest (it holds the token). */
  invitedEventIds: string[];
  maxAttendees: number;
  rsvp?: RsvpAnswer;
  /** Events to show as choices; filtered to invitedEventIds here. */
  events: RsvpEventOption[];
  className?: string;
}

const statusOptions: { value: RsvpStatus; label: string }[] = [
  { value: "ATTENDING", label: "Sẽ đến" },
  { value: "DECLINED", label: "Không đến được" },
];

const fieldError = "mt-2 text-sm text-danger";

export function RsvpForm({
  mode,
  invitedEventIds,
  maxAttendees,
  rsvp,
  events,
  className,
}: RsvpFormProps) {
  const form = useRsvpForm({ mode, invitedEventIds, maxAttendees, rsvp });
  const id = useId();
  const invitedEvents = events.filter((e) => invitedEventIds.includes(e.id));
  const max = Math.max(1, Math.floor(maxAttendees));
  const { values, errors } = form;
  const attending = values.status === "ATTENDING";
  const submitting = form.phase === "submitting";

  if (form.phase === "answered" && form.answer) {
    const answer = form.answer;
    const chosen = invitedEvents.filter((e) => answer.eventIds.includes(e.id));
    return (
      <div
        className={cn(
          "flex flex-col gap-4 rounded-(--radius-card) border border-border bg-surface p-6",
          className,
        )}
      >
        <p role="status" className="font-semibold">
          {form.justSubmitted ? "Cảm ơn bạn đã phản hồi!" : "Bạn đã phản hồi lời mời"}
        </p>
        <dl className="flex flex-col gap-2 text-sm">
          <div>
            <dt className="text-muted">Trả lời</dt>
            <dd className="font-medium">
              {answer.status === "ATTENDING"
                ? `Sẽ đến · ${answer.attendeeCount} người`
                : "Không đến được"}
            </dd>
          </div>
          {chosen.length > 0 && (
            <div>
              <dt className="text-muted">Sự kiện</dt>
              <dd className="font-medium">{chosen.map((e) => e.title).join(", ")}</dd>
            </div>
          )}
          {answer.message && (
            <div>
              <dt className="text-muted">Lời nhắn</dt>
              <dd className="break-words whitespace-pre-line">{answer.message}</dd>
            </div>
          )}
        </dl>
        <button
          type="button"
          onClick={form.edit}
          className="inline-flex min-h-11 items-center justify-center self-start rounded-(--radius-btn) border border-border bg-surface px-5 text-sm font-semibold text-ink transition-colors hover:border-rose-500 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          Sửa câu trả lời
        </button>
      </div>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void form.submit();
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-busy={submitting}
      className={cn(
        "flex flex-col gap-6 rounded-(--radius-card) border border-border bg-surface p-6",
        className,
      )}
    >
      <fieldset aria-describedby={errors.status ? `${id}-status-error` : undefined}>
        <legend className="mb-3 font-semibold">Bạn sẽ đến chứ?</legend>
        <div className="grid grid-cols-2 gap-2">
          {statusOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex min-h-12 cursor-pointer items-center justify-center rounded-(--radius-btn) border px-3 text-center text-sm font-semibold transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rose-600",
                values.status === option.value
                  ? "border-rose-600 bg-rose-50 text-rose-700"
                  : "border-border text-ink hover:border-rose-500",
              )}
            >
              <input
                type="radio"
                name={`${id}-status`}
                value={option.value}
                checked={values.status === option.value}
                onChange={() => form.setField("status", option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors.status && (
          <p id={`${id}-status-error`} className={fieldError}>
            {errors.status}
          </p>
        )}
      </fieldset>

      {attending && (
        <div>
          <p id={`${id}-count-label`} className="font-semibold">
            Số người
          </p>
          <p className="text-sm text-muted">
            {max === 1 ? "Lời mời dành cho 1 người." : `Tối đa ${max} người.`}
          </p>
          <div
            className="mt-3 flex items-center gap-3"
            role="group"
            aria-labelledby={`${id}-count-label`}
          >
            <StepButton
              label="Bớt 1 người"
              disabled={values.attendeeCount <= 1}
              onClick={() => form.setField("attendeeCount", Math.max(1, values.attendeeCount - 1))}
            >
              <Minus aria-hidden="true" />
            </StepButton>
            <output
              aria-live="polite"
              className="min-w-10 text-center text-xl font-semibold tabular-nums"
            >
              {values.attendeeCount}
            </output>
            <StepButton
              label="Thêm 1 người"
              disabled={values.attendeeCount >= max}
              onClick={() =>
                form.setField("attendeeCount", Math.min(max, values.attendeeCount + 1))
              }
            >
              <Plus aria-hidden="true" />
            </StepButton>
          </div>
          {errors.attendeeCount && <p className={fieldError}>{errors.attendeeCount}</p>}
        </div>
      )}

      {attending && invitedEvents.length > 1 && (
        <fieldset aria-describedby={errors.eventIds ? `${id}-events-error` : undefined}>
          <legend className="mb-3 font-semibold">Bạn sẽ dự</legend>
          <div className="flex flex-col gap-2">
            {invitedEvents.map((event) => (
              <label
                key={event.id}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-(--radius-btn) border border-border px-4 py-2 has-[:checked]:border-rose-600 has-[:checked]:bg-rose-50"
              >
                <input
                  type="checkbox"
                  checked={values.eventIds.includes(event.id)}
                  onChange={() => form.toggleEvent(event.id)}
                  className="size-5 shrink-0 accent-rose-600"
                />
                <span className="flex flex-col">
                  <span className="font-medium">{event.title}</span>
                  <span className="text-sm text-muted">
                    {event.timeLabel} · {event.dateLabel}
                  </span>
                </span>
              </label>
            ))}
          </div>
          {errors.eventIds && (
            <p id={`${id}-events-error`} className={fieldError}>
              {errors.eventIds}
            </p>
          )}
        </fieldset>
      )}

      <div>
        <label htmlFor={`${id}-message`} className="font-semibold">
          Lời nhắn <span className="font-normal text-muted">(không bắt buộc)</span>
        </label>
        <textarea
          id={`${id}-message`}
          value={values.message}
          onChange={(e) => form.setField("message", e.target.value)}
          maxLength={RSVP_MESSAGE_MAX + 50}
          rows={3}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={`${id}-message-count${errors.message ? ` ${id}-message-error` : ""}`}
          placeholder="Gửi lời chúc tới cô dâu chú rể…"
          className="mt-2 block w-full resize-y rounded-(--radius-btn) border border-border bg-surface px-4 py-3 text-base text-ink placeholder:text-muted focus:border-rose-500 focus:outline-none"
        />
        <p id={`${id}-message-count`} className="mt-1 text-right text-xs text-muted tabular-nums">
          {values.message.trim().length}/{RSVP_MESSAGE_MAX}
        </p>
        {errors.message && (
          <p id={`${id}-message-error`} className={fieldError}>
            {errors.message}
          </p>
        )}
      </div>

      {form.phase === "error" && (
        <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          Chưa gửi được. Bạn kiểm tra kết nối mạng rồi thử lại nhé.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={form.disabled || submitting}
          className="inline-flex min-h-12 items-center justify-center rounded-(--radius-btn) bg-rose-600 px-6 text-base font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:opacity-60"
        >
          {submitting ? "Đang gửi…" : "Gửi xác nhận"}
        </button>
        {form.disabled && (
          <p className="text-center text-sm text-muted">Đang xem trước, chưa gửi được xác nhận.</p>
        )}
      </div>
    </form>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-rose-500 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:opacity-40 [&_svg]:size-5"
    >
      {children}
    </button>
  );
}
