'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Alert, AlertDescription, Button, Card, CardContent, Input, Label } from '@sft/design-system';
import { ArrowUpRight, Banknote, CalendarDays, CheckCircle2, Landmark, Loader2, MapPin, Smartphone, Wallet } from 'lucide-react';
import { submitTeamDayRegistration } from '@/app/actions/team-day';
import { useLanguage } from '@/app/context/LanguageContext';
import { teamDayTranslations } from '@/app/translations/team-day';

import type { TeamDayPayment as Payment, TeamDayBankTransfer as BankTransfer } from '@/app/lib/team-day-validation';
type RegistrationError = 'invalid' | 'unavailable' | 'closed' | 'duplicate';

export default function TeamDayClientPage({ paymentOptions, eventDate, priceEur }: { paymentOptions: { paypal: boolean; revolut: boolean; bankTransfer: boolean }; eventDate: string; priceEur: number }) {
  const { language } = useLanguage();
  const t = teamDayTranslations[language];
  const [payment, setPayment] = useState<Payment>('cash');
  const [requestId, setRequestId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<RegistrationError | null>(null);
  const [confirmation, setConfirmation] = useState<{ code: string; paymentUrl?: string; payment: Payment; bankTransfer?: BankTransfer } | null>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => { setRequestId(crypto.randomUUID()); }, []);
  useEffect(() => { if (confirmation) successHeading.current?.focus(); }, [confirmation]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !requestId) return;
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitTeamDayRegistration({
        firstName: String(data.get('firstName') ?? ''),
        lastName: String(data.get('lastName') ?? ''),
        email: String(data.get('email') ?? ''),
        payment,
        privacyAccepted: data.get('privacyAccepted') === 'on',
        website: String(data.get('website') ?? ''),
        requestId,
      });
      if (result.success) setConfirmation({ code: result.code, paymentUrl: result.paymentUrl, bankTransfer: result.bankTransfer, payment });
      else setError(result.error);
    } catch {
      setError('unavailable');
    } finally {
      setSubmitting(false);
    }
  }

  const methods = [
    { id: 'cash' as const, name: t.cash, Icon: Banknote, available: true },
    { id: 'paypal' as const, name: 'PayPal', Icon: Wallet, available: paymentOptions.paypal },
    { id: 'revolut' as const, name: 'Revolut', Icon: Smartphone, available: paymentOptions.revolut },
    { id: 'bank_transfer' as const, name: t.bankTransfer, Icon: Landmark, available: paymentOptions.bankTransfer ?? false },
  ];
  const price = new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(priceEur);

  return <main className="sft-root sft-content-page sft-team-day-page">
    <div className="sft-page-container">
      <header className="sft-page-intro">
        <div><p className="sft-eyebrow">{t.eyebrow}</p><h1 className="sft-display">{t.title}</h1></div>
        <p>{t.intro}</p>
      </header>
      <div className="sft-team-day-grid">
        <aside className="sft-team-day-details" aria-label={t.title}>
          <dl>
            <div><dt><CalendarDays aria-hidden="true" /></dt><dd><time dateTime={`${eventDate}T12:00:00+01:00`}>{t.date}</time></dd></div>
            <div><dt><MapPin aria-hidden="true" /></dt><dd>{t.location}</dd></div>
          </dl>
          <p className="sft-team-day-program">{t.program}</p>
          <div className="sft-team-day-contribution">
            <p className="sft-team-day-contribution-title">{t.supportTitle}</p>
            <p>{t.supportBefore}<span>{price} {t.perPerson}</span>{t.supportAfter}</p>
          </div>
          <a href="mailto:sapienzafoilingteam@gmail.com">{t.questions}<ArrowUpRight size={16} aria-hidden="true" /></a>
          <div className="sft-team-day-links">
            <Button asChild variant="brand"><a href="#team-day-registration">{t.goToForm}</a></Button>
            <Button asChild variant="outline"><a href="https://www.google.com/maps/search/?api=1&query=Aeroporto+dell%27Urbe+Via+Salaria+825+Roma" target="_blank" rel="noopener noreferrer">{t.map}<ArrowUpRight size={16} aria-hidden="true" /></a></Button>
          </div>
          <a className="sft-team-day-poster" href="/events/sft-team-day-2026-11-08.png" target="_blank" rel="noopener noreferrer" aria-label={t.openPoster}>
            <Image src="/events/sft-team-day-2026-11-08.png" alt={t.posterAlt} width={1080} height={1350} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1320px) 40vw, 480px" />
          </a>
        </aside>
        <Card id="team-day-registration" className="sft-team-day-card"><CardContent>
          {confirmation ? <section className="sft-team-day-confirmation" role="status" aria-labelledby="team-day-success">
            <CheckCircle2 size={36} aria-hidden="true" />
            <h2 id="team-day-success" className="sft-display" tabIndex={-1} ref={successHeading}>{t.success}</h2>
            <p>{t.successDetail}</p>
            <dl className="sft-team-day-code"><dt>{t.code}</dt><dd>{confirmation.code}</dd></dl>
            <p>{confirmation.payment === 'cash' ? t.cashSuccess : confirmation.payment === 'bank_transfer' ? t.bankSuccess : t.onlineSuccess}</p>
            {confirmation.payment === 'bank_transfer' && confirmation.bankTransfer && <dl className="sft-team-day-bank-details">
              <div><dt>{t.accountHolder}</dt><dd>{confirmation.bankTransfer.accountHolder}</dd></div>
              <div><dt>IBAN</dt><dd className="sft-team-day-bank-mono">{confirmation.bankTransfer.iban}</dd></div>
              <div><dt>{t.bankReference}</dt><dd className="sft-team-day-bank-mono">{confirmation.bankTransfer.reference}</dd></div>
              <div><dt>{t.bankAmount}</dt><dd>{new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(confirmation.bankTransfer.amountCents / 100)}</dd></div>
            </dl>}
            {confirmation.payment !== 'bank_transfer' && confirmation.paymentUrl && <Button asChild variant="brand"><a href={confirmation.paymentUrl} target="_blank" rel="noopener noreferrer">{t.pay}<ArrowUpRight aria-hidden="true" /></a></Button>}
          </section> : <form onSubmit={handleSubmit} className="sft-team-day-form">
            <div><h2 className="sft-display">{t.registration}</h2><p>{t.onePerson}</p></div>
            <fieldset disabled={submitting} className="sft-team-day-fields">
              <legend className="sr-only">{t.registration}</legend>
              <div className="sft-team-day-names">
                <div><Label htmlFor="team-day-first-name">{t.firstName} *</Label><Input id="team-day-first-name" name="firstName" autoComplete="given-name" required maxLength={80} /></div>
                <div><Label htmlFor="team-day-last-name">{t.lastName} *</Label><Input id="team-day-last-name" name="lastName" autoComplete="family-name" required maxLength={80} /></div>
              </div>
              <div><Label htmlFor="team-day-email">{t.email} *</Label><Input id="team-day-email" type="email" name="email" autoComplete="email" required maxLength={254} /></div>
              <div hidden aria-hidden="true"><label htmlFor="team-day-website">Website</label><input id="team-day-website" name="website" tabIndex={-1} autoComplete="off" /></div>
              <fieldset className="sft-team-day-payment"><legend>{t.payment} *</legend>
                {methods.map(({ id, name, Icon, available }) => <label key={id} className="sft-team-day-method" data-selected={payment === id} data-disabled={!available}>
                  <input type="radio" name="payment" value={id} checked={payment === id} disabled={!available} required onChange={() => setPayment(id)} />
                  <Icon size={20} aria-hidden="true" /><span>{name}{!available && <small>{t.unavailablePayment}</small>}</span>
                </label>)}
                <p>{payment === 'cash' ? t.cashDetail : payment === 'bank_transfer' ? t.bankDetail : t.onlineDetail}</p>
              </fieldset>
              <p id="team-day-data-notice">{t.dataNotice}</p>
              <div className="sft-team-day-privacy"><input id="team-day-privacy" type="checkbox" name="privacyAccepted" required aria-describedby="team-day-data-notice" /><Label htmlFor="team-day-privacy">{t.privacy}<Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">{t.privacyLink}</Link>. *</Label></div>
            </fieldset>
            {error && <Alert variant="destructive" role="alert"><AlertDescription>{t.errors[error]}</AlertDescription></Alert>}
            <Button type="submit" variant="brand" size="lg" disabled={submitting || !requestId || error === 'closed'} aria-busy={submitting}>{submitting && <Loader2 className="animate-spin" aria-hidden="true" />}{submitting ? t.submitting : t.submit}</Button>
          </form>}
        </CardContent></Card>
      </div>
    </div>
  </main>;
}
