export type TeamDayPayment = 'cash' | 'paypal' | 'revolut' | 'bank_transfer';

export type TeamDayParticipantInput = { firstName: string; lastName: string; email?: string; dietaryNotes?: string };

export type TeamDayInput = {
  participants?: TeamDayParticipantInput[];
  firstName: string;
  lastName: string;
  email: string;
  dietaryNotes?: string;
  payment: TeamDayPayment;
  privacyAccepted: boolean;
  website: string;
  requestId: string;
};

type ValidatedTeamDayInput = Omit<TeamDayInput, 'email'> & { email?: string };

export function validateTeamDayInput(value: unknown): TeamDayInput | null;
export function validateTeamDayInput(value: unknown, optionalEmail: true): ValidatedTeamDayInput | null;
export function validateTeamDayInput(value: unknown, optionalEmail = false): ValidatedTeamDayInput | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Record<string, unknown>;
  const text = (key: string, max: number) => typeof data[key] === 'string'
    && (data[key] as string).trim().length > 0 && (data[key] as string).length <= max
    && !/[\u0000-\u001f\u007f]/.test(data[key] as string);

  if (!text('firstName', 80) || !text('lastName', 80)) return null;

  let email: string | undefined;
  if (typeof data.email === 'string' && data.email.trim().length > 0) {
    const rawEmail = data.email.trim();
    if (rawEmail.length > 254 || /[\u0000-\u001f\u007f]/.test(rawEmail) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return null;
    }
    email = rawEmail.toLowerCase();
  }

  let dietaryNotes: string | undefined;
  if (typeof data.dietaryNotes === 'string' && data.dietaryNotes.trim().length > 0) {
    const rawNotes = data.dietaryNotes.trim();
    if (rawNotes.length > 500 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(rawNotes)) {
      return null;
    }
    dietaryNotes = rawNotes;
  }

  if (!['cash', 'paypal', 'revolut', 'bank_transfer'].includes(data.payment as string)) return null;
  if (data.privacyAccepted !== true || data.website !== '') return null;
  if (typeof data.requestId !== 'string' || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(data.requestId)) return null;

  const participants: TeamDayParticipantInput[] = [];
  if (data.participants !== undefined) {
    if (!Array.isArray(data.participants) || data.participants.length > 9) return null;
    for (const person of data.participants) {
      if (!person || typeof person !== 'object' || Array.isArray(person)) return null;
      const valid = validateTeamDayInput({ ...person, participants: undefined, payment: data.payment,
        privacyAccepted: true, website: '', requestId: data.requestId }, true);
      if (!valid) return null;
      participants.push({ firstName: valid.firstName, lastName: valid.lastName,
        ...(valid.email ? { email: valid.email } : {}), ...(valid.dietaryNotes ? { dietaryNotes: valid.dietaryNotes } : {}) });
    }
  }
  if ((!optionalEmail && !email) || (data.email !== undefined && typeof data.email !== 'string')) return null;
  if (data.dietaryNotes !== undefined && typeof data.dietaryNotes !== 'string') return null;

  return {
    ...(participants.length ? { participants } : {}),
    firstName: (data.firstName as string).trim(),
    lastName: (data.lastName as string).trim(),
    ...(email ? { email } : {}),
    ...(dietaryNotes ? { dietaryNotes } : {}),
    payment: data.payment as TeamDayPayment,
    privacyAccepted: true,
    website: '',
    requestId: data.requestId,
  };
}

export type TeamDayRegistration = {
  id: string;
  code: string;
  first_name: string;
  last_name: string;
  email: string | null;
  dietary_notes?: string | null;
  payment_method: TeamDayPayment;
  payment_status: 'pending' | 'paid';
  amount_cents: number;
  created_at: string;
  tickets?: import('./team-day-ticket-types').TeamDayTicket[];
};

export type TeamDayBankTransfer = {
  iban: string;
  accountHolder: string;
  reference: string;
  amountCents: number;
};
