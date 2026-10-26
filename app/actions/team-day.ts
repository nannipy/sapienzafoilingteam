'use server';

import { createHmac } from 'node:crypto';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { getTeamDayPaymentUrl, getTeamDayBankDetails, TEAM_DAY_CLOSES_AT, TEAM_DAY_PRICE_EUR } from '@/app/lib/team-day-config';
import { validateTeamDayInput, type TeamDayBankTransfer } from '@/app/lib/team-day-validation';

export async function submitTeamDayRegistration(input: unknown): Promise<
  { success: true; code: string; paymentUrl?: string; bankTransfer?: TeamDayBankTransfer } |
  { success: false; error: 'invalid' | 'unavailable' | 'closed' | 'duplicate' }
> {
  const data = validateTeamDayInput(input);
  if (!data) return { success: false, error: 'invalid' };
  if (Date.now() >= Date.parse(TEAM_DAY_CLOSES_AT)) return { success: false, error: 'closed' };
  const paymentUrl = getTeamDayPaymentUrl(data.payment);
  const bankDetails = data.payment === 'bank_transfer' ? getTeamDayBankDetails() : undefined;
  if (['paypal', 'revolut'].includes(data.payment) && !paymentUrl) return { success: false, error: 'unavailable' };
  if (data.payment === 'bank_transfer' && !bankDetails) return { success: false, error: 'unavailable' };
  try {
    const requestHeaders = await headers();
    const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const sourceHash = createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!)
      .update(`team-day-2026:${ip}`).digest('hex');
    const { data: result, error } = await supabaseAdmin.rpc('register_team_day', {
      p_request_id: data.requestId, p_first_name: data.firstName, p_last_name: data.lastName,
      p_email: data.email, p_payment_method: data.payment, p_source_hash: sourceHash,
    });
    if (error || typeof result !== 'string') {
      if (error?.code === '23505') return { success: false, error: 'duplicate' };
      // Keep attendee details, tokens and database errors out of public responses/logs.
      console.error('Team Day registration could not be saved', error?.code ?? 'invalid_response');
      return { success: false, error: 'unavailable' };
    }
    return { success: true, code: result, ...(paymentUrl ? { paymentUrl } : {}),
      ...(bankDetails ? { bankTransfer: { ...bankDetails, reference: `SFT DAY ${result}`, amountCents: TEAM_DAY_PRICE_EUR * 100 } } : {}) };
  } catch {
    return { success: false, error: 'unavailable' };
  }
}
