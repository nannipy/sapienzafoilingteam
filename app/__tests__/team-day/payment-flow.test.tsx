import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import TeamDayClientPage from '@/app/team-day/TeamDayClientPage';
import { submitTeamDayRegistration } from '@/app/actions/team-day';

jest.mock('@/app/actions/team-day', () => ({ submitTeamDayRegistration: jest.fn() }));
jest.mock('@/app/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'it' }) }));
const submit = jest.mocked(submitTeamDayRegistration);
const props = { paymentOptions: { paypal: true, revolut: true, bankTransfer: true }, eventDate: '2026-11-08', priceEur: 15 };
const bookingCode = 'b58fb537-c994-43c7-98ed-2fa9a3351374';

function fillDetails({
  firstName = 'Mario',
  lastName = 'Rossi',
  email = 'mario@example.com',
  dietaryNotes = '',
  privacy = true,
}: {
  firstName?: string;
  lastName?: string;
  email?: string;
  dietaryNotes?: string;
  privacy?: boolean;
} = {}) {
  if (firstName) {
    fireEvent.change(screen.getByRole('textbox', { name: 'Nome *' }), { target: { value: firstName } });
  }
  if (lastName) {
    fireEvent.change(screen.getByRole('textbox', { name: 'Cognome *' }), { target: { value: lastName } });
  }
  if (email !== undefined) {
    fireEvent.change(screen.getByRole('textbox', { name: /Email/ }), { target: { value: email } });
  }
  if (dietaryNotes) {
    fireEvent.change(screen.getByRole('textbox', { name: /allergie e intolleranze/i }), { target: { value: dietaryNotes } });
  }
  if (privacy) {
    fireEvent.click(screen.getByRole('checkbox'));
  }
  fireEvent.click(screen.getByRole('button', { name: 'Registrati' }));
}

async function fillAndProceed(method: RegExp, options?: Parameters<typeof fillDetails>[0]) {
  fillDetails(options);
  fireEvent.click(await screen.findByRole('radio', { name: method }));
}

async function confirm() {
  await waitFor(() => expect(screen.getByRole('button', { name: 'Conferma prenotazione' })).toBeEnabled());
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Conferma prenotazione' })); });
}

beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(crypto, 'randomUUID', { configurable: true, value: () => bookingCode });
});

it.each([
  { method: /PayPal/, value: 'paypal', url: 'https://www.paypal.com/ncp/payment/test-example' },
  { method: /Revolut/, value: 'revolut', url: 'https://checkout.revolut.com/pay/test-example' },
])('$value: booking leads to the correct external link and a pending-payment message', async ({ method, value, url }) => {
  submit.mockResolvedValue({ success: true, tickets: [], emailPending: false, code: bookingCode, paymentUrl: url });
  render(<TeamDayClientPage {...props} />);
  await fillAndProceed(method);
  expect(screen.queryByRole('link', { name: /Vai al pagamento/ })).not.toBeInTheDocument();
  await confirm();
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Prenotazione registrata' })).toHaveFocus());
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ payment: value, requestId: bookingCode, email: 'mario@example.com' }));
  const link = screen.getByRole('link', { name: /Vai al pagamento/ });
  expect(link).toHaveAttribute('href', url);
  expect(link.querySelector('img')).toHaveAttribute('src', `/payments/${value}-wordmark.svg`);
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.getByText(/Il pagamento non risulta ancora confermato/)).toBeInTheDocument();
  link.addEventListener('click', (event) => event.preventDefault());
  fireEvent.click(link);
  expect(submit).toHaveBeenCalledTimes(1);
  expect(screen.getByText(/Il pagamento non risulta ancora confermato/)).toBeInTheDocument();
});

it('requires a contact email before proceeding to payment', async () => {
  render(<TeamDayClientPage {...props} />);
  fillDetails({ email: '', dietaryNotes: 'Celiaco, niente glutine' });
  fireEvent.click(screen.getByRole('button', { name: 'Registrati' }));
  expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  expect(submit).not.toHaveBeenCalled();
});

