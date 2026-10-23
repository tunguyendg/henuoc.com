import { useCallback, useState } from "react";
import type { ThemeProps } from "../types";
import {
  initialRsvpValues,
  validateRsvp,
  type RsvpAnswer,
  type RsvpErrors,
  type RsvpValues,
} from "./rsvp-schema";

export interface UseRsvpFormOptions {
  mode: ThemeProps["mode"];
  invitedEventIds: string[];
  maxAttendees: number;
  /** Previous answer from GuestContext.rsvp. Never pass guest.token to the client. */
  rsvp?: RsvpAnswer;
}

/** answered = show the summary; editing/submitting/error = show the form. */
export type RsvpPhase = "editing" | "submitting" | "error" | "answered";

export interface RsvpFormController {
  values: RsvpValues;
  errors: RsvpErrors;
  phase: RsvpPhase;
  /** Last saved answer (initial `rsvp` or what was just submitted). */
  answer?: RsvpAnswer;
  /** true right after a successful submit in this session (for a "Cảm ơn" message). */
  justSubmitted: boolean;
  /** preview mode: the form is shown but cannot be submitted. */
  disabled: boolean;
  setField: <K extends keyof RsvpValues>(field: K, value: RsvpValues[K]) => void;
  toggleEvent: (eventId: string) => void;
  submit: () => Promise<void>;
  edit: () => void;
}

const FAKE_DELAY_MS = 600;

async function sendRsvp(answer: RsvpAnswer, mode: UseRsvpFormOptions["mode"]): Promise<void> {
  void answer;
  void mode;
  // TODO(T-0xx /api/rsvp): when mode === "live", POST the answer to /api/rsvp. The token must NOT
  // come from client props: decide between reading it from the URL path or a server-side handler.
  // Until that API exists every mode is a fake 600ms success.
  await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS));
}

export function useRsvpForm({
  mode,
  invitedEventIds,
  maxAttendees,
  rsvp,
}: UseRsvpFormOptions): RsvpFormController {
  const ctx = { invitedEventIds, maxAttendees };
  const [values, setValues] = useState<RsvpValues>(() => initialRsvpValues(ctx, rsvp));
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [phase, setPhase] = useState<RsvpPhase>(rsvp ? "answered" : "editing");
  const [answer, setAnswer] = useState<RsvpAnswer | undefined>(rsvp);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const disabled = mode === "preview";

  const setField = useCallback(<K extends keyof RsvpValues>(field: K, value: RsvpValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const toggleEvent = useCallback((eventId: string) => {
    setValues((prev) => ({
      ...prev,
      eventIds: prev.eventIds.includes(eventId)
        ? prev.eventIds.filter((id) => id !== eventId)
        : [...prev.eventIds, eventId],
    }));
    setErrors((prev) => ({ ...prev, eventIds: undefined }));
  }, []);

  async function submit() {
    if (disabled || phase === "submitting") return;
    const result = validateRsvp(values, { invitedEventIds, maxAttendees });
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setPhase("submitting");
    try {
      await sendRsvp(result.data, mode);
      setAnswer(result.data);
      setJustSubmitted(true);
      setPhase("answered");
    } catch {
      setPhase("error");
    }
  }

  const edit = useCallback(() => {
    setJustSubmitted(false);
    setPhase("editing");
  }, []);

  return {
    values,
    errors,
    phase,
    answer,
    justSubmitted,
    disabled,
    setField,
    toggleEvent,
    submit,
    edit,
  };
}
