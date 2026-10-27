'use server';

import { deliverTicketEmail, processPendingTicketEmails } from '@/app/lib/team-day-email';
import { TEAM_DAY_EVENT_ID, parseTicketCode, TICKET_CODE_PATTERN, type TicketControlResult } from '@/app/lib/team-day-ticket-types';
import { requireAdmin } from '@/app/lib/supabase-server';
import { supabaseAdmin } from '@/app/lib/supabase-admin';
import type { TeamDayRegistration } from '@/app/lib/team-day-validation';

export async function listTeamDayRegistrations(search = '', page = 0, includeArchived = false): Promise<{ rows: TeamDayRegistration[]; total: number; received: number; due: number; people?: number; entered?: number }> {
  await requireAdmin();
  if (typeof search !== 'string' || search.length > 254 || !Number.isInteger(page) || page < 0 || page > 10000 || typeof includeArchived !== 'boolean') throw new Error('Ricerca non valida.');
  const args = { p_search: search.trim(), p_page: page };
  const { data, error } = await supabaseAdmin.rpc('list_team_day_bookings', { ...args, p_include_archived: includeArchived });
  if (!error && data) return data;
  // Before the archive migration is applied the three-argument RPC does not exist yet.
  // Fall back to the previous signature so the admin screen keeps loading.
  if (error?.code === 'PGRST202' || /could not find the function|schema cache/i.test(error?.message ?? '')) {
    const legacy = await supabaseAdmin.rpc('list_team_day_bookings', args);
    if (!legacy.error && legacy.data) return legacy.data;
  }
  throw new Error('Impossibile caricare le prenotazioni.');
}

export async function setTeamDayPaymentStatus(id: string, status: 'pending' | 'paid'): Promise<void> {
  await requireAdmin();
  if (!/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(id)
    || !['pending', 'paid'].includes(status)) throw new Error('Dati non validi.');
  const { data, error } = await supabaseAdmin.from('team_day_registrations')
    .update({ payment_status: status }).eq('id', id).select('id').single();
  if (error || !data) throw new Error('Impossibile aggiornare il pagamento.');
}

export async function setTeamDayParticipantArchived(participantId: string, archived: boolean): Promise<void> {
  const user = await requireAdmin();
  if (!TICKET_CODE_PATTERN.test(participantId) || typeof archived !== 'boolean') throw new Error('Dati non validi.');
  const { data, error } = await supabaseAdmin.from('team_day_participants')
    .update({ archived_at: archived ? new Date().toISOString() : null, archived_by: archived ? user.id : null })
    .eq('id', participantId).eq('event_id', TEAM_DAY_EVENT_ID).select('id').maybeSingle();
  if (error?.code === '42703' || error?.code === 'PGRST204') throw new Error('MIGRATION_REQUIRED');
  if (error || !data) throw new Error('Impossibile archiviare la persona.');
}

export async function deleteArchivedTeamDayParticipant(participantId: string): Promise<{ bookingDeleted: boolean }> {
  await requireAdmin();
  if (!TICKET_CODE_PATTERN.test(participantId)) throw new Error('Dati non validi.');
  const { data, error } = await supabaseAdmin.rpc('delete_archived_team_day_participant', {
    p_participant_id: participantId,
    p_event_id: TEAM_DAY_EVENT_ID,
  });
  if (error?.code === 'PGRST202' || /could not find the function|schema cache/i.test(error?.message ?? '')) {
    throw new Error('MIGRATION_REQUIRED');
  }
  if (error || !data || typeof data.bookingDeleted !== 'boolean') throw new Error('Impossibile eliminare la persona archiviata.');
  return { bookingDeleted: data.bookingDeleted };
}

export async function controlTeamDayTicket(value: string, action: 'verify' | 'check_in' | 'cancel'): Promise<TicketControlResult> {
  const user = await requireAdmin();
  const code = typeof value === 'string' ? parseTicketCode(value) : null;
  if (!code || !['verify','check_in','cancel'].includes(action)) throw new Error('Codice non valido.');
  const { data, error } = await supabaseAdmin.rpc('control_team_day_ticket', {
    p_code:code,p_event_id:TEAM_DAY_EVENT_ID,p_action:action,p_actor:user.id,
  });
  if (error || !data) throw new Error('Verifica non disponibile. Riprova.');
  return data;
}
export async function resendTeamDayTicket(ticketId: string, requestId: string): Promise<string | undefined> {
  await requireAdmin();
  if (!TICKET_CODE_PATTERN.test(ticketId) || !TICKET_CODE_PATTERN.test(requestId)) throw new Error('Dati non validi.');
  const { data, error } = await supabaseAdmin.rpc('queue_team_day_email',{ p_ticket_id:ticketId,p_request_id:requestId });
  if (error || !data) throw new Error('Reinvio non disponibile. Controlla email, stato e ultimo invio.');
  return deliverTicketEmail(data);
}
export async function retryTeamDayEmails() {
  await requireAdmin();
  return processPendingTicketEmails();
}
