import { render, screen, waitFor } from '@testing-library/react';
import SftDayAdminPage from '@/app/admin/sft-day/page';
import { listTeamDayRegistrations } from '@/app/actions/team-day-admin';

jest.mock('@/app/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'it' }) }));
jest.mock('@/app/context/AdminContext', () => {
  const user = { id: 'admin' };
  return { useAdminContext: () => ({ user }) };
});
jest.mock('@/app/actions/team-day-admin', () => ({
  listTeamDayRegistrations: jest.fn(),
  setTeamDayPaymentStatus: jest.fn(),
  controlTeamDayTicket: jest.fn(),
  resendTeamDayTicket: jest.fn(),
  retryTeamDayEmails: jest.fn(),
  setTeamDayParticipantArchived: jest.fn(),
}));

const list = jest.mocked(listTeamDayRegistrations);

it('renders the desktop bookings table and the mobile cards', async () => {
  list.mockResolvedValueOnce({
    total: 1, received: 1500, due: 0, people: 2, entered: 1,
    rows: [{
      id: 'e381d34b-aace-4beb-9fa3-48394ae1d18e',
      code: 'aab0828c-84d6-4748-aaf6-afdc64d126ab',
      first_name: 'Anna', last_name: 'Test', email: 'anna@example.test',
      payment_method: 'cash', payment_status: 'paid', amount_cents: 1500,
      created_at: '2026-10-26T10:00:00.000Z',
      tickets: [
        {
          id: 'c91d6993-e8ce-4063-92ec-e7cc5ddcf4d2', code: 'b58fb537-c994-43c7-98ed-2fa9a3351374',
          status: 'used', checked_in_at: '2026-11-08T10:05:00.000Z', participant_id: 'd1c5f7a2-1234-4abc-8def-0123456789ab',
          event_id: 'sft-day-2026', firstName: 'Anna', lastName: 'Test', email: 'anna@example.test',
          emailStatus: 'sent', emailSentAt: '2026-10-26T10:01:00.000Z', paymentStatus: 'paid', paymentMethod: 'cash',
        },
        {
          id: 'c91d6993-e8ce-4063-92ec-e7cc5ddcf4d3', code: 'b58fb537-c994-43c7-98ed-2fa9a3351375',
          status: 'valid', checked_in_at: null, participant_id: 'd1c5f7a2-1234-4abc-8def-0123456789ac',
          event_id: 'sft-day-2026', firstName: 'Luca', lastName: 'Test', email: 'luca@example.test',
          emailStatus: 'sent', emailSentAt: '2026-10-26T10:01:00.000Z', paymentStatus: 'paid', paymentMethod: 'cash',
        },
      ],
    }],
  });

  render(<SftDayAdminPage />);

  await waitFor(() => expect(screen.getAllByText('Anna Test').length).toBeGreaterThan(0));
  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: 'Partecipante' })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: 'Azioni' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Apri i biglietti: Anna Test/ })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Riporta da verificare: Anna Test/ }).length).toBeGreaterThan(0);
});
