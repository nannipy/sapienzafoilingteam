jest.mock('@/app/lib/public-action-security', () => ({ publicSourceHash: jest.fn().mockResolvedValue('test-source-hash'), consumePublicLimit: jest.fn().mockResolvedValue(true) }));
jest.mock('@/app/lib/team-day-tickets', () => ({ getBookingTickets: jest.fn().mockResolvedValue([]), ticketView: jest.fn() }));
jest.mock('@/app/lib/team-day-email', () => ({ deliverBookingEmails: jest.fn().mockResolvedValue(undefined) }));
jest.mock('server-only', () => ({}));
jest.mock('next/headers', () => ({ headers: jest.fn().mockResolvedValue(new Headers({ 'x-forwarded-for': '127.0.0.1' })) }));
jest.mock('@/app/lib/supabase-admin', () => ({ supabaseAdmin: { rpc: jest.fn(), from: jest.fn() } }));
jest.mock('@/app/lib/supabase-server', () => ({ requireAdmin: jest.fn().mockResolvedValue({ id: 'admin' }) }));

import { validateTeamDayInput } from '@/app/lib/team-day-validation';
import { submitTeamDayRegistration } from '@/app/actions/team-day';
import { getTeamDayPaymentOptions, getTeamDayBankDetails } from '@/app/lib/team-day-config';
import { listTeamDayRegistrations, setTeamDayPaymentStatus, setTeamDayParticipantArchived } from '@/app/actions/team-day-admin';
import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { requireAdmin } from '@/app/lib/supabase-server';

const input = { firstName: ' Mario ', lastName: 'Rossi', email: 'MARIO@example.com', payment: 'cash', privacyAccepted: true, website: '', requestId: 'b58fb537-c994-43c7-98ed-2fa9a3351374' };
const rpc = jest.mocked(supabaseAdmin.rpc);
const from = jest.mocked(supabaseAdmin.from);

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(Date.parse('2026-10-26T12:00:00Z'));
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only-key';
  delete process.env.TEAM_DAY_PAYPAL_URL;
  delete process.env.TEAM_DAY_REVOLUT_URL;
  delete process.env.TEAM_DAY_BANK_IBAN;
  delete process.env.TEAM_DAY_BANK_ACCOUNT_HOLDER;
});
afterEach(() => jest.restoreAllMocks());

it('normalizes names and email', () => {
  expect(validateTeamDayInput(input)).toMatchObject({ firstName: 'Mario', email: 'mario@example.com' });
});
it('requires a contact email and keeps dietary notes optional', () => {
  expect(validateTeamDayInput({ ...input, email: '', dietaryNotes: ' Senza glutine ' })).toBeNull();
  expect(validateTeamDayInput({ ...input, email: undefined })).toBeNull();
  expect(validateTeamDayInput({ ...input, dietaryNotes: 'a'.repeat(501) })).toBeNull();
});
it.each([{ privacyAccepted: false }, { website: 'spam' }, { email: 'invalid' }, { payment: 'paid' }, { firstName: '' }, { firstName: 'a'.repeat(81) }, { requestId: 'invalid' }, { lastName: 'Rossi\nTest' }])('rejects malformed registration %o', (patch) => {
  expect(validateTeamDayInput({ ...input, ...patch })).toBeNull();
});
it('never claims success when storage fails', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  rpc.mockResolvedValue({ data: null, error: { code: '42P01' } } as never);
  expect(await submitTeamDayRegistration(input)).toEqual({ success: false, error: 'unavailable' });
});
it('rejects a registration without contact email before storage', async () => {
  rpc.mockResolvedValue({ data: 'booking-code', error: null } as never);
  const result = await submitTeamDayRegistration({ ...input, email: '', dietaryNotes: 'Allergia alle noci' });
  expect(result).toEqual({ success: false, error: 'invalid' });
  expect(rpc).not.toHaveBeenCalled();
});
it('saves cash registration without accepting a client price or paid status', async () => {
  rpc.mockResolvedValue({ data: 'booking-code', error: null } as never);
  expect(await submitTeamDayRegistration({ ...input, amount_cents: 1, payment_status: 'paid' })).toEqual({ success: true, tickets: [], emailPending: false, code: 'booking-code' });
  expect(rpc).toHaveBeenCalledWith('register_team_day_booking', expect.objectContaining({ p_request_id: input.requestId, p_email: 'mario@example.com', p_payment_method: 'cash' }));
  expect(Object.keys(rpc.mock.calls[0][1]!)).not.toContain('payment_status');
});
it('blocks payment methods without configured links on server', async () => {
  expect(await submitTeamDayRegistration({ ...input, payment: 'paypal' })).toEqual({ success: false, error: 'unavailable' });
  expect(rpc).not.toHaveBeenCalled();
});
it('rejects unsafe or unrelated payment URLs', () => {
  process.env.TEAM_DAY_PAYPAL_URL = 'https://paypal.com.attacker.test/pay';
  process.env.TEAM_DAY_REVOLUT_URL = 'javascript:alert(1)';
  expect(getTeamDayPaymentOptions()).toEqual({ paypal: false, revolut: false, bankTransfer: false });
});
it('returns a configured payment link only after storing registration', async () => {
  process.env.TEAM_DAY_PAYPAL_URL = 'https://www.paypal.com/ncp/payment/example';
  rpc.mockResolvedValue({ data: 'booking-code', error: null } as never);
  expect(await submitTeamDayRegistration({ ...input, payment: 'paypal' })).toEqual({ success: true, tickets: [], emailPending: false, code: 'booking-code', paymentUrl: process.env.TEAM_DAY_PAYPAL_URL });
});
it('handles duplicate emails without exposing a booking code', async () => {
  rpc.mockResolvedValue({ data: null, error: { code: '23505' } } as never);
  expect(await submitTeamDayRegistration(input)).toEqual({ success: false, error: 'duplicate' });
});
it('closes registration at the end of the Rome event date', async () => {
  jest.mocked(Date.now).mockReturnValue(Date.parse('2026-11-08T23:00:00Z'));
  rpc.mockResolvedValue({data:null,error:{code:'22023'}} as never);
  expect(await submitTeamDayRegistration(input)).toEqual({ success: false, error: 'closed' });
});
it('requires authentication before listing attendee data', async () => {
  jest.mocked(requireAdmin).mockRejectedValueOnce(new Error('unauthorized'));
  await expect(listTeamDayRegistrations()).rejects.toThrow('unauthorized');
  expect(from).not.toHaveBeenCalled();
});
it('keeps the admin list working until the archive migration is applied', async () => {
  rpc.mockResolvedValueOnce({ data: null, error: { code: 'PGRST202', message: 'Could not find the function in the schema cache' } } as never)
    .mockResolvedValueOnce({ data: { rows: [], total: 0, received: 0, due: 0 }, error: null } as never);
  await expect(listTeamDayRegistrations()).resolves.toMatchObject({ total: 0 });
  expect(rpc).toHaveBeenLastCalledWith('list_team_day_bookings', { p_search: '', p_page: 0 });
});
it('requires authentication before changing paid status', async () => {
  jest.mocked(requireAdmin).mockRejectedValueOnce(new Error('unauthorized'));
  await expect(setTeamDayPaymentStatus(input.requestId, 'paid')).rejects.toThrow('unauthorized');
  expect(from).not.toHaveBeenCalled();
});

