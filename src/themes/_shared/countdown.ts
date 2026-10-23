// Pure countdown math. Vietnam has no DST, and we diff absolute instants (epoch ms), so the result
// does not depend on the device time zone.

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** true from the target instant onwards (and for an invalid target, so the UI just hides). */
  isPast: boolean;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function diffParts(target: Date, now: Date): CountdownParts {
  const ms = target.getTime() - now.getTime();
  if (!Number.isFinite(ms) || ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  return {
    days: Math.floor(ms / DAY),
    hours: Math.floor((ms % DAY) / HOUR),
    minutes: Math.floor((ms % HOUR) / MINUTE),
    seconds: Math.floor((ms % MINUTE) / SECOND),
    isPast: false,
  };
}
