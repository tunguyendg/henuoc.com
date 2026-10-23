// Shared theme primitives (docs/07-THEMES.md §3). Themes import from "@/themes/_shared".
// Server Components: MapButton, Watermark, Gift. Everything else is a client leaf or a hook.

export { AddToCalendar, type AddToCalendarProps } from "./AddToCalendar";
export { Envelope, type EnvelopeProps } from "./Envelope";
export { Gift, type GiftProps } from "./Gift";
export { GiftButton, type GiftButtonProps } from "./GiftButton";
export { GiftSheet, type GiftSheetProps } from "./GiftSheet";
export { MapButton, type MapButtonProps } from "./MapButton";
export { MusicToggle, type MusicToggleProps } from "./MusicToggle";
export { Reveal, type RevealProps } from "./Reveal";
export { RsvpForm, type RsvpEventOption, type RsvpFormProps } from "./RsvpForm";
export { Watermark, type WatermarkProps } from "./Watermark";

export { useCountdown } from "./use-countdown";
export { useEnvelope, type EnvelopeController, type UseEnvelopeOptions } from "./use-envelope";
export { useMusic, type MusicController } from "./use-music";
export {
  useRsvpForm,
  type RsvpFormController,
  type RsvpPhase,
  type UseRsvpFormOptions,
} from "./use-rsvp-form";
export { useHydrated, usePrefersReducedMotion } from "./use-client-env";

export { buildIcs, googleCalendarUrl, icsFileName, type CalendarOptions } from "./calendar";
export { diffParts, type CountdownParts } from "./countdown";
export {
  ENVELOPE_DURATION_MS,
  envelopeReducer,
  type EnvelopeEvent,
  type EnvelopeState,
} from "./envelope-machine";
export { giftSideLabel, toGiftCards, type GiftCard } from "./gift-cards";
export {
  RSVP_MESSAGE_MAX,
  createRsvpSchema,
  validateRsvp,
  type RsvpAnswer,
  type RsvpContext,
  type RsvpErrors,
  type RsvpStatus,
  type RsvpValues,
} from "./rsvp-schema";