// Fictional examples are used only in mocked tests. No provider or bank is contacted.
const onlineMethods = [
  { method: 'paypal', env: 'TEAM_DAY_PAYPAL_URL', url: 'https://www.paypal.com/ncp/payment/test-example' },
  { method: 'revolut', env: 'TEAM_DAY_REVOLUT_URL', url: 'https://checkout.revolut.com/pay/test-example' },
];

it.each(onlineMethods)('$method: saves the chosen method and returns its own link without marking paid', async ({ method, env, url }) => {
  process.env[env] = url;
  rpc.mockResolvedValue({ data: 'test-booking-code', error: null } as never);
  expect(await submitTeamDayRegistration({ ...input, payment: method, payment_status: 'paid' })).toEqual({ success: true, tickets: [], emailPending: false, code: 'test-booking-code', paymentUrl: url });
  expect(rpc).toHaveBeenCalledWith('register_team_day_booking', expect.objectContaining({ p_payment_method: method }));
  expect(from).not.toHaveBeenCalled();
});
it.each(onlineMethods)('$method: never offers a payment link if saving the booking failed', async ({ method, env, url }) => {
  process.env[env] = url;
  jest.spyOn(console, 'error').mockImplementation(() => {});
  rpc.mockResolvedValue({ data: null, error: { code: '42P01' } } as never);
  expect(await submitTeamDayRegistration({ ...input, payment: method })).toEqual({ success: false, error: 'unavailable' });
});
it.each(['paypal', 'revolut', 'bank_transfer'])('%s: disabled configuration cannot be bypassed by a forged submission', async (payment) => {
  expect(await submitTeamDayRegistration({ ...input, payment })).toEqual({ success: false, error: 'unavailable' });
  expect(rpc).not.toHaveBeenCalled();
});
it.each(['http://paypal.com/pay', 'https://user:password@paypal.com/pay', 'https://evil.test/pay', 'https://paypal.com.evil.test/pay'])('rejects unsafe checkout %s', (url) => {
  process.env.TEAM_DAY_PAYPAL_URL = url;
  expect(getTeamDayPaymentOptions().paypal).toBe(false);
});
it('does not accept a PayPal link as a Revolut destination', () => {
  process.env.TEAM_DAY_REVOLUT_URL = 'https://paypal.com/pay';
  expect(getTeamDayPaymentOptions().revolut).toBe(false);
});
it('bank transfer stays disabled with incomplete coordinates', () => {
  process.env.TEAM_DAY_BANK_IBAN = 'IT60X0542811101000000123456';
  expect(getTeamDayPaymentOptions().bankTransfer).toBe(false);
  process.env.TEAM_DAY_BANK_ACCOUNT_HOLDER = 'Test account';
  delete process.env.TEAM_DAY_BANK_IBAN;
  expect(getTeamDayPaymentOptions().bankTransfer).toBe(false);
});
it('rejects a mistyped IBAN checksum rather than displaying unusable instructions', () => {
  process.env.TEAM_DAY_BANK_IBAN = 'IT61X0542811101000000123456';
  process.env.TEAM_DAY_BANK_ACCOUNT_HOLDER = 'Test account';
  expect(getTeamDayBankDetails()).toBeUndefined();
});
it('bank transfer returns normalized coordinates and a booking-specific reference after save', async () => {
  process.env.TEAM_DAY_BANK_IBAN = 'it60 x054 2811 1010 0000 0123 456';
  process.env.TEAM_DAY_BANK_ACCOUNT_HOLDER = '  Test account  ';
  rpc.mockResolvedValue({ data: 'test-booking-code', error: null } as never);
  expect(await submitTeamDayRegistration({ ...input, payment: 'bank_transfer' })).toEqual({
    success: true, tickets: [], emailPending: false, code: 'test-booking-code', bankTransfer: {
      iban: 'IT60X0542811101000000123456', accountHolder: 'Test account', reference: 'SFT DAY Mario Rossi test-booking-code', amountCents: 1500,
    },
  });
  expect(rpc).toHaveBeenCalledWith('register_team_day_booking', expect.objectContaining({ p_payment_method: 'bank_transfer' }));
  expect(from).not.toHaveBeenCalled();
});
it('admin can verify receipt and correct an accidental verification', async () => {
  const single = jest.fn().mockResolvedValue({ data: { id: input.requestId }, error: null });
  const select = jest.fn().mockReturnValue({ single });
  const eq = jest.fn().mockReturnValue({ select });
  const update = jest.fn().mockReturnValue({ eq });
  from.mockReturnValue({ update } as never);
  await setTeamDayPaymentStatus(input.requestId, 'paid');
  await setTeamDayPaymentStatus(input.requestId, 'pending');
  expect(requireAdmin).toHaveBeenCalledTimes(2);
  expect(update.mock.calls).toEqual([[{ payment_status: 'paid' }], [{ payment_status: 'pending' }]]);
  expect(eq).toHaveBeenCalledWith('id', input.requestId);
});
it('a failed verification is reported to admin instead of claiming success', async () => {
  const single = jest.fn().mockResolvedValue({ data: null, error: { code: '500' } });
  from.mockReturnValue({ update: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single }) }) }) } as never);
  await expect(setTeamDayPaymentStatus(input.requestId, 'paid')).rejects.toThrow('Impossibile aggiornare');
});
it('archives and restores a person for the current event', async () => {
  const maybeSingle = jest.fn().mockResolvedValue({ data: { id: input.requestId }, error: null });
  const select = jest.fn().mockReturnValue({ maybeSingle });
  const eventEq = jest.fn().mockReturnValue({ select });
  const idEq = jest.fn().mockReturnValue({ eq: eventEq });
  const update = jest.fn().mockReturnValue({ eq: idEq });
  from.mockReturnValue({ update } as never);
  await setTeamDayParticipantArchived(input.requestId, true);
  await setTeamDayParticipantArchived(input.requestId, false);
  expect(update.mock.calls[0][0]).toMatchObject({ archived_by: 'admin', archived_at: expect.any(String) });
  expect(update.mock.calls[1][0]).toEqual({ archived_at: null, archived_by: null });
  expect(idEq).toHaveBeenCalledWith('id', input.requestId);
  expect(eventEq).toHaveBeenCalledWith('event_id', 'sft-day-2026');
});
it('rejects an archive request with an invalid participant id', async () => {
  await expect(setTeamDayParticipantArchived('not-a-uuid', true)).rejects.toThrow('Dati non validi');
  expect(from).not.toHaveBeenCalled();
});

it('preserves a saved booking when email delivery throws', async () => {
  const { deliverBookingEmails } = await import('@/app/lib/team-day-email');
  jest.mocked(deliverBookingEmails).mockRejectedValueOnce(new Error('provider unavailable'));
  rpc.mockResolvedValue({data:'saved-booking',error:null} as never);
  expect(await submitTeamDayRegistration(input)).toMatchObject({success:true,code:'saved-booking',emailPending:true});
});
it('recovers the original booking even after registration closes', async () => {
  jest.mocked(Date.now).mockReturnValue(Date.parse('2026-11-09T12:00:00Z'));
  rpc.mockResolvedValue({data:'original-booking',error:null} as never);
  expect(await submitTeamDayRegistration(input)).toMatchObject({success:true,code:'original-booking'});
});
