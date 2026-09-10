'use client';

import React from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { homeTranslations } from '../translations/home';
import Link from "next/link";

type CallToActionSectionProps = Record<string, never>;

const CallToActionSection: React.FC<CallToActionSectionProps> = () => {
  const { language } = useLanguage();

  return (
    <section className="relative py-24 bg-void text-white overflow-hidden border-t border-white/5">
      {/* Ambient Burgundy Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[300px] md:h-[400px] bg-brand/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto p-10 md:p-16 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl text-center relative overflow-hidden">
          {/* Subtle top rim light */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-brand-light to-transparent" />

          <h2 className="text-3xl md:text-5xl font-black font-syne uppercase tracking-tight text-white mb-5 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            {homeTranslations[language].joinTeamTitle}
          </h2>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            {homeTranslations[language].joinTeamDescription}
          </p>
          <Link
            href="/career"
            className="inline-flex items-center group bg-brand text-white px-9 py-4 rounded-full font-bold uppercase text-sm tracking-wider hover:bg-brand-light transition-all duration-300 shadow-[0_0_25px_rgba(130,36,51,0.5)] hover:shadow-[0_0_40px_rgba(130,36,51,0.8)] hover:scale-105 active:scale-95 border border-white/10"
          >
            {homeTranslations[language].joinUsButton}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
