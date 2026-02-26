'use client';

import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";
import { useLanguage } from '../context/LanguageContext';
import { homeTranslations } from '../translations/home';

const HeroSection: React.FC = () => {
  const { language } = useLanguage();

  const handleChevronClick = () => {
    const targetElement = document.querySelector('#upcoming-events');
    if (targetElement) {
      window.scrollTo({
        top: targetElement.getBoundingClientRect().top + window.pageYOffset - 100,
        behavior: 'smooth'
      });
    }
  };

  const handleCTAClick = (ctaType: 'learn_more' | 'view_boat') => {
    posthog.capture('hero_cta_clicked', {
      cta_type: ctaType,
      section: 'hero'
    });
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-void">
      {/* Background with overlay */}
      <div className="absolute inset-0 w-full h-full aspect-[16/9]">
        <Image
          src="/moth_5.jpg"
          alt="Sapienza Foiling Team Regatta"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center -mt-20 px-4">
        {/* Main Title - Distinctive Styling */}
        <div className="text-center animate-fade-in-up">
          <h1 className=" font-black text-5xl md:text-7xl lg:text-8xl text-white uppercase mb-[-0.1em] tracking-tighter leading-none opacity-90">
            Sapienza
          </h1>
          <h1 className=" font-bold text-5xl md:text-6xl lg:text-7xl text-white/80 uppercase tracking-tight leading-none">
            Foiling Team
          </h1>
        </div>

        {/* Action Buttons with Refined States */}
        <div className="flex flex-col sm:flex-row gap-6 mt-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Link
            href="/team"
            onClick={() => handleCTAClick('learn_more')}
            className="px-10 py-4 rounded-full bg-brand text-white font-bold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-brand/20 hover:shadow-brand/40 border border-white/5 uppercase text-sm"
          >
            {homeTranslations[language].learnMoreButton}
          </Link>
          <Link
            href="/boat"
            onClick={() => handleCTAClick('view_boat')}
            className="px-10 py-4 rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-white font-bold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white/10 uppercase text-sm"
          >
            {homeTranslations[language].viewMothButton}
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 w-full flex justify-center animate-float">
        <button
          onClick={handleChevronClick}
          className="p-4 rounded-full hover:bg-white/10 transition-colors group cursor-pointer"
          aria-label="Scroll down"
        >
          <ChevronDown
            data-testid="chevron-down"
            className="text-white w-8 h-8 group-hover:text-brand transition-colors"
          />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