it('allows navigating back to edit personal details', async () => {
  render(<TeamDayClientPage {...props} />);
  fillDetails({ firstName: 'Mario', lastName: 'Rossi', email: 'mario@example.com' });
  expect(await screen.findByRole('heading', { name: 'Il tuo contributo' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Modifica i dati' }));
  expect(await screen.findByRole('heading', { name: 'Prenota il tuo posto' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Nome *' })).toHaveValue('Mario');
});

it('bank transfer shows coordinates and booking reference with no external payment link', async () => {
  submit.mockResolvedValue({
    success: true, tickets: [], emailPending: false,
    code: bookingCode,
    bankTransfer: {
      iban: 'IT60X0542811101000000123456',
      accountHolder: 'Riccardo Mariotti',
      reference: `SFT DAY Mario Rossi ${bookingCode}`,
      amountCents: 1500,
    },
  });
  render(<TeamDayClientPage {...props} />);
  await fillAndProceed(/Bonifico bancario/);
  await confirm();
  await screen.findByRole('heading', { name: 'Prenotazione registrata' });
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ payment: 'bank_transfer' }));
  expect(screen.getByText('IT60X0542811101000000123456')).toBeInTheDocument();
  expect(screen.getByText('Riccardo Mariotti')).toBeInTheDocument();
  expect(screen.getByText(`SFT DAY Mario Rossi ${bookingCode}`)).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Vai al pagamento/ })).not.toBeInTheDocument();
  expect(screen.getByText(/verificherà/)).toBeInTheDocument();
});

it('with no payment configuration all three remote methods are disabled, cash remains available', async () => {
  render(<TeamDayClientPage {...props} paymentOptions={{ paypal: false, revolut: false, bankTransfer: false }} />);
  await fillAndProceed(/Contanti/);
  for (const method of [/PayPal/, /Revolut/, /Bonifico bancario/]) {
    expect(screen.getByRole('radio', { name: method })).toBeDisabled();
  }
  expect(screen.getByRole('radio', { name: /Contanti/ })).toBeChecked();
  expect(screen.getByRole('radio', { name: /Contanti/ })).toBeEnabled();
  expect(screen.queryByText('IBAN')).not.toBeInTheDocument();
});

it('failed booking keeps inputs and method for retry, without offering a payment link', async () => {
  submit.mockResolvedValue({ success: false, error: 'unavailable' });
  render(<TeamDayClientPage {...props} />);
  await fillAndProceed(/Revolut/);
  await confirm();
  expect(await screen.findByRole('alert')).toHaveTextContent(/Non è stato possibile confermare/);
  expect(screen.getByRole('radio', { name: /Revolut/ })).toBeChecked();
  expect(screen.queryByRole('link', { name: /Vai al pagamento/ })).not.toBeInTheDocument();
  submit.mockResolvedValue({ success: true, tickets: [], emailPending: false, code: bookingCode, paymentUrl: 'https://checkout.revolut.com/pay/test-example' });
  await confirm();
  await screen.findByRole('heading', { name: 'Prenotazione registrata' });
  expect(submit.mock.calls[0][0]).toEqual(submit.mock.calls[1][0]);
});

it('prevents double submission while the booking is still being saved', async () => {
  let resolve!: (value: Awaited<ReturnType<typeof submitTeamDayRegistration>>) => void;
  submit.mockReturnValue(new Promise((done) => { resolve = done; }));
  render(<TeamDayClientPage {...props} />);
  await fillAndProceed(/PayPal/);
  await confirm();
  const button = screen.getByRole('button', { name: /Prenotazione in corso/ });
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute('aria-busy', 'true');
  fireEvent.click(button);
  expect(submit).toHaveBeenCalledTimes(1);
  await act(async () => { resolve({ success: true, tickets: [], emailPending: false, code: bookingCode, paymentUrl: 'https://paypal.me/test-example' }); });
  await screen.findByRole('heading', { name: 'Prenotazione registrata' });
});

