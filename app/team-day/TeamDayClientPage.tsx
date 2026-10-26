'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Alert, AlertDescription, Button, Card, CardContent, Input, Label } from '@sft/design-system';
import { ArrowLeft, ArrowUpRight, Banknote, CalendarDays, CheckCircle2, Landmark, Loader2, MapPin, Smartphone, Wallet } from 'lucide-react';
import TeamDayTicketCard from '@/app/components/TeamDayTicketCard';
import type { TicketView } from '@/app/lib/team-day-ticket-types';
import type { TeamDayParticipantInput } from '@/app/lib/team-day-validation';
import { submitTeamDayRegistration } from '@/app/actions/team-day';
import { useLanguage } from '@/app/context/LanguageContext';
import { teamDayTranslations } from '@/app/translations/team-day';

import type { TeamDayPayment as Payment, TeamDayBankTransfer as BankTransfer } from '@/app/lib/team-day-validation';
type RegistrationError = 'invalid' | 'unavailable' | 'closed' | 'duplicate';

export default function TeamDayClientPage({
  paymentOptions,
  eventDate,
  priceEur,
}: {
  paymentOptions: { paypal: boolean; revolut: boolean; bankTransfer: boolean };
  eventDate: string;
  priceEur: number;
}) {
  const { language } = useLanguage();
  const t = teamDayTranslations[language];
  const reduceMotion = useReducedMotion();
  const hasAdvanced = useRef(false);

  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [website, setWebsite] = useState('');

  const [participants, setParticipants] = useState<TeamDayParticipantInput[]>([]);
  const submissionLock = useRef(false);
  const [payment, setPayment] = useState<Payment>('cash');
  const [requestId, setRequestId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<RegistrationError | null>(null);
  const [clientValidationError, setClientValidationError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    code: string;
    tickets?: TicketView[];
    emailPending?: boolean;
    paymentUrl?: string;
    payment: Payment;
    bankTransfer?: BankTransfer;
  } | null>(null);

  const successHeading = useRef<HTMLHeadingElement>(null);
  const paymentHeading = useRef<HTMLHeadingElement>(null);
  const detailsHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try { const saved = sessionStorage.getItem('sft-day-request'); const id = saved || crypto.randomUUID(); sessionStorage.setItem('sft-day-request', id);setRequestId(id); } catch { setRequestId(crypto.randomUUID()); }
  }, []);

  function focusStep(heading: HTMLHeadingElement | null) {
    if (!heading) return;
    heading.focus({ preventScroll: true });
    const card = heading.closest('#team-day-registration');
    const bounds = card?.getBoundingClientRect();
    if (bounds && (bounds.top < 112 || bounds.top > window.innerHeight - 120)) {
      card?.scrollIntoView?.({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  function handleProceedToPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setClientValidationError(null);
    setError(null);

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirst || trimmedFirst.length > 80 || !trimmedLast || trimmedLast.length > 80) {
      setClientValidationError(t.errors.invalid);
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || trimmedEmail.length > 254) {
      setClientValidationError(t.errors.invalid);
      return;
    }

    if (!privacyAccepted) {
      setClientValidationError(t.errors.invalid);
      return;
    }

    hasAdvanced.current = true;
    setStep('payment');
  }

  function handleBackToDetails() {
    setClientValidationError(null);
    setError(null);
    setStep('details');
  }

  async function handleFinalSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submissionLock.current || submitting || !requestId) return;
    submissionLock.current = true;

    setSubmitting(true);
    setError(null);

    try {
      const result = await submitTeamDayRegistration({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        ...(dietaryNotes.trim() ? { dietaryNotes: dietaryNotes.trim() } : {}),
        payment,
        privacyAccepted,
        website,
        requestId,
        participants,
      });

      if (result.success) {
        try { sessionStorage.removeItem('sft-day-request'); } catch { /* Storage is optional. */ }
        setConfirmation({
          code: result.code,
          tickets: result.tickets,
          emailPending: result.emailPending,
          paymentUrl: result.paymentUrl,
          bankTransfer: result.bankTransfer,
          payment,
        });
      } else {
        setError(result.error);
      }
    } catch {
      setError('unavailable');
    } finally {
      setSubmitting(false);
      submissionLock.current = false;
    }
  }

  const methods = [
    { id: 'cash' as const, name: t.cash, Icon: Banknote, available: true },
    { id: 'paypal' as const, name: 'PayPal', Icon: Wallet, available: paymentOptions.paypal },
    { id: 'revolut' as const, name: 'Revolut', Icon: Smartphone, available: paymentOptions.revolut },
    { id: 'bank_transfer' as const, name: t.bankTransfer, Icon: Landmark, available: paymentOptions.bankTransfer ?? false },
  ];

  const price = new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(priceEur);

  return (
    <main className="sft-root sft-content-page sft-team-day-page">
      <div className="sft-page-container">
        <header className="sft-page-intro">
          <div>
            <p className="sft-eyebrow">{t.eyebrow}</p>
            <h1 className="sft-display">{t.title}</h1>
          </div>
          <p>{t.intro}</p>
        </header>

        <div className="sft-team-day-grid">
          <aside className="sft-team-day-details" aria-label={t.title}>
            <a className="sft-team-day-poster" href="/events/sft-team-day-2026-11-08-v2.png" target="_blank" rel="noopener noreferrer" aria-label={t.openPoster}>
              <Image priority src="/events/sft-team-day-2026-11-08-v2.png" alt={t.posterAlt} width={1080} height={1350} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1320px) 40vw, 480px" />
            </a>
            <dl>
              <div>
                <dt><CalendarDays aria-hidden="true" /></dt>
                <dd><time dateTime={`${eventDate}T11:00:00+01:00`}>{t.date}</time></dd>
              </div>
              <div>
                <dt><MapPin aria-hidden="true" /></dt>
                <dd>{t.location}</dd>
              </div>
            </dl>
            <p className="sft-team-day-program">{t.program}</p>
            <div className="sft-team-day-contribution">
              <p className="sft-team-day-contribution-title">{t.supportTitle}</p>
              <p>{t.supportBefore}<span>{price} {t.perPerson}</span>{t.supportAfter}</p>
            </div>
            <a href="mailto:sapienzafoilingteam@gmail.com">
              {t.questions}<ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <div className="sft-team-day-links">
              <Button asChild variant="brand"><a href="#team-day-registration">{t.goToForm}</a></Button>
              <Button asChild variant="outline">
                <a href="https://www.google.com/maps/search/?api=1&query=Aeroporto+dell%27Urbe+Via+Salaria+825+Roma" target="_blank" rel="noopener noreferrer">
                  {t.map}<ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </Button>
            </div>

          </aside>

          <Card id="team-day-registration" className="sft-team-day-card ph-no-capture">
            <CardContent>
              <AnimatePresence mode="wait" initial={false}>
                {confirmation ? (
                  <motion.section
                    key="step-confirmed"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    onAnimationComplete={() => focusStep(successHeading.current)}
                    className="sft-team-day-confirmation"
                    role="status"
                    aria-labelledby="team-day-success"
                  >
                    <CheckCircle2 size={36} aria-hidden="true" />
                    <h2 id="team-day-success" className="sft-display" tabIndex={-1} ref={successHeading}>{t.success}</h2>
                    <p>{t.successDetail}</p>
                    <dl className="sft-team-day-code">
                      <dt>{t.code}</dt>
                      <dd>{confirmation.code}</dd>
                    </dl>
                    <h3>{t.tickets}</h3>
                    {confirmation.emailPending && <p>{t.emailPending}</p>}
                    {confirmation.tickets?.map(ticket => <TeamDayTicketCard key={ticket.id} ticket={ticket} />)}
                    <p>{confirmation.payment === 'cash' ? t.cashSuccess : confirmation.payment === 'bank_transfer' ? t.bankSuccess : t.onlineSuccess}</p>
                    {confirmation.payment === 'bank_transfer' && confirmation.bankTransfer && (
                      <dl className="sft-team-day-bank-details">
                        <div><dt>{t.accountHolder}</dt><dd>{confirmation.bankTransfer.accountHolder}</dd></div>
                        <div><dt>IBAN</dt><dd className="sft-team-day-bank-mono">{confirmation.bankTransfer.iban}</dd></div>
                        <div><dt>{t.bankReference}</dt><dd className="sft-team-day-bank-mono">{confirmation.bankTransfer.reference}</dd></div>
                        <div><dt>{t.bankAmount}</dt><dd>{new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(confirmation.bankTransfer.amountCents / 100)}</dd></div>
                      </dl>
                    )}
                    {(confirmation.payment === 'paypal' || confirmation.payment === 'revolut') && confirmation.paymentUrl && (
                      <a
                        className="sft-team-day-provider-checkout"
                        data-provider={confirmation.payment}
                        href={confirmation.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t.pay} · ${confirmation.payment === 'paypal' ? 'PayPal' : 'Revolut'}`}
                      >
                        <span>{t.pay}</span>
                        <Image src={`/payments/${confirmation.payment}-wordmark.svg`} alt="" width={confirmation.payment === 'paypal' ? 129 : 113} height={confirmation.payment === 'paypal' ? 32 : 25} className="sft-team-day-provider-logo" unoptimized />
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </a>
                    )}
                  </motion.section>
                ) : step === 'details' ? (
                  <motion.form
                    key="step-details"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeInOut' }}
                    onAnimationComplete={() => { if (hasAdvanced.current) focusStep(detailsHeading.current); }}
                    onSubmit={handleProceedToPayment}
                    className="sft-team-day-form"
                  >
                    <div>
                      <div className="sft-team-day-step-header">
                        <h2 className="sft-display" tabIndex={-1} ref={detailsHeading}>{t.registration}</h2>
                        <span className="sft-team-day-step-indicator" aria-current="step">{t.stepIndicator} 1 {t.ofSteps} 2</span>
                      </div>
                      <p>{t.onePerson}</p>
                    </div>

                    <fieldset className="sft-team-day-fields">
                      <legend className="sr-only">{t.stepDetails}</legend>
                      <div className="sft-team-day-names">
                        <div>
                          <Label htmlFor="team-day-first-name">{t.firstName} *</Label>
                          <Input
                            id="team-day-first-name"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoComplete="given-name"
                            required
                            maxLength={80}
                          />
                        </div>
                        <div>
                          <Label htmlFor="team-day-last-name">{t.lastName} *</Label>
                          <Input
                            id="team-day-last-name"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="family-name"
                            required
                            maxLength={80}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="team-day-email">
                          {t.email} *
                        </Label>
                        <Input
                          id="team-day-email"
                          type="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          required
                          maxLength={254}
                        />
                      </div>

                      <div>
                        <Label htmlFor="team-day-dietary-notes">
                          {t.dietaryNotes} <span className="sft-team-day-optional">{t.optional}</span>
                        </Label>
                        <textarea
                          id="team-day-dietary-notes"
                          name="dietaryNotes"
                          value={dietaryNotes}
                          onChange={(e) => setDietaryNotes(e.target.value)}
                          placeholder={t.dietaryNotesPlaceholder}
                          maxLength={500}
                          className="sft-team-day-textarea"
                          rows={3}
                        />
                      </div>

                      <div hidden aria-hidden="true">
                        <label htmlFor="team-day-website">Website</label>
                        <input
                          id="team-day-website"
                          name="website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      <p>{t.emailHint}</p>
                      {participants.map((person, index) => <fieldset key={index} className="sft-team-day-fields sft-extra-participant">
                        <legend>{t.participantSummary} {index + 2}</legend>
                        <div className="sft-team-day-names">
                          {(['firstName','lastName'] as const).map(field => <div key={field}>
                            <Label htmlFor={`person-${index}-${field}`}>{t[field]} *</Label>
                            <Input id={`person-${index}-${field}`} required maxLength={80} value={person[field]}
                              onChange={e => setParticipants(current => current.map((p,i) => i === index ? { ...p,[field]:e.target.value } : p))} />
                          </div>)}
                        </div>
                        <Label htmlFor={`person-${index}-email`}>{t.email} {t.optional}</Label>
                        <Input id={`person-${index}-email`} type="email" maxLength={254} value={person.email ?? ''}
                          onChange={e => setParticipants(current => current.map((p,i) => i === index ? { ...p,email:e.target.value } : p))} />
                        <Label htmlFor={`person-${index}-notes`}>{t.dietaryNotes} {t.optional}</Label>
                        <textarea id={`person-${index}-notes`} maxLength={500} className="sft-team-day-textarea" value={person.dietaryNotes ?? ''}
                          onChange={e => setParticipants(current => current.map((p,i) => i === index ? { ...p,dietaryNotes:e.target.value } : p))} />
                        <Button type="button" variant="outline" onClick={() => setParticipants(current => current.filter((_,i) => i !== index))}>{t.removeParticipant} {index + 2}</Button>
                      </fieldset>)}
                      <Button type="button" variant="outline" disabled={participants.length >= 9}
                        onClick={() => setParticipants(current => [...current,{ firstName:'',lastName:'' }])}>{t.addParticipant}</Button>
                      <p id="team-day-data-notice">{t.dataNotice}</p>

                      <div className="sft-team-day-privacy">
                        <input
                          id="team-day-privacy"
                          type="checkbox"
                          name="privacyAccepted"
                          checked={privacyAccepted}
                          onChange={(e) => setPrivacyAccepted(e.target.checked)}
                          required
                          aria-describedby="team-day-data-notice"
                        />
                        <Label htmlFor="team-day-privacy">
                          {t.privacy}<Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">{t.privacyLink}</Link>. *
                        </Label>
                      </div>
                    </fieldset>

                    {clientValidationError && (
                      <Alert variant="destructive" role="alert">
                        <AlertDescription>{clientValidationError}</AlertDescription>
                      </Alert>
                    )}

                    <p className="sft-team-day-next-hint">{t.nextStepHint}</p>
                    <Button type="submit" variant="brand" size="lg">
                      {t.registerBtn}<ArrowUpRight size={18} aria-hidden="true" />
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="step-payment"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeInOut' }}
                    onAnimationComplete={() => focusStep(paymentHeading.current)}
                    onSubmit={handleFinalSubmit}
                    className="sft-team-day-form"
                  >
                    <div>
                      <button
                        type="button"
                        onClick={handleBackToDetails}
                        className="sft-team-day-back-btn"
                        disabled={submitting}
                      >
                        <ArrowLeft size={16} aria-hidden="true" />
                        {t.backToDetails}
                      </button>
                      <div className="sft-team-day-step-header">
                        <h2 className="sft-display" tabIndex={-1} ref={paymentHeading}>{t.stepPayment}</h2>
                        <span className="sft-team-day-step-indicator" aria-current="step">{t.stepIndicator} 2 {t.ofSteps} 2</span>
                      </div>
                      <dl className="sft-team-day-attendee-preview">
                        <dt>{t.participantSummary}</dt>
                        <dd>{firstName} {lastName} {email ? `(${email})` : ''}{participants.map((p,i) => <span className="block" key={i}>{p.firstName} {p.lastName}</span>)}</dd>
                      </dl>
                    </div>

                    <p>{t.total}: {new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-IE', { style:'currency',currency:'EUR' }).format(priceEur * (1 + participants.length))}</p>
                    <fieldset disabled={submitting} className="sft-team-day-fields">
                      <legend className="sr-only">{t.payment}</legend>
                      <fieldset className="sft-team-day-payment">
                        <legend>{t.payment} *</legend>
                        {methods.map(({ id, name, Icon, available }) => (
                          <label
                            key={id}
                            className="sft-team-day-method"
                            data-provider={id}
                            data-selected={payment === id}
                            data-disabled={!available}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={id}
                              checked={payment === id}
                              disabled={!available}
                              required
                              onChange={() => setPayment(id)}
                            />
                            {id === 'paypal' || id === 'revolut' ? (
                              <span className="sft-team-day-provider-option">
                                <Image src={`/payments/${id}-wordmark.svg`} alt="" width={id === 'paypal' ? 129 : 113} height={id === 'paypal' ? 32 : 25} className="sft-team-day-provider-logo" unoptimized />
                                <span className="sr-only">{name}</span>
                                {!available && <small>{t.unavailablePayment}</small>}
                              </span>
                            ) : <><Icon size={20} aria-hidden="true" /><span>{name}{!available && <small>{t.unavailablePayment}</small>}</span></>}
                          </label>
                        ))}
                        <p>{payment === 'cash' ? t.cashDetail : payment === 'bank_transfer' ? t.bankDetail : t.onlineDetail}</p>
                      </fieldset>
                    </fieldset>

                    {error && (
                      <Alert variant="destructive" role="alert">
                        <AlertDescription>{t.errors[error]}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      variant="brand"
                      size="lg"
                      disabled={submitting || !requestId || error === 'closed'}
                      aria-busy={submitting}
                    >
                      {submitting && <Loader2 className="animate-spin" aria-hidden="true" />}
                      {submitting ? t.submitting : t.submit}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
