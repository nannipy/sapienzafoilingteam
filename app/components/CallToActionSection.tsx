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
    <section className="relative py-20 bg-white text-brand overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10 animate-slide" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            {homeTranslations[language].joinTeamTitle}
          </h2>
          <p className="text-xl mb-8">
            {homeTranslations[language].joinTeamDescription}
          </p>
          <Link href='/career' className="group bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors">
            {homeTranslations[language].joinUsButton}
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
