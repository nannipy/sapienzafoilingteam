import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TeamDayClientPage from '@/app/team-day/TeamDayClientPage';
import { submitTeamDayRegistration } from '@/app/actions/team-day';

jest.mock('@/app/actions/team-day', () => ({ submitTeamDayRegistration: jest.fn() }));
jest.mock('@/app/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'it' }) }));

const submit = jest.mocked(submitTeamDayRegistration);
const props = { paymentOptions: { paypal: true, revolut: true, bankTransfer: true }, eventDate: '2026-11-08', priceEur: 15 };
const bookingCode = 'b58fb537-c994-43c7-98ed-2fa9a3351374';

function fillForm(method: RegExp) {
  fireEvent.change(screen.getByRole('textbox', { name: 'Nome *' }), { target: { value: 'Mario' } });
  fireEvent.change(screen.getByRole('textbox', { name: 'Cognome *' }), { target: { value: 'Rossi' } });
  fireEvent.change(screen.getByRole('textbox', { name: 'Email *' }), { target: { value: 'mario@example.com' } });
  fireEvent.click(screen.getByRole('radio', { name: method }));
  fireEvent.click(screen.getByRole('checkbox'));
}
async function confirm() {
  await waitFor(() => expect(screen.getByRole('button', { name: 'Conferma prenotazione' })).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: 'Conferma prenotazione' }));
}
beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(crypto, 'randomUUID', { configurable: true, value: () => bookingCode });
});

it.each([
  { method: /PayPal/, value: 'paypal', url: 'https://www.paypal.com/ncp/payment/test-example' },
  { method: /Revolut/, value: 'revolut', url: 'https://checkout.revolut.com/pay/test-example' },
])('$value: booking leads to the correct external link and a pending-payment message', async ({ method, value, url }) => {
  submit.mockResolvedValue({ success: true, code: bookingCode, paymentUrl: url });
  render(<TeamDayClientPage {...props} />);
  fillForm(method);
  expect(screen.queryByRole('link', { name: /Vai al pagamento/ })).not.toBeInTheDocument();
  await confirm();
  expect(await screen.findByRole('heading', { name: 'Prenotazione registrata' })).toHaveFocus();
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ payment: value, requestId: bookingCode }));
  const link = screen.getByRole('link', { name: /Vai al pagamento/ });
  expect(link).toHaveAttribute('href', url);
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.getByText(/Il pagamento non risulta ancora confermato/)).toBeInTheDocument();
  link.addEventListener('click', (event) => event.preventDefault());
  fireEvent.click(link);
  expect(submit).toHaveBeenCalledTimes(1);
  expect(screen.getByText(/Il pagamento non risulta ancora confermato/)).toBeInTheDocument();
});
it('bank transfer shows coordinates and booking reference with no external payment link', async () => {
  submit.mockResolvedValue({ success: true, code: bookingCode, bankTransfer: { iban: 'IT60X0542811101000000123456', accountHolder: 'Test account', reference: `SFT DAY ${bookingCode}`, amountCents: 1500 } });
  render(<TeamDayClientPage {...props} />);
  fillForm(/Bonifico bancario/);
  await confirm();
  await screen.findByRole('heading', { name: 'Prenotazione registrata' });
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ payment: 'bank_transfer' }));
  expect(screen.getByText('IT60X0542811101000000123456')).toBeInTheDocument();
  expect(screen.getByText('Test account')).toBeInTheDocument();
  expect(screen.getByText(`SFT DAY ${bookingCode}`)).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Vai al pagamento/ })).not.toBeInTheDocument();
  expect(screen.getByText(/verificherà/)).toBeInTheDocument();
});
it('with no payment configuration all three remote methods are disabled, cash remains available', () => {
  render(<TeamDayClientPage {...props} paymentOptions={{ paypal: false, revolut: false, bankTransfer: false }} />);
  for (const method of [/PayPal/, /Revolut/, /Bonifico bancario/]) expect(screen.getByRole('radio', { name: method })).toBeDisabled();
  expect(screen.getByRole('radio', { name: /Contanti/ })).toBeChecked();
  expect(screen.getByRole('radio', { name: /Contanti/ })).toBeEnabled();
  expect(screen.queryByText('IBAN')).not.toBeInTheDocument();
});
it('failed booking keeps inputs and method for retry, without offering a payment link', async () => {
  submit.mockResolvedValue({ success: false, error: 'unavailable' });
  render(<TeamDayClientPage {...props} />);
  fillForm(/Revolut/);
  await confirm();
  expect(await screen.findByRole('alert')).toHaveTextContent(/Non è stato possibile confermare/);
  expect(screen.getByRole('textbox', { name: 'Email *' })).toHaveValue('mario@example.com');
  expect(screen.getByRole('radio', { name: /Revolut/ })).toBeChecked();
  expect(screen.queryByRole('link', { name: /Vai al pagamento/ })).not.toBeInTheDocument();
  submit.mockResolvedValue({ success: true, code: bookingCode, paymentUrl: 'https://checkout.revolut.com/pay/test-example' });
  await confirm();
  await screen.findByRole('heading', { name: 'Prenotazione registrata' });
  expect(submit.mock.calls[0][0]).toEqual(submit.mock.calls[1][0]);
});
it('prevents double submission while the booking is still being saved', async () => {
  let resolve!: (value: Awaited<ReturnType<typeof submitTeamDayRegistration>>) => void;
  submit.mockReturnValue(new Promise((done) => { resolve = done; }));
  render(<TeamDayClientPage {...props} />);
  fillForm(/PayPal/);
  await confirm();
  const button = screen.getByRole('button', { name: /Prenotazione in corso/ });
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute('aria-busy', 'true');
  fireEvent.click(button);
  expect(submit).toHaveBeenCalledTimes(1);
  resolve({ success: true, code: bookingCode, paymentUrl: 'https://paypal.me/test-example' });
  await screen.findByRole('heading', { name: 'Prenotazione registrata' });
});
