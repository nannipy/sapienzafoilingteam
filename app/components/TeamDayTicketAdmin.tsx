'use client';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, Label } from '@sft/design-system';
import {
  AlertTriangle, Archive, ArchiveRestore, Ban, Check, CheckCircle2, ChevronDown, ChevronUp, Clock,
  Copy, Download, ExternalLink, Loader2, Mail, QrCode, ScanLine, Square, Wallet, XCircle,
} from 'lucide-react';
import { controlTeamDayTicket, resendTeamDayTicket, retryTeamDayEmails, setTeamDayPaymentStatus, setTeamDayParticipantArchived } from '@/app/actions/team-day-admin';
import { useLanguage } from '@/app/context/LanguageContext';
import { personState, ticketQrValue, type PersonState, type TeamDayTicket, type TicketControlResult } from '@/app/lib/team-day-ticket-types';

const copy = {
  it: {
    title: 'Controllo ingressi', hint: 'Inquadra il QR del biglietto oppure inserisci il codice personale.',
    resultHint: 'Il risultato della verifica comparirà qui: nome, pagamento e stato d’ingresso.',
    code: 'QR o codice del biglietto', verify: 'Verifica', scan: 'Scansiona QR', stop: 'Ferma fotocamera',
    admit: 'Registra ingresso', scanHint: 'Inquadra il QR del biglietto all’interno del riquadro.',
    valid: 'Biglietto valido. Verifica il nome prima di registrare l’ingresso.', used: 'Ingresso già registrato. Non ammettere di nuovo.',
    cancelled: 'Biglietto annullato. Ingresso non consentito.', admitted: 'Ingresso registrato.', not_found: 'Biglietto non trovato per questo evento.',
    archived: 'Persona archiviata. Non ammettere all’ingresso.',
    paidBadge: 'Pagato', unpaidBadge: 'Da pagare', enteredBadge: 'Entrato', notEnteredBadge: 'Non ancora entrato', archivedBadge: 'Archiviata',
    personState: 'Stato persona', states3: { booked: 'Prenotato', paid: 'Pagato', entered: 'Entrato' },
    fee: 'Quota', markPaid: 'Segna come pagato', paidNow: 'Quota segnata come pagata.',
    unpaidWarning: 'Pagamento non verificato: incassa la quota prima di ammettere.',
    error: 'Operazione non riuscita. Riprova.', cameraError: 'Fotocamera non disponibile. Consenti l’accesso oppure inserisci il codice manualmente.',
    resend: 'Invia / reinvia email', cancel: 'Annulla biglietto', confirm: 'Annullare il biglietto? Non sarà più valido per l’ingresso.',
    archive: 'Archivia persona', restore: 'Ripristina persona', archiveConfirm: 'Archiviare questa persona? Sparirà dall’elenco prenotazioni e il QR non sarà più ammesso.',
    archiveDone: 'Persona archiviata.', restoreDone: 'Persona ripristinata.', migrationRequired: 'Archivio non disponibile: applica la migrazione del database e ricarica.',
    open: 'Apri biglietto', pdf: 'Scarica PDF', showQr: 'Mostra QR', hideQr: 'Nascondi QR', downloadQr: 'Scarica QR', checkIn: 'Registra ingresso',
    qrHint: 'Mostra questo codice allo staff all’ingresso. Non condividerlo: vale un solo ingresso.',
    qrUnavailable: 'QR non disponibile. Apri il biglietto per visualizzarlo.',
    copyCode: 'Copia codice', copied: 'Codice copiato',
    retry: 'Recupera email in sospeso', done: 'Operazione completata. Controlla lo stato del biglietto e dell’email.',
    email: 'Email', noEmail: 'Nessuna email',
    cash: 'Contanti all’evento', bankTransfer: 'Bonifico bancario',
    emailStatuses: { suppressed: 'Invio disattivato: biglietto annullato', pending: 'Email in attesa', sending: 'Invio in corso', sent: 'Email inviata al servizio', failed: 'Invio fallito: riprovabile', review: 'Invio da riconciliare con il provider', no_email: 'Nessuna email' },
    states: { valid: 'Valido', used: 'Utilizzato', cancelled: 'Annullato' }, time: 'Ingresso',
  },
  en: {
    title: 'Entry control', hint: 'Scan the ticket QR or type the personal code.',
    resultHint: 'The check result will appear here: name, payment and entry state.',
    code: 'Ticket QR or code', verify: 'Verify', scan: 'Scan QR', stop: 'Stop camera',
    admit: 'Record admission', scanHint: 'Hold the ticket QR inside the frame.',
    valid: 'Valid ticket. Check the name before recording admission.', used: 'Already checked in. Do not admit again.',
    cancelled: 'Cancelled ticket. Do not admit.', admitted: 'Admission recorded.', not_found: 'Ticket not found for this event.',
    archived: 'Archived person. Do not admit.',
    paidBadge: 'Paid', unpaidBadge: 'Payment due', enteredBadge: 'Entered', notEnteredBadge: 'Not entered yet', archivedBadge: 'Archived',
    personState: 'Person state', states3: { booked: 'Booked', paid: 'Paid', entered: 'Entered' },
    fee: 'Fee', markPaid: 'Mark as paid', paidNow: 'Fee marked as paid.',
    unpaidWarning: 'Payment not verified: collect the fee before admitting.',
    error: 'Operation failed. Please retry.', cameraError: 'Camera unavailable. Allow access or enter the code manually.',
    resend: 'Send / resend email', cancel: 'Cancel ticket', confirm: 'Cancel this ticket? It will no longer allow entry.',
    archive: 'Archive person', restore: 'Restore person', archiveConfirm: 'Archive this person? They will disappear from the bookings list and their QR will no longer be admitted.',
    archiveDone: 'Person archived.', restoreDone: 'Person restored.', migrationRequired: 'Archive unavailable: apply the database migration and reload.',
    open: 'Open ticket', pdf: 'Download PDF', showQr: 'Show QR', hideQr: 'Hide QR', downloadQr: 'Download QR', checkIn: 'Record entry',
    qrHint: 'Show this code to staff at the entrance. Keep it private: it allows one admission.',
    qrUnavailable: 'QR unavailable. Open the ticket to display it.',
    copyCode: 'Copy code', copied: 'Code copied',
    retry: 'Retry pending emails', done: 'Operation completed. Check ticket and email status.',
    email: 'Email', noEmail: 'No email',
    cash: 'Cash at the event', bankTransfer: 'Bank transfer',
    emailStatuses: { suppressed: 'Email suppressed: cancelled ticket', pending: 'Email pending', sending: 'Sending', sent: 'Accepted by email service', failed: 'Delivery failed: retry available', review: 'Reconcile delivery with provider', no_email: 'No email' },
    states: { valid: 'Valid', used: 'Used', cancelled: 'Cancelled' }, time: 'Checked in',
  },
};

