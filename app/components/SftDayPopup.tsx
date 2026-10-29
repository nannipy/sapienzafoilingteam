'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePostHog } from 'posthog-js/react';
import { useLanguage } from '../context/LanguageContext';
import { sftDayCountdownTranslations, sftDayPromoTranslations } from '../translations/sftDayPromo';
import { SFT_DAY_STARTS_AT, getSftDayTimeLeft, isSftDayPromoActive } from '../lib/sft-day-promo';

const DISMISS_STORAGE_KEY = 'sft_day_popup_dismissed_until';
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // re-show after 24 hours
const UNITS = ['days', 'hours', 'minutes', 'seconds'] as const;

export default function SftDayPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { language } = useLanguage();
  const posthog = usePostHog();
  const reduceMotion = useReducedMotion();
  const t = sftDayPromoTranslations[language] || sftDayPromoTranslations.it;
  const tc = sftDayCountdownTranslations[language] || sftDayCountdownTranslations.it;
  const [now, setNow] = useState(() => Date.now());

  // Tick only while the popup is open.
  useEffect(() => {
    if (!isOpen) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const timeLeft = getSftDayTimeLeft(now);

  useEffect(() => {
    if (!isSftDayPromoActive()) return;
    if (pathname === '/sft-day' || pathname?.startsWith('/admin')) return;

    try {
      const dismissedUntil = localStorage.getItem(DISMISS_STORAGE_KEY);
      if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) return;
    } catch {
      // LocalStorage can fail in private mode; show the popup anyway.
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
      try {
        posthog?.capture('sft_day_popup_shown', { pathname, language });
      } catch {
        // Analytics failures must not affect the UI.
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [pathname, language, posthog]);

  const rememberDismissal = useCallback(() => {
    try {
      localStorage.setItem(
        DISMISS_STORAGE_KEY,
        (Date.now() + DISMISS_DURATION_MS).toString(),
      );
    } catch {
      // Ignore storage errors.
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    rememberDismissal();
    try {
      posthog?.capture('sft_day_popup_dismissed', { pathname });
    } catch {
      // Ignore analytics errors.
    }
  }, [pathname, posthog, rememberDismissal]);

  const handleCtaClick = useCallback(() => {
    setIsOpen(false);
    rememberDismissal();
    try {
      posthog?.capture('sft_day_popup_cta_clicked', { pathname });
    } catch {
      // Ignore analytics errors.
    }
  }, [pathname, posthog, rememberDismissal]);

  // Focus handling: move focus into the dialog, keep Tab inside it, restore
  // focus on close and lock background scrolling while it is open.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    cardRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleDismiss();
        return;
      }
      if (event.key !== 'Tab' || !cardRef.current) return;

      const focusable = Array.from(
        cardRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === cardRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, handleDismiss]);

  const motionProps = reduceMotion
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="sft-root sft-day-popup">
          <div
            className="sft-day-popup-backdrop"
            onClick={handleDismiss}
            aria-hidden="true"
          />

          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sft-day-popup-title"
            aria-describedby="sft-day-popup-lead"
            {...motionProps}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="sft-day-popup-card"
            tabIndex={-1}
          >
            <div className="sft-day-popup-stub" aria-hidden="true">
              <div>
                <span className="sft-day-popup-day">08</span>
                <span className="sft-day-popup-month">{t.stubMonth}</span>
                <span className="sft-day-popup-year">{t.stubYear}</span>
              </div>
              <Image
                className="sft-day-popup-poster"
                src="/events/sft-team-day-2026-11-08-v2.png"
                alt=""
                width={120}
                height={150}
                sizes="120px"
              />

              <span className="sft-day-popup-stub-note">{t.stubNote}</span>
            </div>

            <div className="sft-day-popup-body">
              <button
                type="button"
                onClick={handleDismiss}
                aria-label={t.closeAria}
                className="sft-day-popup-close"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <p className="sft-day-popup-eyebrow">
                <span className="sft-day-popup-eyebrow-dot" aria-hidden="true" />
                {t.eyebrow}
              </p>

              <h2 id="sft-day-popup-title" className="sft-day-popup-title">
                {t.title}
              </h2>

              <p id="sft-day-popup-lead" className="sft-day-popup-lead">
                {t.lead}
              </p>
                            <div className="sft-day-popup-info">
                <dl className="sft-day-popup-meta">
                  <div>
                    <dt>{t.dateLabel}</dt>
                    <dd>{t.date}</dd>
                  </div>
                  <div>
                    <dt>{t.locationLabel}</dt>
                    <dd>{t.location}</dd>
                  </div>
                  <div>
                    <dt>{t.priceLabel}</dt>
                    <dd>{t.price}</dd>
                  </div>
                </dl>
                {now < SFT_DAY_STARTS_AT && (
                  <div className="sft-day-popup-countdown">
                    <span className="sft-day-popup-countdown-label">{tc.eyebrow}</span>
                    <ol>
                      {UNITS.map(unit => (
                        <li key={unit}>
                          <span className="sft-day-popup-countdown-value">{String(timeLeft[unit]).padStart(2, '0')}</span>
                          <span className="sft-day-popup-countdown-unit">{tc.units[unit][timeLeft[unit] === 1 ? 0 : 1]}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>


              <div className="sft-day-popup-actions">
                <Link
                  href="/sft-day"
                  onClick={handleCtaClick}
                  className="sft-day-popup-cta"
                >
                  {t.cta}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="sft-day-popup-dismiss"
                >
                  {t.dismiss}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
