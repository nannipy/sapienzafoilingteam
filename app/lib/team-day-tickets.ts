import 'server-only';
import QRCode from 'qrcode';
import { supabaseAdmin } from './supabase-admin';
import { TEAM_DAY_EVENT_ID, ticketQrValue, type TeamDayTicket, type TicketView } from './team-day-ticket-types';

export function relationArray<T>(value: T | T[] | null | undefined): T[] { return value == null ? [] : Array.isArray(value) ? value : [value]; }

export async function getBookingTickets(registrationId: string): Promise<TeamDayTicket[]> {
  const { data, error } = await supabaseAdmin.from('team_day_participants')
    .select('id,first_name,last_name,email,position,team_day_tickets(id,code,status,checked_in_at,participant_id,event_id,team_day_ticket_emails(status,sent_at,created_at,recipient))')
    .eq('registration_id', registrationId).eq('event_id', TEAM_DAY_EVENT_ID).order('position');
  if (error || !data) throw new Error('Biglietti non disponibili');
  return data.flatMap((person) => relationArray(person.team_day_tickets).map((ticket) => {
    const emails = [...ticket.team_day_ticket_emails].sort((a,b) => b.created_at.localeCompare(a.created_at));
    return { id: ticket.id, code: ticket.code, status: ticket.status, checked_in_at: ticket.checked_in_at,
      participant_id: person.id, event_id: ticket.event_id, firstName: person.first_name, lastName: person.last_name, email: person.email,
      deliveryEmail: emails[0]?.recipient ?? person.email, emailStatus: emails[0]?.status ?? (person.email ? 'pending' : 'no_email'), emailSentAt: emails[0]?.sent_at ?? null } as TeamDayTicket;
  }));
}
export async function getTicketByCode(code: string): Promise<TeamDayTicket | null> {
  const { data, error } = await supabaseAdmin.from('team_day_tickets')
    .select('id,code,status,checked_in_at,participant_id,event_id,team_day_participants!inner(first_name,last_name,email,archived_at),team_day_ticket_emails(status,sent_at,created_at,recipient)')
    .eq('code',code).eq('event_id',TEAM_DAY_EVENT_ID).maybeSingle();
  if (error) throw new Error('Biglietto non disponibile');
  if (!data) return null;
  // Supabase untyped relationship inference uses arrays; this FK is one-to-one in the database.
  const person = data.team_day_participants as unknown as { first_name: string; last_name: string; email: string | null; archived_at: string | null };
  const emails = [...data.team_day_ticket_emails].sort((a,b) => b.created_at.localeCompare(a.created_at));
  return { id: data.id, code: data.code, status: person.archived_at ? 'cancelled' : data.status, checked_in_at: data.checked_in_at, participant_id: data.participant_id,
    event_id: data.event_id, firstName: person.first_name, lastName: person.last_name, email: person.email,
    deliveryEmail: emails[0]?.recipient ?? person.email, emailStatus: emails[0]?.status ?? (person.email ? 'pending' : 'no_email'), emailSentAt: emails[0]?.sent_at ?? null };
}
export async function ticketView(ticket: TeamDayTicket): Promise<TicketView> {
  return { ...ticket, qrDataUrl: await QRCode.toDataURL(ticketQrValue(ticket.code), { width: 320, margin: 4, errorCorrectionLevel: 'M' }) };
}
