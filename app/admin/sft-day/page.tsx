'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { TeamDayEntryControl, TeamDayAdminTicket } from '@/app/components/TeamDayTicketAdmin';
import { Button, Input, Label } from '@sft/design-system';
import {
  AlertTriangle, Archive, ArrowUpRight, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  Clock, Loader2, RefreshCw, Search, Users, X,
} from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useAdminContext } from '@/app/context/AdminContext';
import { listTeamDayRegistrations, setTeamDayPaymentStatus } from '@/app/actions/team-day-admin';
import type { TeamDayRegistration } from '@/app/lib/team-day-validation';
import './sft-day-admin.css';

const PAGE_SIZE = 50;

const copy = {
  it: {
    title: 'Prenotazioni SFT Day', event: '8 novembre 2026 · dalle 11:00 · Aeroporto dell’Urbe, Via Salaria 825, Roma',
    publicPage: 'Apri il modulo', refresh: 'Aggiorna', loading: 'Caricamento prenotazioni…',
    loadError: 'Non è stato possibile caricare le prenotazioni. Riprova.',
    saveError: 'Il pagamento non è stato aggiornato. Riprova.', saved: 'Stato del pagamento aggiornato.',
    empty: 'Non ci sono ancora prenotazioni.', noResults: 'Nessuna prenotazione corrisponde alla ricerca.',
    attendees: 'Prenotazioni', people: 'Persone', received: 'Incassato verificato', due: 'Da incassare / verificare',
    entered: 'entrati', showArchived: 'Mostra archiviati', hideArchived: 'Nascondi archiviati',
    archivedInfo: 'Stai vedendo anche le persone archiviate: il loro QR non è ammesso all’ingresso.',
    name: 'Partecipante', booking: 'Codice prenotazione', payment: 'Pagamento', status: 'Stato', actions: 'Azioni',
    cash: 'Contanti all’evento', bankTransfer: 'Bonifico bancario',
    pending: 'Da pagare / da verificare', paid: 'Pagamento verificato', markPaid: 'Segna come pagato',
    markPending: 'Riporta da verificare', saving: 'Salvataggio…', tickets: 'Biglietti',
    expand: 'Apri i biglietti', collapse: 'Chiudi i biglietti',
    note: 'Conferma il pagamento solo dopo aver verificato l’incasso. La scelta di un metodo di pagamento non prova che la quota sia stata pagata.',
    searchLabel: 'Cerca nome, email, prenotazione o biglietto', searchPlaceholder: 'Nome, email, codice…',
    clearSearch: 'Cancella ricerca', previous: 'Precedente', next: 'Successiva', page: 'Pagina',
    overview: 'Riepilogo prenotazioni', bookingsHint: 'Cerca una prenotazione, verifica il pagamento o gestisci i biglietti delle singole persone.', filteredOverview: 'Riepilogo dei risultati della ricerca', results: 'prenotazioni', noEmail: 'Nessuna email', bookedOn: 'Prenotazione',
  },
  en: {
    title: 'SFT Day bookings', event: '8 November 2026 · from 11:00 · Aeroporto dell’Urbe, Via Salaria 825, Rome',
    publicPage: 'Open registration form', refresh: 'Refresh', loading: 'Loading bookings…',
    loadError: 'Bookings could not be loaded. Please try again.',
    saveError: 'Payment status could not be updated. Please try again.', saved: 'Payment status updated.',
    empty: 'There are no bookings yet.', noResults: 'No booking matches this search.',
    attendees: 'Bookings', people: 'People', received: 'Verified payments', due: 'Awaiting payment / verification',
    entered: 'entered', showArchived: 'Show archived', hideArchived: 'Hide archived',
    archivedInfo: 'Archived people are shown too: their QR is not admitted at the entrance.',
    name: 'Attendee', booking: 'Booking code', payment: 'Payment', status: 'Status', actions: 'Actions',
    cash: 'Cash at the event', bankTransfer: 'Bank transfer',
    pending: 'Awaiting payment / verification', paid: 'Payment verified', markPaid: 'Mark as paid',
    markPending: 'Return to pending', saving: 'Saving…', tickets: 'Tickets',
    expand: 'Open tickets', collapse: 'Close tickets',
    note: 'Confirm payment only after checking the funds have been received. Selecting a payment method does not prove payment.',
    searchLabel: 'Search name, email, booking or ticket', searchPlaceholder: 'Name, email, code…',
    clearSearch: 'Clear search', previous: 'Previous', next: 'Next', page: 'Page',
    overview: 'Booking overview', bookingsHint: 'Find a booking, verify its payment or manage each person’s ticket.', filteredOverview: 'Overview of search results', results: 'bookings', noEmail: 'No email', bookedOn: 'Booking',
  },
};

