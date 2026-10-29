/**
 * Shared window for the SFT Day 2026 campaign (navbar highlight + site popup).
 * The event takes place on 8 November 2026; the promo stays live until the
 * end of that day (Rome time, CET).
 */
export const SFT_DAY_STARTS_AT = new Date('2026-11-08T11:00:00+01:00').getTime();
export const SFT_DAY_PROMO_ENDS_AT = new Date('2026-11-08T23:59:59+01:00').getTime();

export function isSftDayPromoActive(now: number = Date.now()): boolean {
  return now <= SFT_DAY_PROMO_ENDS_AT;
}

export type SftDayCountdownPhase = 'countdown' | 'final-days' | 'last-day' | 'live' | 'ended';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** The banner message grows more urgent as the event approaches. */
export function getSftDayCountdownPhase(now: number = Date.now()): SftDayCountdownPhase {
  if (now > SFT_DAY_PROMO_ENDS_AT) return 'ended';
  const remaining = SFT_DAY_STARTS_AT - now;
  if (remaining <= 0) return 'live';
  if (remaining <= DAY_MS) return 'last-day';
  if (remaining <= 3 * DAY_MS) return 'final-days';
  return 'countdown';
}

export function getSftDayTimeLeft(now: number = Date.now()) {
  const remaining = Math.max(0, SFT_DAY_STARTS_AT - now);
  return {
    days: Math.floor(remaining / DAY_MS),
    hours: Math.floor((remaining % DAY_MS) / HOUR_MS),
    minutes: Math.floor((remaining % HOUR_MS) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000),
  };
}
