'use server';

import { getBookingTickets, ticketView } from '@/app/lib/team-day-tickets';
import { deliverBookingEmails } from '@/app/lib/team-day-email';
import type { TicketView } from '@/app/lib/team-day-ticket-types';
import { publicSourceHash, consumePublicLimit } from '@/app/lib/public-action-security';
import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { getTeamDayPaymentUrl, getTeamDayBankDetails, TEAM_DAY_CLOSES_AT, TEAM_DAY_PRICE_EUR } from '@/app/lib/team-day-config';
import { validateTeamDayInput, type TeamDayBankTransfer } from '@/app/lib/team-day-validation';

export async function submitTeamDayRegistration(input: unknown): Promise<
  { success: true; code: string; tickets: TicketView[]; emailPending: boolean; paymentUrl?: string; bankTransfer?: TeamDayBankTransfer } |
  { success: false; error: 'invalid' | 'unavailable' | 'closed' | 'duplicate' }
> {
  const data = validateTeamDayInput(input);
  if (!data) return { success: false, error: 'invalid' };
  const paymentUrl = getTeamDayPaymentUrl(data.payment);
  const bankDetails = data.payment === 'bank_transfer' ? getTeamDayBankDetails() : undefined;
  if (['paypal', 'revolut'].includes(data.payment) && !paymentUrl) return { success: false, error: 'unavailable' };
  if (data.payment === 'bank_transfer' && !bankDetails) return { success: false, error: 'unavailable' };
  try {
    const sourceHash = await publicSourceHash();
    if (!await consumePublicLimit('booking-ip', sourceHash, 10)) return { success: false, error: 'unavailable' };
    const recipients = new Set([data.email, ...(data.participants ?? []).map(p => p.email)].filter((email): email is string => !!email));
    for (const email of recipients) {
      if (!await consumePublicLimit('booking-email', email, 3)) return { success: false, error: 'unavailable' };
    }
    const { data: result, error } = await supabaseAdmin.rpc('register_team_day_booking', {
      p_request_id: data.requestId, p_first_name: data.firstName, p_last_name: data.lastName,
      p_email: data.email ?? null, p_payment_method: data.payment, p_source_hash: sourceHash,
      p_dietary_notes: data.dietaryNotes ?? null,
      p_participants: (data.participants ?? []).map(p => ({ firstName:p.firstName,lastName:p.lastName,email:p.email ?? null,dietaryNotes:p.dietaryNotes ?? null })),
    });
    if (error || typeof result !== 'string') {
      if (error?.code === '22023' && Date.now() >= Date.parse(TEAM_DAY_CLOSES_AT)) return { success:false,error:'closed' };
      if (error?.code === '23505') return { success: false, error: 'duplicate' };
      // Keep attendee details, tokens and database errors out of public responses/logs.
      console.error('SFT Day registration could not be saved', error?.code ?? 'invalid_response');
      return { success: false, error: 'unavailable' };
    }
    let emailPending = false;
    try { await deliverBookingEmails(data.requestId); } catch { emailPending = true; }
    const tickets = await Promise.all((await getBookingTickets(data.requestId)).map(ticketView));
    return { success: true, code: result, tickets, emailPending, ...(paymentUrl ? { paymentUrl } : {}),
      ...(bankDetails ? { bankTransfer: { ...bankDetails, reference: `SFT DAY ${data.firstName} ${data.lastName} ${result}`, amountCents: TEAM_DAY_PRICE_EUR * 100 * (1 + (data.participants?.length ?? 0)) } } : {}) };
  } catch {
    return { success: false, error: 'unavailable' };
  }
}