function methodLabel(method: string | undefined, t: (typeof copy)['it']) {
  return method === 'cash' ? t.cash : method === 'bank_transfer' ? t.bankTransfer : method === 'paypal' ? 'PayPal' : method === 'revolut' ? 'Revolut' : '';
}

function PersonSteps({ state, label, labels }: { state: PersonState; label: string; labels: Record<PersonState, string> }) {
  const order: PersonState[] = ['booked', 'paid', 'entered'];
  const current = order.indexOf(state);
  return (
    <ol aria-label={label} className="mt-2 grid max-w-md grid-cols-3 gap-1">
      {order.map((step, index) => (
        <li key={step} aria-current={step === state ? 'step' : undefined}
          className={`flex items-center justify-center gap-1 rounded-md border px-1 py-1 text-[11px] font-medium ${index <= current ? 'border-transparent bg-[var(--success-soft)] text-[var(--success)]' : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]'}`}>
          {index < current ? <Check size={12} aria-hidden="true" /> : <span aria-hidden="true">{index + 1}</span>}
          {labels[step]}
        </li>
      ))}
    </ol>
  );
}

export function TeamDayEntryControl({ onChanged }: { onChanged: () => void }) {
  const { language } = useLanguage(); const t = copy[language];
  const [code, setCode] = useState(''); const [result, setResult] = useState<TicketControlResult | null>(null);
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [scanning, setScanning] = useState(false);
  const lock = useRef(false); const video = useRef<HTMLVideoElement>(null);
  const controls = useRef<{ stop: () => void } | null>(null); const scanGeneration = useRef(0);
  function stop() { scanGeneration.current++; controls.current?.stop(); controls.current = null; setScanning(false); }
  useEffect(() => () => { scanGeneration.current++; controls.current?.stop(); }, []);
  async function act(value: string, action: 'verify' | 'check_in') {
    if (lock.current) return; lock.current = true; setBusy(true); setMessage(''); setResult(null);
    try { setResult(await controlTeamDayTicket(value, action)); if (action === 'check_in') onChanged(); }
    catch { setMessage(t.error); } finally { lock.current = false; setBusy(false); }
  }
  async function markPaid() {
    if (lock.current || !result?.registrationId) return;
    lock.current = true; setBusy(true); setMessage('');
    try {
      await setTeamDayPaymentStatus(result.registrationId, 'paid');
      setResult(current => current ? { ...current, paymentStatus: 'paid' } : current);
      setMessage(t.paidNow);
      onChanged();
    } catch { setMessage(t.error); } finally { lock.current = false; setBusy(false); }
  }
  async function scan() {
    if (scanning || busy) return;
    const generation = ++scanGeneration.current; setScanning(true); setMessage(''); setResult(null);
    try {
      const { BrowserQRCodeReader } = await import('@zxing/browser');
      if (generation !== scanGeneration.current) return;
      if (!video.current) await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (generation !== scanGeneration.current || !video.current) return;
      const reader = new BrowserQRCodeReader();
      const streamControls = await reader.decodeFromVideoDevice(undefined, video.current, (decoded, _error, controller) => {
        if (decoded && generation === scanGeneration.current) { controller.stop(); stop(); setCode(decoded.getText()); void act(decoded.getText(), 'verify'); }
      });
      if (generation !== scanGeneration.current) streamControls.stop(); else controls.current = streamControls;
    } catch { if (generation === scanGeneration.current) { stop(); setMessage(t.cameraError); } }
  }

  const known = result && result.result !== 'not_found';
  const paid = result?.paymentStatus === 'paid';
  const paymentKnown = result?.paymentStatus === 'paid' || result?.paymentStatus === 'pending';
  const entered = result?.result === 'admitted' || result?.result === 'used' || Boolean(result?.ticket?.checked_in_at);
  const archived = result?.result === 'archived';
  const state: PersonState | null = known ? (entered ? 'entered' : paid ? 'paid' : 'booked') : null;
  const tone = archived ? 'border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)]'
    : result?.result === 'valid' || result?.result === 'admitted' ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
      : result?.result === 'used' ? 'border-[var(--warning)] bg-[var(--warning-soft)] text-[var(--warning)]'
        : 'border-[var(--destructive)] bg-[var(--destructive)]/5 text-[var(--destructive)]';

  return (
    <section className="sft-day-entry rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 mb-6 lg:mb-8" aria-labelledby="entry-title">
      <div className="sft-day-entry-header mb-4">
        <h2 id="entry-title" className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-[var(--foreground)]">
          <ScanLine size={20} className="text-brand" aria-hidden="true" />{t.title}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t.hint}</p>
      </div>

      <div className="sft-day-entry-grid">
        <div className="min-w-0">
          <form className="sft-day-entry-form grid gap-2" onSubmit={e => { e.preventDefault(); stop(); void act(code, 'verify'); }}>
            <Label htmlFor="ticket-code">{t.code}</Label>
            <div className="sft-day-code-row flex flex-col gap-2 sm:flex-row">
              <Input id="ticket-code" value={code} required maxLength={100} autoComplete="off" autoCapitalize="none" spellCheck={false}
                inputMode="text" className="h-12 text-base" onChange={e => { setCode(e.target.value); setResult(null); }} />
              <Button type="submit" variant="default" size="lg" className="h-12 w-full sm:w-auto sm:min-w-32" disabled={busy || !code.trim()}>
                {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}{t.verify}
              </Button>
            </div>
          </form>

          <Button type="button" variant="outline" size="lg" className="sft-day-scan-button mt-2 h-12 w-full sm:w-auto sm:min-w-52" disabled={busy} onClick={() => scanning ? stop() : void scan()}>
            {scanning ? <Square size={18} aria-hidden="true" /> : <QrCode size={18} aria-hidden="true" />}{scanning ? t.stop : t.scan}
          </Button>

          {scanning && (
            <div className="relative mt-4 max-w-md overflow-hidden rounded-xl bg-black lg:max-w-sm">
              <video ref={video} muted playsInline className="max-h-[60vh] w-full object-contain" aria-label={t.scan} />
              <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 text-center text-sm text-white">{t.scanHint}</p>
            </div>
          )}

          <div className="sft-day-email-retry mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-3 lg:mt-5">
            <Button type="button" variant="outline" size="sm" className="h-10 w-full sm:w-auto" disabled={busy} onClick={async () => {
              if (lock.current) return; lock.current = true; setBusy(true); setMessage('');
              try { const outcome = await retryTeamDayEmails(); setMessage(`${t.done} ${outcome.processed} ${language === 'it' ? 'inviate' : 'sent'}, ${outcome.errors} ${language === 'it' ? 'non inviate' : 'failed'}.`); onChanged(); }
              catch { setMessage(t.error); } finally { lock.current = false; setBusy(false); }
            }}>
              <Mail size={16} aria-hidden="true" />{t.retry}
            </Button>
          </div>
        </div>

        <div role="status" aria-live="polite" className="sft-day-entry-result mt-4 min-w-0 lg:mt-0">
          <div className="grid gap-3">
            {message && <p className="rounded-lg border border-transparent bg-[var(--warning-soft)] p-3 text-sm text-[var(--warning)]">{message}</p>}
            {result ? (
              <div className={`rounded-xl border p-4 ${tone}`}>
                <p className="flex items-center gap-2 text-base font-semibold">
                  {archived ? <Archive size={20} aria-hidden="true" />
                    : result.result === 'valid' || result.result === 'admitted' ? <CheckCircle2 size={20} aria-hidden="true" />
                      : result.result === 'used' ? <AlertTriangle size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}
                  {t[result.result]}
                </p>
                {(result.firstName || result.lastName) && <p className="mt-1 text-lg font-semibold">{result.firstName} {result.lastName}</p>}
                {known && state && (
                  <>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-medium">
                      {paymentKnown && <span className={`rounded-full border px-2 py-0.5 ${paid ? 'border-transparent bg-[var(--success-soft)] text-[var(--success)]' : 'border-transparent bg-[var(--warning-soft)] text-[var(--warning)]'}`}>{paid ? t.paidBadge : t.unpaidBadge}</span>}
                      <span className={`rounded-full border px-2 py-0.5 ${entered ? 'border-transparent bg-[var(--info-soft)] text-[var(--info)]' : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]'}`}>{entered ? t.enteredBadge : t.notEnteredBadge}</span>
                      {archived && <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-[var(--muted-foreground)]">{t.archivedBadge}</span>}
                    </div>
                    <PersonSteps state={state} label={t.personState} labels={t.states3} />
                  </>
                )}
                {result.amountCents != null && <p className="mt-2 text-xs">{t.fee}: <span className="font-semibold">{new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-GB', { style: 'currency', currency: 'EUR' }).format(result.amountCents / 100)}</span> · {methodLabel(result.paymentMethod, t)}</p>}
                {result.ticket?.checked_in_at && <p className="mt-1 text-sm">{t.time}: {new Date(result.ticket.checked_in_at).toLocaleString(language === 'it' ? 'it-IT' : 'en-GB', { timeZone: 'Europe/Rome' })}</p>}
                {result.result === 'valid' && paymentKnown && !paid && <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-transparent bg-[var(--warning-soft)] px-2 py-1 text-xs text-[var(--warning)]"><AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />{t.unpaidWarning}</p>}
                {!archived && !paid && result.registrationId && (result.result === 'valid' || result.result === 'admitted') && (
                  <Button type="button" variant="outline" size="lg" className="mt-3 h-12 w-full sm:w-auto sm:min-w-52" disabled={busy} onClick={() => void markPaid()}>
                    <Wallet size={18} aria-hidden="true" />{t.markPaid}
                  </Button>
                )}
                {result.result === 'valid' && result.ticket && (
                  <Button type="button" variant="default" size="lg" className="mt-2 h-12 w-full sm:ml-2 sm:mt-3 sm:w-auto sm:min-w-52" disabled={busy} onClick={() => void act(result.ticket!.code, 'check_in')}>
                    {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}{t.admit}
                  </Button>
                )}
              </div>
            ) : !message && (
              <div className="sft-day-entry-placeholder"><ScanLine size={28} aria-hidden="true" /><p>{t.resultHint}</p></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const statusTone: Record<TeamDayTicket['status'], string> = {
  valid: 'border-transparent bg-[var(--success-soft)] text-[var(--success)]',
  used: 'border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)]',
  cancelled: 'border-transparent bg-[var(--destructive)]/5 text-[var(--destructive)]',
};
const emailTone: Record<TeamDayTicket['emailStatus'], string> = {
  sent: 'text-[var(--success)]', pending: 'text-[var(--warning)]', sending: 'text-[var(--warning)]', failed: 'text-[var(--destructive)]',
  review: 'text-[var(--warning)]', suppressed: 'text-[var(--muted-foreground)]', no_email: 'text-[var(--muted-foreground)]',
};

export function TeamDayAdminTicket({ ticket, onChanged, paymentStatus, idPrefix = 'm-' }: { ticket: TeamDayTicket; onChanged: () => void; paymentStatus?: TeamDayTicket['paymentStatus']; idPrefix?: string }) {
  const { language } = useLanguage(); const t = copy[language];
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const [showQr, setShowQr] = useState(false); const [qr, setQr] = useState<string | null>(null);
  const [qrFailed, setQrFailed] = useState(false); const [copied, setCopied] = useState(false);
  const lock = useRef(false); const requestId = useRef<string | null>(null);
  const archived = Boolean(ticket.archivedAt);
  const state = personState({ ...ticket, paymentStatus: paymentStatus ?? ticket.paymentStatus });

  useEffect(() => {
    if (!showQr || qr) return;
    let active = true;
    import('qrcode')
      .then(module => module.toDataURL(ticketQrValue(ticket.code), { width: 320, margin: 2, errorCorrectionLevel: 'M' }))
      .then(url => { if (active) setQr(url); })
      .catch(() => { if (active) setQrFailed(true); });
    return () => { active = false; };
  }, [showQr, qr, ticket.code]);

  async function mutate(kind: 'resend' | 'cancel') {
    if (lock.current) return;
    if (kind === 'cancel' && !window.confirm(t.confirm)) return;
    lock.current = true; setBusy(true); setMessage('');
    try {
      if (kind === 'resend') { requestId.current ??= crypto.randomUUID(); const outcome = await resendTeamDayTicket(ticket.id, requestId.current); setMessage(outcome === 'sent' ? t.emailStatuses.sent : outcome === 'failed' ? t.emailStatuses.failed : t.emailStatuses.pending); }
      else { await controlTeamDayTicket(ticket.code, 'cancel'); setMessage(t.done); }
      onChanged();
    } catch { setMessage(t.error); } finally { lock.current = false; setBusy(false); }
  }
  async function checkIn() {
    if (lock.current || archived || ticket.status !== 'valid') return;
    lock.current = true; setBusy(true); setMessage('');
    try {
      const result = await controlTeamDayTicket(ticket.code, 'check_in');
      setMessage(result.result === 'admitted' ? t.admitted : t[result.result]);
      onChanged();
    } catch { setMessage(t.error); } finally { lock.current = false; setBusy(false); }
  }
  async function toggleArchive() {
    if (lock.current) return;
    const next = !archived;
    if (next && !window.confirm(t.archiveConfirm)) return;
    lock.current = true; setBusy(true); setMessage('');
    try {
      await setTeamDayParticipantArchived(ticket.participant_id, next);
      setMessage(next ? t.archiveDone : t.restoreDone);
      onChanged();
    } catch (error) { setMessage(error instanceof Error && error.message === 'MIGRATION_REQUIRED' ? t.migrationRequired : t.error); } finally { lock.current = false; setBusy(false); }
  }
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(ticket.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard may be unavailable */ }
  }

  const email = ticket.deliveryEmail ?? ticket.email;
  const pdfHref = `/sft-day/tickets/${ticket.code}/pdf`;
  return (
    <li className={`sft-day-ticket rounded-xl border bg-[var(--card)] p-3 sm:p-4 ${archived ? 'border-[var(--border)] bg-[var(--muted)] opacity-80' : 'border-[var(--border)]'}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 break-words font-semibold text-[var(--foreground)]">{ticket.firstName} {ticket.lastName}</p>
        <div className="flex shrink-0 items-center gap-1">
          {archived && <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-xs font-medium text-[var(--muted-foreground)]">{t.archivedBadge}</span>}
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusTone[ticket.status]}`}>{t.states[ticket.status]}</span>
        </div>
      </div>
      <PersonSteps state={state} label={t.personState} labels={t.states3} />
      {ticket.dietaryNotes && (
        <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-transparent bg-[var(--warning-soft)] px-2 py-1 text-xs text-[var(--warning)]">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />{ticket.dietaryNotes}
        </p>
      )}
      <p className="mt-2 text-xs text-[var(--muted-foreground)]">
        <span className="font-medium text-[var(--foreground)]">{t.email}:</span>{' '}
        {email ? <a className="break-all underline" href={`mailto:${email}`}>{email}</a> : t.noEmail}
        {' · '}<span className={emailTone[ticket.emailStatus]}>{t.emailStatuses[ticket.emailStatus]}</span>
      </p>
      {ticket.checked_in_at && <p className="mt-1 text-xs text-[var(--muted-foreground)]">{t.time}: {new Date(ticket.checked_in_at).toLocaleString(language === 'it' ? 'it-IT' : 'en-GB', { timeZone: 'Europe/Rome' })}</p>}

      <div className="mt-2 flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] py-1 pl-2 pr-1">
        <code className="min-w-0 flex-1 break-all text-xs text-[var(--muted-foreground)]">{ticket.code}</code>
        <Button type="button" variant="ghost" size="sm" className="h-8 shrink-0" onClick={() => void copyCode()} aria-label={copied ? t.copied : t.copyCode}>
          {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
          <span className="hidden sm:inline">{copied ? t.copied : t.copyCode}</span>
        </Button>
      </div>

      <div className="sft-day-ticket-actions mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {ticket.status === 'valid' && !archived && (
          <Button type="button" variant="default" size="sm" className="h-10 sm:w-auto" disabled={busy} onClick={() => void checkIn()}>
            {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <CheckCircle2 size={16} aria-hidden="true" />}{t.checkIn}
          </Button>
        )}
        <Button type="button" variant="outline" size="sm" className="h-10 sm:w-auto" aria-expanded={showQr} aria-controls={`qr-${idPrefix}${ticket.id}`} onClick={() => setShowQr(value => !value)}>
          <QrCode size={16} aria-hidden="true" />{showQr ? t.hideQr : t.showQr}
          {showQr ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
        </Button>
        <Button asChild variant="outline" size="sm" className="h-10 sm:w-auto">
          <a href={pdfHref}><Download size={16} aria-hidden="true" />{t.pdf}</a>
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-10 sm:w-auto" disabled={busy || archived || !email || ticket.status === 'cancelled' || ticket.emailStatus === 'review' || ticket.emailStatus === 'sending'} onClick={() => void mutate('resend')}>
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Mail size={16} aria-hidden="true" />}{t.resend}
        </Button>
      </div>

      {showQr && (
        <div id={`qr-${idPrefix}${ticket.id}`} className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] p-3 text-center">
          {qr ? (
            // Local data URL: the QR never goes to a third-party image service.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} width={220} height={220} alt={`QR ${ticket.firstName} ${ticket.lastName}`} className="mx-auto h-auto max-w-full rounded-lg bg-[var(--card)]" />
          ) : qrFailed ? (
            <p className="py-6 text-sm text-[var(--destructive)]">{t.qrUnavailable}</p>
          ) : (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--muted-foreground)]"><Loader2 className="h-5 w-5 animate-spin text-brand" aria-hidden="true" />{language === 'it' ? 'Generazione QR…' : 'Generating QR…'}</div>
          )}
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">{t.qrHint}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {qr && <Button asChild variant="outline" size="sm" className="h-10"><a href={qr} download={`SFT-Day-${ticket.code}.png`}><Download size={16} aria-hidden="true" />{t.downloadQr}</a></Button>}
            <Button asChild variant="outline" size="sm" className="h-10">
              <a href={`/sft-day/tickets/${ticket.code}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} aria-hidden="true" />{t.open}</a>
            </Button>
          </div>
        </div>
      )}

      <div className="sft-day-ticket-danger mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button type="button" variant="outline" size="sm" className="h-10 border-[var(--border)] text-[var(--destructive)] hover:bg-[var(--muted)] sm:w-auto" disabled={busy || archived || ticket.status !== 'valid'} onClick={() => void mutate('cancel')}>
          <Ban size={16} aria-hidden="true" />{t.cancel}
        </Button>
        <Button type="button" variant="ghost" size="sm" className={`h-10 ${archived ? 'text-brand' : 'text-[var(--muted-foreground)]'}`} disabled={busy} onClick={() => void toggleArchive()}>
          {archived ? <ArchiveRestore size={16} aria-hidden="true" /> : <Archive size={16} aria-hidden="true" />}{archived ? t.restore : t.archive}
        </Button>
      </div>
      {message && <p role="status" className="mt-2 text-sm text-[var(--foreground)]">{message}</p>}
    </li>
  );
}
