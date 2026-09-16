'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { recruitingPopupTranslations } from '../translations/recruitingPopup';
import { usePostHog } from 'posthog-js/react';

// Recruiting deadline: End of October 4th, 2026 (Rome time UTC+2)
const RECRUITING_DEADLINE = new Date('2026-10-04T23:59:59+02:00').getTime();
const DISMISS_STORAGE_KEY = 'sft_recruiting_popup_dismissed_until';
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours between re-shows

export default function RecruitingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { language } = useLanguage();
  const posthog = usePostHog();
  const t = recruitingPopupTranslations[language] || recruitingPopupTranslations.it;

  useEffect(() => {
    // 1. Check if the recruiting deadline has passed
    if (Date.now() > RECRUITING_DEADLINE) {
      return;
    }

    // 2. Don't show popup if already on career or admin pages
    if (pathname === '/career' || pathname?.startsWith('/admin')) {
      return;
    }

    // 3. Check if recently dismissed in this browser
    try {
      const dismissedUntil = localStorage.getItem(DISMISS_STORAGE_KEY);
      if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
        return;
      }
    } catch {
      // LocalStorage access may fail in private mode; proceed safely
    }

    // Show popup after a slight delay to allow initial page render
    const timer = setTimeout(() => {
      setIsOpen(true);
      try {
        posthog?.capture('recruiting_popup_shown', { pathname, language });
      } catch {
        // Analytics failure shouldn't affect UI
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [pathname, language, posthog]);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(DISMISS_STORAGE_KEY, (Date.now() + DISMISS_DURATION_MS).toString());
      posthog?.capture('recruiting_popup_dismissed', { pathname });
    } catch {
      // Ignore storage errors
    }
  }, [pathname, posthog]);

  const handleCtaClick = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(DISMISS_STORAGE_KEY, (Date.now() + DISMISS_DURATION_MS).toString());
      posthog?.capture('recruiting_popup_cta_clicked', { pathname });
    } catch {
      // Ignore storage errors
    }
  }, [pathname, posthog]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleDismiss]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="recruiting-popup-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
        >
          {/* Backdrop click handler */}
          <div
            className="fixed inset-0"
            onClick={handleDismiss}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-gradient-to-b from-[#1a1416] via-[#120e10] to-[#0a0808] border border-brand/50 text-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-brand/25 z-10 overflow-hidden"
          >
            {/* Top ambient burgundy glow */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-36 bg-brand/35 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle top rim light */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-brand-light to-transparent" />

            {/* Close button */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label={t.closeAria}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-light"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/20 border border-brand/40 text-brand-light text-xs font-bold tracking-wider uppercase font-mono">
                {t.kicker}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t.badge}
              </span>
            </div>

            {/* Title */}
            <h2
              id="recruiting-popup-title"
              className="text-2xl sm:text-3xl font-black font-syne uppercase tracking-tight text-white mt-4 leading-tight"
            >
              {t.title}
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed mt-2.5">
              {t.description}
            </p>

            {/* Deadline Highlight Card */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-brand/25 via-brand/15 to-transparent border border-brand/40 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-brand/40 border border-brand-light/40 flex items-center justify-center flex-shrink-0 text-white shadow-inner">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-mono uppercase tracking-wider text-brand-light font-bold">
                  {t.deadlineLabel}
                </div>
                <div className="text-sm sm:text-base font-black text-white font-syne flex flex-wrap items-baseline gap-x-2">
                  <span>{t.deadlineDate}</span>
                  <span className="text-xs font-normal text-gray-300 font-sans">
                    — {t.deadlineNotice}
                  </span>
                </div>
              </div>
            </div>

            {/* Target students note */}
            <p className="text-xs text-gray-400 font-light mt-3 leading-relaxed">
              {t.highlight}
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch">
              <Link
                href="/career"
                onClick={handleCtaClick}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-white px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-brand/30 hover:shadow-brand/50 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>{t.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                type="button"
                onClick={handleDismiss}
                className="px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium text-center"
              >
                {t.dismiss}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