export default function SftDayAdminPage() {
  const { language } = useLanguage();
  const { user } = useAdminContext();
  const t = copy[language];
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [stats, setStats] = useState<{ total: number; received: number; due: number; people?: number; entered?: number }>({ total: 0, received: 0, due: 0, people: 0, entered: 0 });
  useEffect(() => { const timer = setTimeout(() => { setQuery(search); setPage(0); }, 300); return () => clearTimeout(timer); }, [search]);
  const [rows, setRows] = useState<TeamDayRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!user) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadFailed(false);
    listTeamDayRegistrations(query, page, includeArchived).then((registrations) => {
      if (active) { setRows(registrations.rows); setStats(registrations); }
    }).catch(() => {
      if (active) setLoadFailed(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [user, refreshKey, query, page, includeArchived]);

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
      setRefreshKey(key => key + 1);
    } catch {
      setSaveFailed(true);
    } finally {
      setSavingId(null);
    }
  }

  const formatCurrency = (cents: number) => new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-GB', {
    style: 'currency', currency: 'EUR',
  }).format(cents / 100);
  const formatDate = (value: string) => new Date(value).toLocaleString(language === 'it' ? 'it-IT' : 'en-GB', {
    timeZone: 'Europe/Rome', dateStyle: 'short', timeStyle: 'short',
  });
  const methodLabel = (method: TeamDayRegistration['payment_method']) => method === 'cash' ? t.cash
    : method === 'bank_transfer' ? t.bankTransfer : method === 'paypal' ? 'PayPal' : 'Revolut';
  const pageCount = Math.max(1, Math.ceil(stats.total / PAGE_SIZE));

  const statusBadge = (paid: boolean, compact = false) => (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'} ${paid ? 'border-transparent bg-[var(--success-soft)] text-[var(--success)]' : 'border-transparent bg-[var(--warning-soft)] text-[var(--warning)]'}`}>
      {paid ? <CheckCircle2 size={14} aria-hidden="true" /> : <Clock size={14} aria-hidden="true" />}
      {paid ? t.paid : t.pending}
    </span>
  );

  const paymentButton = (row: TeamDayRegistration, paid: boolean, fullWidth = false) => (
    <Button type="button" variant={paid ? 'outline' : 'default'} size="sm" className={`h-10 ${fullWidth ? 'w-full' : ''}`}
      disabled={savingId !== null} aria-busy={savingId === row.id}
      aria-label={`${paid ? t.markPending : t.markPaid}: ${row.first_name} ${row.last_name}`}
      onClick={() => updatePayment(row)}>
      {savingId === row.id ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />{t.saving}</> : paid ? <><Clock size={16} aria-hidden="true" />{t.markPending}</> : <><CheckCircle2 size={16} aria-hidden="true" />{t.markPaid}</>}
    </Button>
  );

  return (
    <main className="sft-root sft-day-admin ph-no-capture flex-1 w-full max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="sft-day-workspace">
        <header className="sft-day-page-header flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="min-w-0">
            <h1 className="sft-day-page-title">{t.title}</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">{t.event}</p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap lg:shrink-0">
            <Button type="button" variant="outline" className="h-11 w-full sm:w-auto" disabled={loading || savingId !== null} onClick={() => setRefreshKey((key) => key + 1)}>
              <RefreshCw size={16} aria-hidden="true" />{t.refresh}
            </Button>
            <Button asChild variant="outline" className="h-11 w-full sm:w-auto"><Link href="/sft-day">{t.publicPage}<ArrowUpRight size={16} aria-hidden="true" /></Link></Button>
          </div>
        </header>

        <div aria-live="polite" className="sft-day-notices grid gap-2">
          {(loadFailed || saveFailed) && <p role="alert" className="flex items-start gap-2 bg-[var(--destructive)]/5 border border-[var(--destructive)]/20 text-[var(--destructive)] p-3 rounded-lg text-sm"><AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />{loadFailed ? t.loadError : t.saveError}</p>}
          {saved && <p role="status" className="flex items-start gap-2 bg-[var(--success-soft)] border border-transparent text-[var(--success)] p-3 rounded-lg text-sm"><CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />{t.saved}</p>}
        </div>

        <div>
          {query.trim() && <p className="mb-2 text-sm text-[var(--muted-foreground)]" role="status">{t.filteredOverview}</p>}
          <dl aria-label={query.trim() ? t.filteredOverview : t.overview} className="sft-day-overview grid grid-cols-2 lg:grid-cols-4">
            {[
              { label: t.attendees, value: stats.total },
              { label: t.people, value: stats.people ?? '—', hint: stats.entered != null ? `${stats.entered} ${t.entered}` : undefined },
              { label: t.received, value: formatCurrency(stats.received) },
              { label: t.due, value: formatCurrency(stats.due) },
            ].map(({ label, value, hint }) => (
              <div key={label} className="sft-day-metric min-w-0">
                <dt className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-tight">{label}</dt>
                <dd className="mt-1 text-xl sm:text-2xl font-semibold text-[var(--foreground)] tabular-nums break-words">{loading || loadFailed ? '—' : value}</dd>
                {!loading && !loadFailed && hint && <p className="mt-1 text-xs text-[var(--muted-foreground)]">{hint}</p>}
              </div>
            ))}
          </dl>
        </div>

        <TeamDayEntryControl onChanged={() => setRefreshKey(key => key + 1)} />

        <section id="prenotazioni" aria-labelledby="bookings-title" className="sft-day-bookings scroll-mt-24">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="bookings-title" className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">{t.attendees}</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t.bookingsHint}</p>
            </div>
            {!loading && !loadFailed && <p aria-live="polite" className="text-sm text-[var(--muted-foreground)] tabular-nums">{rows.length} / {stats.total} {t.results}</p>}
          </div>

          <div className="sft-day-booking-toolbar mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1 lg:max-w-xl">
              <Label htmlFor="booking-search">{t.searchLabel}</Label>
              <div className="sft-day-search-field relative mt-1.5">
                <Search size={18} className="sft-day-search-icon" aria-hidden="true" />
                <Input id="booking-search" type="search" value={search} maxLength={254} placeholder={t.searchPlaceholder}
                  className="h-12 pl-10 pr-11 text-base" onChange={e => setSearch(e.target.value)} />
                {search && (
                  <button type="button" onClick={() => setSearch('')} aria-label={t.clearSearch}
                    className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)]">
                    <X size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <Button type="button" variant={includeArchived ? 'secondary' : 'outline'} size="sm" className="h-10" aria-pressed={includeArchived} onClick={() => { setIncludeArchived(value => !value); setPage(0); }}>
                <Archive size={16} aria-hidden="true" />{includeArchived ? t.hideArchived : t.showArchived}
              </Button>
            </div>
          </div>

          {loading ? (
            <div role="status" className="flex items-center justify-center gap-3 py-12 text-[var(--muted-foreground)]"><Loader2 className="animate-spin h-6 w-6 text-brand" aria-hidden="true" />{t.loading}</div>
          ) : !loadFailed && (
            <>
              <p className="sft-day-payment-note mb-4 flex items-start gap-2 text-sm text-[var(--muted-foreground)]"><Clock size={16} className="mt-0.5 shrink-0 text-[var(--muted-foreground)]" aria-hidden="true" />{t.note}</p>

              {includeArchived && <p className="mb-3 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--muted-foreground)]">{t.archivedInfo}</p>}

              {rows.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[var(--border)] py-12 text-center text-[var(--muted-foreground)]">
                  <Users size={28} aria-hidden="true" />
                  <p>{query.trim() ? t.noResults : t.empty}</p>
                </div>
              ) : (
                <>
                  {/* Desktop: table with expandable ticket rows. */}
                  <div className="sft-day-table-wrap hidden overflow-x-auto lg:block">
                    <table className="sft-day-table w-full text-sm">
                      <colgroup><col className="sft-day-col-person" /><col className="sft-day-col-people" /><col className="sft-day-col-payment" /><col className="sft-day-col-status" /><col className="sft-day-col-actions" /></colgroup>
                      <thead>
                        <tr className="border-b border-[var(--border)] bg-[var(--muted)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                          <th scope="col" className="px-4 py-3">{t.name}</th>
                          <th scope="col" className="whitespace-nowrap px-3 py-3">{t.people}</th>
                          <th scope="col" className="whitespace-nowrap px-3 py-3">{t.payment}</th>
                          <th scope="col" className="whitespace-nowrap px-3 py-3">{t.status}</th>
                          <th scope="col" className="whitespace-nowrap px-4 py-3 text-right">{t.actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {rows.map((row) => {
                          const tickets = row.tickets ?? [];
                          const paid = row.payment_status === 'paid';
                          const enteredCount = tickets.filter(ticket => ticket.status === 'used').length;
                          const isOpen = expanded === row.id;
                          return (
                            <Fragment key={row.id}>
                              <tr className={`sft-day-booking-row ${isOpen ? 'sft-day-booking-row-open' : ''}`}>
                                <td className="align-middle px-4 py-4">
                                  <p className="font-semibold text-[var(--foreground)] break-words">{row.first_name} {row.last_name}</p>
                                  {row.email
                                    ? <a className="break-all text-xs text-brand underline" href={`mailto:${row.email}`}>{row.email}</a>
                                    : <span className="text-xs italic text-[var(--muted-foreground)]">{t.noEmail}</span>}
                                  {row.dietary_notes && (
                                    <p className="mt-1.5 inline-flex items-start gap-1 rounded border border-transparent bg-[var(--warning-soft)] px-1.5 py-0.5 text-xs text-[var(--warning)]">
                                      <AlertTriangle size={12} className="mt-0.5 shrink-0" aria-hidden="true" />{row.dietary_notes}
                                    </p>
                                  )}
                                  <p className="sft-day-booking-reference mt-2 text-xs text-[var(--muted-foreground)]">
                                    <code className="block break-all text-[var(--foreground)]" title={t.booking}>{row.code}</code>
                                    <span className="mt-1 block">{t.bookedOn}: {formatDate(row.created_at)}</span>
                                  </p>
                                </td>
                                <td className="align-middle px-3 py-4 text-[var(--foreground)]">
                                  <p className="text-base font-semibold tabular-nums">{tickets.length}</p>
                                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)] tabular-nums">{enteredCount} {t.entered}</p>
                                </td>
                                <td className="align-middle px-3 py-4">
                                  <p className="font-semibold text-[var(--foreground)] tabular-nums">{formatCurrency(row.amount_cents)}</p>
                                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{methodLabel(row.payment_method)}</p>
                                </td>
                                <td className="align-middle px-3 py-4">{statusBadge(paid, true)}</td>
                                <td className="align-middle px-4 py-4">
                                  <div className="sft-day-row-actions flex flex-col items-stretch gap-2">
                                    <Button type="button" variant="outline" size="sm" className="h-10 px-3"
                                      aria-expanded={isOpen} aria-controls={`desktop-tickets-${row.id}`}
                                      aria-label={`${isOpen ? t.collapse : t.expand}: ${row.first_name} ${row.last_name}`}
                                      onClick={() => setExpanded(current => current === row.id ? null : row.id)}>
                                      {isOpen ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
                                      {t.tickets} ({tickets.length})
                                    </Button>
                                    {paymentButton(row, paid)}
                                  </div>
                                </td>
                              </tr>
                              {isOpen && (
                                <tr id={`desktop-tickets-${row.id}`} className="sft-day-expanded-row">
                                  <td colSpan={5} className="px-4 py-5">
                                    <ul className="grid gap-2 xl:grid-cols-2">
                                      {tickets.map(ticket => <TeamDayAdminTicket key={ticket.id} ticket={ticket} paymentStatus={row.payment_status} idPrefix="d-" onChanged={() => setRefreshKey(key => key + 1)} />)}
                                    </ul>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile: booking cards. */}
                  <ul className="sft-day-mobile-bookings grid gap-3 lg:hidden">
                    {rows.map((row) => {
                      const paid = row.payment_status === 'paid';
                      const tickets = row.tickets ?? [];
                      const enteredCount = tickets.filter(ticket => ticket.status === 'used').length;
                      return (
                        <li key={row.id} className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-3 sm:p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="break-words text-base font-semibold text-[var(--foreground)]">{row.first_name} {row.last_name}</h3>
                              {row.email ? (
                                <a className="break-all text-xs text-brand underline" href={`mailto:${row.email}`}>{row.email}</a>
                              ) : (
                                <span className="text-xs italic text-[var(--muted-foreground)]">{t.noEmail}</span>
                              )}
                              {row.dietary_notes && (
                                <p className="mt-2 inline-flex items-start gap-1.5 rounded border border-transparent bg-[var(--warning-soft)] px-2 py-1 text-xs text-[var(--warning)]">
                                  <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />{row.dietary_notes}
                                </p>
                              )}
                            </div>
                            <div className="flex w-full flex-row flex-wrap items-center justify-between gap-2 sm:w-auto sm:flex-col sm:items-end">
                              {statusBadge(paid)}
                              <p className="text-lg font-semibold text-[var(--foreground)] tabular-nums">{formatCurrency(row.amount_cents)}</p>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted-foreground)]">
                            <span className="inline-flex items-center gap-1 rounded border border-[var(--border)] bg-[var(--card)] px-2 py-1">
                              <span className="text-[var(--muted-foreground)]">{t.booking}:</span><code className="break-all text-[var(--foreground)]">{row.code}</code>
                            </span>
                            <span>{methodLabel(row.payment_method)}</span>
                            <span>{t.bookedOn}: {formatDate(row.created_at)}</span>
                          </div>

                          <h4 className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                            {t.tickets} ({tickets.length}) · {enteredCount} {t.entered}
                          </h4>
                          <ul className="grid gap-2">
                            {tickets.map(ticket => <TeamDayAdminTicket key={ticket.id} ticket={ticket} paymentStatus={row.payment_status} idPrefix="m-" onChanged={() => setRefreshKey(key => key + 1)} />)}
                          </ul>

                          <div className="mt-3 border-t border-[var(--border)] pt-3">
                            {paymentButton(row, paid, true)}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {pageCount > 1 && (
                <div className="sft-day-pagination mt-4 flex items-center justify-between gap-2">
                  <Button type="button" variant="outline" className="h-11" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                    <ChevronLeft size={18} aria-hidden="true" />{t.previous}
                  </Button>
                  <p className="text-sm text-[var(--muted-foreground)] tabular-nums">{t.page} {page + 1} / {pageCount}</p>
                  <Button type="button" variant="outline" className="h-11" disabled={(page + 1) * PAGE_SIZE >= stats.total} onClick={() => setPage(p => p + 1)}>
                    {t.next}<ChevronRight size={18} aria-hidden="true" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
