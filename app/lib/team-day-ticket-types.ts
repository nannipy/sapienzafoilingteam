export const TEAM_DAY_EVENT_ID = 'sft-day-2026';
export const TICKET_CODE_PATTERN = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
export type TicketStatus = 'valid' | 'used' | 'cancelled';
export type EmailStatus = 'pending' | 'sending' | 'sent' | 'failed' | 'review' | 'no_email' | 'suppressed';
export type PaymentStatus = 'pending' | 'paid';
/** Person lifecycle shown to staff: booked → paid → entered. */
export type PersonState = 'booked' | 'paid' | 'entered';
export type TeamDayTicket = {
  id: string; code: string; status: TicketStatus; checked_in_at: string | null;
  participant_id: string; event_id: string;
  firstName: string; lastName: string; email: string | null;
  deliveryEmail?: string | null;
  dietaryNotes?: string | null;
  emailStatus: EmailStatus; emailSentAt: string | null;
  paymentStatus?: PaymentStatus; paymentMethod?: string; archivedAt?: string | null;
};
export type TicketView = TeamDayTicket & { qrDataUrl: string };
export type TicketControlResult = {
  result: 'not_found' | 'valid' | 'used' | 'cancelled' | 'admitted' | 'archived';
  firstName?: string; lastName?: string;
  paymentStatus?: PaymentStatus; paymentMethod?: string; amountCents?: number; registrationId?: string;
  archivedAt?: string | null;
  ticket?: { code: string; checked_in_at: string | null };
};
export function personState(ticket: Pick<TeamDayTicket, 'status' | 'paymentStatus'>): PersonState {
  if (ticket.status === 'used') return 'entered';
  return ticket.paymentStatus === 'paid' ? 'paid' : 'booked';
}
// QR contains only an opaque, random ticket code. It is never a booking or participant ID.
export function ticketQrValue(code: string) { return `sft:${code}`; }
export function parseTicketCode(value: string): string | null {
  const code = value.trim().replace(/^sft:/i, '');
  return TICKET_CODE_PATTERN.test(code) ? code.toLowerCase() : null;
}
