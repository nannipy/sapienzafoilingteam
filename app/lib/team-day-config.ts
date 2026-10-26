import 'server-only';

export const TEAM_DAY_PRICE_EUR = 15;
export const TEAM_DAY_DATE = '2026-11-08';
export const TEAM_DAY_CLOSES_AT = '2026-11-08T23:00:00Z';

const DEFAULT_REVOLUT_URL = 'https://revolut.me/sapienza_foiling_team';
const DEFAULT_BANK_IBAN = 'IT39E0366901600067012923268';
const DEFAULT_ACCOUNT_HOLDER = 'Riccardo Mariotti';

// These are payment links, not checkout integrations. Receipt is verified by staff.
export function getTeamDayPaymentUrl(method: string): string | undefined {
  const isTest = process.env.NODE_ENV === 'test';
  const defaultRevolut = isTest ? undefined : DEFAULT_REVOLUT_URL;
  const raw = method === 'paypal'
    ? (process.env.SFT_DAY_PAYPAL_URL ?? process.env.TEAM_DAY_PAYPAL_URL)
    : method === 'revolut'
      ? (process.env.SFT_DAY_REVOLUT_URL ?? process.env.TEAM_DAY_REVOLUT_URL ?? defaultRevolut)
      : undefined;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    const hosts = method === 'paypal'
      ? ['paypal.com', 'www.paypal.com', 'paypal.me', 'www.paypal.me']
      : ['revolut.me', 'www.revolut.me', 'checkout.revolut.com', 'pay.revolut.com'];
    if (url.protocol !== 'https:' || url.username || url.password || !hosts.includes(url.hostname)) return undefined;
    return url.toString();
  } catch { return undefined; }
}

export function getTeamDayBankDetails(): { iban: string; accountHolder: string } | undefined {
  const isTest = process.env.NODE_ENV === 'test';
  const defaultIban = isTest ? undefined : DEFAULT_BANK_IBAN;
  const defaultHolder = isTest ? undefined : DEFAULT_ACCOUNT_HOLDER;
  const iban = (process.env.SFT_DAY_BANK_IBAN ?? process.env.TEAM_DAY_BANK_IBAN ?? defaultIban)?.replace(/\s/g, '').toUpperCase();
  const accountHolder = (process.env.SFT_DAY_BANK_ACCOUNT_HOLDER ?? process.env.TEAM_DAY_BANK_ACCOUNT_HOLDER ?? defaultHolder)?.trim();
  if (!iban || !accountHolder || accountHolder.length > 160 || /[\u0000-\u001f\u007f]/.test(accountHolder)) return undefined;
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return undefined;
  // Check the international IBAN checksum before displaying payment instructions.
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const character of rearranged) {
    const digits = /[A-Z]/.test(character) ? String(character.charCodeAt(0) - 55) : character;
    for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  if (remainder !== 1) return undefined;
  return { iban, accountHolder };
}

export function getTeamDayPaymentOptions() {
  return { paypal: Boolean(getTeamDayPaymentUrl('paypal')), revolut: Boolean(getTeamDayPaymentUrl('revolut')), bankTransfer: Boolean(getTeamDayBankDetails()) };
}
