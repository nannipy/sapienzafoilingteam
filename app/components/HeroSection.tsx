'use client';

import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";
import { useLanguage } from '../context/LanguageContext';
import { homeTranslations } from '../translations/home';

interface HeroSectionProps {
  onChevronClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onChevronClick }) => {
  const { language } = useLanguage();
  const handleCTAClick = (ctaType: 'learn_more' | 'view_boat') => {
    posthog.capture('hero_cta_clicked', {
      cta_type: ctaType,
      section: 'hero'
    });
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-void">
      {/* Background with overlay */}
      <div className="absolute inset-0 w-full h-full"> 
        <Image
          src="/moth_5.jpg"
          alt="Sapienza Foiling Team Regatta"
          fill
          className="object-cover object-center opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center -mt-20 px-4">
        {/* Main Title - Kelson Font */}
        <div className="text-center animate-fade-in-up drop-shadow-2xl">
          <h1 className=" font-extrabold text-7xl md:text-6xl lg:text-8xl text-white uppercase mb-2 drop-shadow-2xl">
            Sapienza
          </h1>
          <h1 className=" font-bold text-6xl md:text-6xl lg:text-7xl text-white uppercase drop-shadow-lg">
            Foiling Team
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex md:flex-row gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Link href="/team">
            <button
              onClick={() => handleCTAClick('learn_more')}
              className="px-8 py-3 rounded-full bg-[#822433] hover:bg-[#6b1d28] text-white font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(130,36,51,0.5)] border border-white/10"
            >
              {homeTranslations[language].learnMoreButton}
            </button>
          </Link>
          <Link href="/boat">
            <button
              onClick={() => handleCTAClick('view_boat')}
              className="px-8 py-3 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-white font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              {homeTranslations[language].viewMothButton}
            </button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 w-full flex justify-center animate-float">
        <button 
          onClick={onChevronClick}
          className="p-4 rounded-full hover:bg-white/10 transition-colors group cursor-pointer"
          aria-label="Scroll down"
        >
          <ChevronDown
            data-testid="chevron-down"
            className="text-white w-8 h-8 group-hover:text-[#822433] transition-colors"
          />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
