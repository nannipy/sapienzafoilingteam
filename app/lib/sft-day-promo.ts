/**
 * Shared window for the SFT Day 2026 campaign (navbar highlight + site popup).
 * The event takes place on 8 November 2026; the promo stays live until the
 * end of that day (Rome time, CET).
 */
export const SFT_DAY_PROMO_ENDS_AT = new Date('2026-11-08T23:59:59+01:00').getTime();

export function isSftDayPromoActive(now: number = Date.now()): boolean {
  return now <= SFT_DAY_PROMO_ENDS_AT;
}
