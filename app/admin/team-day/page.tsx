'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@sft/design-system';
import { ArrowUpRight, Loader2, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useAdminContext } from '@/app/context/AdminContext';
import { listTeamDayRegistrations, setTeamDayPaymentStatus } from '@/app/actions/team-day-admin';
import type { TeamDayRegistration } from '@/app/lib/team-day-validation';

const copy = {
  it: {
    title: 'Prenotazioni Team Day', event: '8 novembre 2026 · dalle 12:00 · Aeroporto dell’Urbe, Via Salaria 825, Roma',
    publicPage: 'Apri il modulo', refresh: 'Aggiorna', loading: 'Caricamento prenotazioni…',
    loadError: 'Non è stato possibile caricare le prenotazioni. Riprova.',
    saveError: 'Il pagamento non è stato aggiornato. Riprova.', saved: 'Stato del pagamento aggiornato.',
    empty: 'Non ci sono ancora prenotazioni.', attendees: 'Prenotazioni', received: 'Incassato verificato',
    due: 'Da incassare / verificare', name: 'Partecipante', booking: 'Codice prenotazione',
    payment: 'Pagamento', status: 'Stato', actions: 'Azioni', cash: 'Contanti all’evento', bankTransfer: 'Bonifico bancario',
    pending: 'Da pagare / da verificare', paid: 'Pagamento verificato', markPaid: 'Segna come pagato',
    markPending: 'Riporta da verificare', saving: 'Salvataggio…',
    note: 'Conferma il pagamento solo dopo aver verificato l’incasso. La scelta di un metodo di pagamento non prova che la quota sia stata pagata.',
  },
  en: {
    title: 'Team Day bookings', event: '8 November 2026 · from 12:00 noon · Aeroporto dell’Urbe, Via Salaria 825, Rome',
    publicPage: 'Open registration form', refresh: 'Refresh', loading: 'Loading bookings…',
    loadError: 'Bookings could not be loaded. Please try again.',
    saveError: 'Payment status could not be updated. Please try again.', saved: 'Payment status updated.',
    empty: 'There are no bookings yet.', attendees: 'Bookings', received: 'Verified payments',
    due: 'Awaiting payment / verification', name: 'Attendee', booking: 'Booking code',
    payment: 'Payment', status: 'Status', actions: 'Actions', cash: 'Cash at the event', bankTransfer: 'Bank transfer',
    pending: 'Awaiting payment / verification', paid: 'Payment verified', markPaid: 'Mark as paid',
    markPending: 'Return to pending', saving: 'Saving…',
    note: 'Confirm payment only after checking the funds have been received. Selecting a payment method does not prove payment.',
  },
};

export default function TeamDayAdminPage() {
  const { language } = useLanguage();
  const { user } = useAdminContext();
  const t = copy[language];
  const [rows, setRows] = useState<TeamDayRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!user) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadFailed(false);
    listTeamDayRegistrations().then((registrations) => {
      if (active) setRows(registrations);
    }).catch(() => {
      if (active) setLoadFailed(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [user, refreshKey]);

  async function updatePayment(row: TeamDayRegistration) {
    if (savingId) return;
    const nextStatus = row.payment_status === 'paid' ? 'pending' : 'paid';
    setSavingId(row.id);
    setSaveFailed(false);
    setSaved(false);
    try {
      await setTeamDayPaymentStatus(row.id, nextStatus);
      setRows((current) => current.map((item) => item.id === row.id ? { ...item, payment_status: nextStatus } : item));
      setSaved(true);
    } catch {
      setSaveFailed(true);
    } finally {
      setSavingId(null);
    }
  }

  const formatCurrency = (cents: number) => new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-GB', {
    style: 'currency', currency: 'EUR',
  }).format(cents / 100);
  const received = rows.filter((row) => row.payment_status === 'paid').reduce((sum, row) => sum + row.amount_cents, 0);
  const due = rows.filter((row) => row.payment_status === 'pending').reduce((sum, row) => sum + row.amount_cents, 0);

  return (
    <main className="sft-root flex-1 p-4 md:p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl border border-gray-200">
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{t.title}</h1>
            <p className="text-sm text-gray-500 mt-2">{t.event}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" disabled={loading || savingId !== null} onClick={() => setRefreshKey((key) => key + 1)}>
              <RefreshCw size={16} aria-hidden="true" />{t.refresh}
            </Button>
            <Button asChild variant="brand"><Link href="/team-day">{t.publicPage}<ArrowUpRight size={16} aria-hidden="true" /></Link></Button>
          </div>
        </header>

        <div aria-live="polite">
          {(loadFailed || saveFailed) && <p role="alert" className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-6">{loadFailed ? t.loadError : t.saveError}</p>}
          {saved && <p role="status" className="bg-green-100 border border-green-400 text-green-800 p-4 rounded-lg mb-6">{t.saved}</p>}
        </div>

        {loading ? (
          <div role="status" className="flex items-center justify-center gap-3 py-12 text-gray-500"><Loader2 className="animate-spin h-6 w-6 text-brand" aria-hidden="true" />{t.loading}</div>
        ) : !loadFailed && (
          <>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: t.attendees, value: rows.length },
                { label: t.received, value: formatCurrency(received) },
                { label: t.due, value: formatCurrency(due) },
              ].map(({ label, value }) => <div key={label} className="rounded-lg border border-gray-200 p-4"><dt className="text-sm text-gray-500">{label}</dt><dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd></div>)}
            </dl>
            <p className="text-sm text-gray-600 mb-6">{t.note}</p>
            {rows.length === 0 ? <p className="text-center text-gray-500 py-12">{t.empty}</p> : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <caption className="sr-only">{t.title}</caption>
                  <thead className="bg-gray-50"><tr>
                    {[t.name, t.booking, t.payment, t.status, t.actions].map((label) => <th key={label} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {rows.map((row) => <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4"><p className="font-medium text-gray-900">{row.first_name} {row.last_name}</p><a className="text-brand underline break-all" href={`mailto:${row.email}`}>{row.email}</a></td>
                      <td className="px-4 py-4"><code className="text-xs break-all">{row.code}</code><p className="mt-2 text-gray-500">{new Date(row.created_at).toLocaleString(language === 'it' ? 'it-IT' : 'en-GB', { timeZone: 'Europe/Rome', dateStyle: 'short', timeStyle: 'short' })}</p></td>
                      <td className="px-4 py-4"><p>{row.payment_method === 'cash' ? t.cash : row.payment_method === 'paypal' ? 'PayPal' : row.payment_method === 'bank_transfer' ? t.bankTransfer : 'Revolut'}</p><p className="mt-2 font-medium">{formatCurrency(row.amount_cents)}</p></td>
                      <td className="px-4 py-4"><span className={row.payment_status === 'paid' ? 'text-green-800' : 'text-gray-600'}>{row.payment_status === 'paid' ? t.paid : t.pending}</span></td>
                      <td className="px-4 py-4"><Button type="button" variant="outline" size="sm" disabled={savingId !== null} aria-busy={savingId === row.id} aria-label={`${row.payment_status === 'paid' ? t.markPending : t.markPaid}: ${row.first_name} ${row.last_name}`} onClick={() => updatePayment(row)}>
                        {savingId === row.id ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />{t.saving}</> : row.payment_status === 'paid' ? t.markPending : t.markPaid}
                      </Button></td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
