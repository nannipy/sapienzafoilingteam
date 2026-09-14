'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileCheck,
  Award,
  Layers,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { careerTranslations } from '../translations/career';
import { usePostHog } from 'posthog-js/react';
import PageLayout from '../components/PageLayout';
import { OpenPosition as OpenPositionType } from '../lib/types';

interface CareerClientPageProps {
  initialPositions: OpenPositionType[];
}

const FORM_URL = 'https://forms.gle/93FhyCgbpSruYaM66';
const SUMOTH_URL = 'https://www.sumoth.org';

const CareerClientPage: React.FC<CareerClientPageProps> = () => {
  const { language } = useLanguage();
  const posthog = usePostHog();
  const t = careerTranslations[language];

  // Accordion state: open the first question by default
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    const nextState = openFaqIndex === index ? null : index;
    setOpenFaqIndex(nextState);
    if (nextState !== null) {
      posthog.capture('recruiting_faq_expanded', { questionIndex: index });
    }
  };

  const handleApplyClick = (source: string) => {
    posthog.capture('apply_clicked', { source });
  };

  return (
    <PageLayout>
      <div className="px-6 md:px-12 py-8 space-y-12 md:space-y-16">
        {/* ============================================================ */}
        {/* HERO SECTION                                                 */}
        {/* ============================================================ */}
        <section className="pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Col: Title, Description & Highlights */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.hero.kicker}</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-syne uppercase tracking-tight text-gray-900 leading-[1.02]">
                  {t.hero.title}
                </h1>

                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed font-light">
                  {t.hero.description}
                </p>
              </div>

              {/* Quick highlight tags */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200/80 rounded-2xl px-3.5 py-3">
                  <Compass className="w-4 h-4 text-brand flex-shrink-0" />
                  <span>Sapienza Roma</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200/80 rounded-2xl px-3.5 py-3">
                  <Layers className="w-4 h-4 text-brand flex-shrink-0" />
                  <span>4 Reparti</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200/80 rounded-2xl px-3.5 py-3 col-span-2 sm:col-span-1">
                  <Award className="w-4 h-4 text-brand flex-shrink-0" />
                  <span>SuMoth Challenge</span>
                </div>
              </div>
            </div>

            {/* Right Col: Red Status Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-brand via-brand to-brand-dark text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-brand/20 border border-brand-light/40 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between gap-3 border-b border-white/20 pb-4">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-white/80 font-semibold">
                      {t.hero.statusCard.label}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs font-semibold backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      {t.hero.statusCard.badge}
                    </span>
                  </div>

                  <p className="text-sm text-white/95 leading-relaxed font-light">
                    {t.hero.statusCard.subtext}
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <a
                      href={FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleApplyClick('hero_status_card')}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-brand px-5 py-3.5 rounded-xl font-bold text-sm tracking-wide uppercase hover:bg-gray-100 transition-all shadow-md group"
                    >
                      <span>{t.hero.statusCard.ctaButton}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>

                    <Link
                      href="/team"
                      className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 px-4 py-3.5 rounded-xl font-medium text-sm transition-all backdrop-blur-sm"
                    >
                      <span>{t.hero.statusCard.secondaryCta}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SELECTION PROCESS ("COME FUNZIONA")                          */}
        {/* ============================================================ */}
        <section className="pt-6 border-t border-gray-100">
          <div className="mb-8 text-center sm:text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-brand uppercase">
              {t.process.kicker}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-syne uppercase tracking-tight text-gray-900 mt-1">
              {t.process.title}
            </h2>
            <p className="text-sm font-mono text-gray-500 uppercase tracking-wider mt-1">
              {t.process.subtitle}
            </p>
          </div>

          <div className="space-y-5">
            {/* Step 01: Application */}
            <div className="bg-gray-50/70 border border-gray-200/80 rounded-3xl p-6 sm:p-8 hover:border-gray-300 transition-colors">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 text-brand font-black text-xl font-syne">
                  {t.process.step1.number}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black font-syne uppercase text-gray-900">
                      {t.process.step1.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {t.process.step1.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-medium">
                      <FileCheck className="w-3.5 h-3.5 text-brand" />
                      Curriculum Vitae (CV)
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-medium">
                      <FileCheck className="w-3.5 h-3.5 text-brand" />
                      Lettera Motivazionale
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-medium">
                      <FileCheck className="w-3.5 h-3.5 text-brand" />
                      Portfolio / Progetti (opzionale)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 02: Regulations */}
            <div className="bg-gray-50/70 border border-gray-200/80 rounded-3xl p-6 sm:p-8 hover:border-gray-300 transition-colors">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 text-brand font-black text-xl font-syne">
                  {t.process.step2.number}
                </div>
                <div className="flex-1 space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black font-syne uppercase text-gray-900">
                      {t.process.step2.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {t.process.step2.description}
                    </p>
                  </div>

                  {/* Red Study Guide Card */}
                  <div className="bg-gradient-to-r from-brand via-brand to-brand-dark text-white rounded-2xl p-6 border border-brand-light/40 shadow-lg shadow-brand/15 relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                      <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider font-semibold text-white bg-white/20 px-2.5 py-1 rounded-md backdrop-blur-sm">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{t.process.step2.handbook.badge}</span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold font-syne uppercase text-white">
                          {t.process.step2.handbook.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-white/90 font-light leading-relaxed">
                          {t.process.step2.handbook.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {t.process.step2.handbook.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-md transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <a
                          href={SUMOTH_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleApplyClick('sumoth_guide_external')}
                          className="inline-flex items-center gap-2 bg-white text-brand px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-all shadow-md group"
                        >
                          <BookOpen className="w-4 h-4 text-brand" />
                          <span>{t.process.step2.handbook.action}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-brand group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 03: Interview */}
            <div className="bg-gray-50/70 border border-gray-200/80 rounded-3xl p-6 sm:p-8 hover:border-gray-300 transition-colors">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 text-brand font-black text-xl font-syne">
                  {t.process.step3.number}
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black font-syne uppercase text-gray-900">
                    {t.process.step3.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {t.process.step3.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Confronto diretto con Team Leader e Responsabili di Reparto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* RED MID-PAGE CTA BANNER                                      */}
        {/* ============================================================ */}
        <section>
          <div className="bg-gradient-to-r from-brand via-brand-dark to-brand text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden border border-brand-light/40 shadow-xl shadow-brand/20">
            <div className="relative z-10 max-w-2xl space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase tracking-tight text-white">
                {t.banner.title}
              </h2>
              <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed">
                {t.banner.description}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleApplyClick('mid_banner_form')}
                  className="inline-flex items-center gap-2 bg-white text-brand px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl group"
                >
                  <span>{t.banner.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all backdrop-blur-sm"
                >
                  <span>{t.banner.secondary}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>



        {/* ============================================================ */}
        {/* FAQ ACCORDION                                                */}
        {/* ============================================================ */}
        <section className="pt-6 border-t border-gray-100">
          <div className="mb-6">
            <span className="text-xs font-mono font-bold tracking-widest text-brand uppercase">
              {t.faq.kicker}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-syne uppercase tracking-tight text-gray-900 mt-1">
              {t.faq.title}
            </h2>
          </div>

          <div className="space-y-3">
            {t.faq.items.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all ${isOpen
                    ? 'border-brand/40 bg-white shadow-sm'
                    : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 select-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-bold font-syne text-gray-900 pr-2">
                      {item.q}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen
                        ? 'bg-brand text-white'
                        : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm sm:text-base text-gray-600 font-light leading-relaxed border-t border-gray-100 pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Contact footer */}
          <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                {t.faq.stillHaveQuestions}
              </h4>
              <p className="text-xs text-gray-500">
                {t.faq.contactDirectly}
              </p>
            </div>
            <a
              href="mailto:sapienzafoilingteam@gmail.com"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand hover:text-brand-dark transition-colors"
            >
              <span>sapienzafoilingteam@gmail.com</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default CareerClientPage;