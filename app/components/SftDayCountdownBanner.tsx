'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sftDayCountdownTranslations } from '../translations/sftDayPromo';
import { getSftDayCountdownPhase, getSftDayTimeLeft } from '../lib/sft-day-promo';
import './sft-day-countdown.css';

type Unit = 'days' | 'hours' | 'minutes' | 'seconds';
const UNITS: Unit[] = ['days', 'hours', 'minutes', 'seconds'];

export default function SftDayCountdownBanner({ registrationHref = '#team-day-registration' }: { registrationHref?: string }) {
  const { language } = useLanguage();
  const t = sftDayCountdownTranslations[language] || sftDayCountdownTranslations.it;
  // The clock starts after hydration so server and client markup always match.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const phase = now === null ? 'countdown' : getSftDayCountdownPhase(now);
  if (phase === 'ended') return null;

  const timeLeft = now === null ? null : getSftDayTimeLeft(now);
  const label = (unit: Unit, value: number) => t.units[unit][value === 1 ? 0 : 1];
  const title = { countdown: t.countdownTitle, 'final-days': t.finalDaysTitle, 'last-day': t.lastDayTitle, live: t.liveTitle }[phase];
  const message = { countdown: t.countdownMessage, 'final-days': t.finalDaysMessage, 'last-day': t.lastDayMessage, live: t.liveMessage }[phase];

  return (
    <section className="sft-day-countdown" data-phase={phase} aria-label={t.regionLabel}>
      <div className="sft-day-countdown-copy">
        <p className="sft-day-countdown-eyebrow"><span aria-hidden="true" />{t.eyebrow}</p>
        {/* Not a heading: the page h1 must stay the first heading. */}
        <p className="sft-day-countdown-title">{title}</p>
        <p className="sft-day-countdown-message">{message}</p>
      </div>
      {phase !== 'live' && (
        <div className="sft-day-countdown-side">
          {/* Ticking digits are hidden from assistive technology; the summary below updates once a minute. */}
          <ol className="sft-day-countdown-clock" aria-hidden="true">
            {UNITS.map(unit => {
              const value = timeLeft?.[unit];
              return (
                <li key={unit}>
                  <span className="sft-day-countdown-value">{value === undefined ? '--' : String(value).padStart(2, '0')}</span>
                  <span className="sft-day-countdown-unit">{label(unit, value ?? 0)}</span>
                </li>
              );
            })}
          </ol>
          {timeLeft && (
            <p className="sr-only">
              {`${t.remaining} ${timeLeft.days} ${label('days', timeLeft.days)}, ${timeLeft.hours} ${label('hours', timeLeft.hours)} ${t.and} ${timeLeft.minutes} ${label('minutes', timeLeft.minutes)}`}
            </p>
          )}
          <a className="sft-day-countdown-cta" href={registrationHref}>
            {t.cta}<ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      )}
    </section>
  );
}