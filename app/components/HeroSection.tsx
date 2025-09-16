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
    <div className="relative h-screen flex items-center justify-center">
      <Image
        src="/moth_5.jpg"
        alt="regatta"
        fill
        className="object-cover brightness-50"
        priority
      />
      
      <div className="relative z-10 text-center text-white px-4">
        <div data-testid="animated-element">
          <h1 className="text-5xl md:text-7xl font-bold pb-4">
            Sapienza Foiling Team
          </h1>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/team">
            <button
              onClick={() => handleCTAClick('learn_more')}
              className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-colors"
            >
              {homeTranslations[language].learnMoreButton}
            </button>
          </Link>
          <Link href="/boat">
            <button
              onClick={() => handleCTAClick('view_boat')}
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              {homeTranslations[language].viewMothButton}
            </button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 w-full flex justify-center">
        <div className="animate-bounce">
          <ChevronDown
            data-testid="chevron-down"
            className="text-white w-8 h-8"
            onClick={onChevronClick}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
