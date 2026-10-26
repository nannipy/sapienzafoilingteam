'use server';

import { requireAuth } from '@/app/lib/supabase-server';
import { supabaseAdmin } from '@/app/lib/supabase-admin';
import type { TeamDayRegistration } from '@/app/lib/team-day-validation';

export async function listTeamDayRegistrations(): Promise<TeamDayRegistration[]> {
  await requireAuth();
  const { data, error } = await supabaseAdmin.from('team_day_registrations')
    .select('id,code,first_name,last_name,email,payment_method,payment_status,amount_cents,created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Impossibile caricare le prenotazioni.');
  return data ?? [];
}

export async function setTeamDayPaymentStatus(id: string, status: 'pending' | 'paid'): Promise<void> {
  await requireAuth();
  if (!/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(id)
    || !['pending', 'paid'].includes(status)) throw new Error('Dati non validi.');
  const { data, error } = await supabaseAdmin.from('team_day_registrations')
    .update({ payment_status: status }).eq('id', id).select('id').single();
  if (error || !data) throw new Error('Impossibile aggiornare il pagamento.');
}
