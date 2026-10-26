/** @jest-environment node */
jest.mock('server-only', () => ({}));
jest.mock('@/app/lib/supabase-admin', () => ({ supabaseAdmin: { from: jest.fn() } }));
import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { getTicketByCode } from '@/app/lib/team-day-tickets';

it.each([null, '2026-10-26T18:00:00Z'])('exposes an archived ticket as invalid for pages, PDFs and email delivery (%s)', async archivedAt => {
  const row = { id: 'ticket', code: 'code', status: 'valid', event_id: 'sft-day-2026', participant_id: 'person',
    checked_in_at: null, team_day_ticket_emails: [],
    team_day_participants: { first_name: 'Test', last_name: 'Archive', email: 'test@example.test', archived_at: archivedAt } };
  const query = { select: jest.fn(), eq: jest.fn(), maybeSingle: jest.fn().mockResolvedValue({ data: row, error: null }) };
  query.select.mockReturnValue(query); query.eq.mockReturnValue(query);
  jest.mocked(supabaseAdmin.from).mockReturnValue(query as never);
  expect((await getTicketByCode('code'))?.status).toBe(archivedAt ? 'cancelled' : 'valid');
  expect(query.select).toHaveBeenCalledWith(expect.stringContaining('archived_at'));
});