it('starts with personal details only and reveals payment after Registrati without saving early', async () => {
  render(<TeamDayClientPage {...props} />);
  expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Conferma prenotazione' })).not.toBeInTheDocument();
  await fillAndProceed(/PayPal/);
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Conferma prenotazione' })).toBeEnabled();
  expect(screen.queryByRole('heading', { name: 'Prenotazione registrata' })).not.toBeInTheDocument();
});
it('does not reveal payment when required registration fields are empty', () => {
  render(<TeamDayClientPage {...props} />);
  fireEvent.click(screen.getByRole('button', { name: 'Registrati' }));
  expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  expect(submit).not.toHaveBeenCalled();
});
it('returning to details keeps every field and the selected payment method', async () => {
  render(<TeamDayClientPage {...props} />);
  await fillAndProceed(/Bonifico bancario/);
  fireEvent.click(screen.getByRole('button', { name: 'Modifica i dati' }));
  expect(await screen.findByRole('textbox', { name: 'Nome *' })).toHaveValue('Mario');
  expect(screen.getByRole('textbox', { name: 'Cognome *' })).toHaveValue('Rossi');
  expect(screen.getByRole('textbox', { name: /^Email/ })).toHaveValue('mario@example.com');
  expect(screen.getByRole('checkbox')).toBeChecked();
  fireEvent.change(screen.getByRole('textbox', { name: 'Nome *' }), { target: { value: 'Maria' } });
  fireEvent.click(screen.getByRole('button', { name: 'Registrati' }));
  expect(await screen.findByRole('radio', { name: /Bonifico bancario/ })).toBeChecked();
  expect(submit).not.toHaveBeenCalled();
});

it('books a group with individual confirmation tickets and the correct total', async () => {
  const tickets = ['Mario','Anna'].map((name,index) => ({
    id:`ticket-${index}`,code:`code-${index}`,status:'valid' as const,checked_in_at:null,participant_id:`person-${index}`,
    event_id:'sft-day-2026',firstName:name,lastName:'Test',email:null,emailStatus:'no_email' as const,emailSentAt:null,
    qrDataUrl:'data:image/png;base64,TEST',
  }));
  submit.mockResolvedValue({success:true,code:bookingCode,tickets,emailPending:false});
  render(<TeamDayClientPage {...props} />);
  fireEvent.change(screen.getByRole('textbox',{name:'Nome *'}),{target:{value:'Mario'}});
  fireEvent.change(screen.getByRole('textbox',{name:'Cognome *'}),{target:{value:'Test'}});
  fireEvent.change(screen.getByRole('textbox',{name:/^Email/}),{target:{value:'mario@example.test'}});
  fireEvent.click(screen.getByRole('button',{name:'Aggiungi partecipante'}));
  fireEvent.change(screen.getAllByRole('textbox',{name:'Nome *'})[1],{target:{value:'Anna'}});
  fireEvent.change(screen.getAllByRole('textbox',{name:'Cognome *'})[1],{target:{value:'Test'}});
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button',{name:'Registrati'}));
  expect(await screen.findByText(/Totale: 30,00/)).toBeInTheDocument();
  await confirm();
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({participants:[expect.objectContaining({firstName:'Anna',lastName:'Test'})]}));
  expect(await screen.findByRole('heading',{name:'Mario Test'})).toBeInTheDocument();
  expect(screen.getByRole('heading',{name:'Anna Test'})).toBeInTheDocument();
  expect(screen.getAllByRole('img',{name:'QR code personale per l’ingresso'})).toHaveLength(2);
  expect(screen.getAllByRole('link',{name:'Scarica biglietto PDF'})).toHaveLength(2);
  expect(screen.queryByRole('link',{name:/Wallet/})).not.toBeInTheDocument();
});
