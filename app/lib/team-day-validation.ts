export type TeamDayPayment = 'cash' | 'paypal' | 'revolut' | 'bank_transfer';
export type TeamDayInput = {
  firstName: string;
  lastName: string;
  email: string;
  payment: TeamDayPayment;
  privacyAccepted: boolean;
  website: string;
  requestId: string;
};

export function validateTeamDayInput(value: unknown): TeamDayInput | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Record<string, unknown>;
  const text = (key: string, max: number) => typeof data[key] === 'string'
    && (data[key] as string).trim().length > 0 && (data[key] as string).length <= max
    && !/[\u0000-\u001f\u007f]/.test(data[key] as string);
  if (!text('firstName', 80) || !text('lastName', 80) || !text('email', 254)) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((data.email as string).trim())) return null;
  if (!['cash', 'paypal', 'revolut', 'bank_transfer'].includes(data.payment as string)) return null;
  if (data.privacyAccepted !== true || data.website !== '') return null;
  if (typeof data.requestId !== 'string' || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(data.requestId)) return null;
  return {
    firstName: (data.firstName as string).trim(), lastName: (data.lastName as string).trim(),
    email: (data.email as string).trim().toLowerCase(), payment: data.payment as TeamDayPayment,
    privacyAccepted: true, website: '', requestId: data.requestId,
  };
}

export type TeamDayRegistration = {
  id: string;
  code: string;
  first_name: string;
  last_name: string;
  email: string;
  payment_method: TeamDayPayment;
  payment_status: 'pending' | 'paid';
  amount_cents: number;
  created_at: string;
};

export type TeamDayBankTransfer = {
  iban: string;
  accountHolder: string;
  reference: string;
  amountCents: number;
};
