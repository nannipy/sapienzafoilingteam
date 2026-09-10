'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";
import { useLanguage } from '../context/LanguageContext';
import { homeTranslations } from '../translations/home';

const heroSlides = [
  {
    src: '/images/hero-01.jpg',
    alt: 'Sapienza Foiling Team Moth Flight - Panoramic Lake Garda',
  },
  {
    src: '/images/hero-02.jpg',
    alt: 'Sapienza Foiling Moth 9352 Racing in SuMoth Challenge',
  },
  {
    src: '/images/events-01-sumoth-village-aerial.jpg',
    alt: 'Sapienza Foiling Moth 9352 Racing in SuMoth Challenge',
  },
  {
    src: '/images/events-03-competitors-lineup.jpg',
    alt: 'Sapienza Foiling Moth 9352 Racing in SuMoth Challenge',
  },
  {
    src: '/images/events-06-racing-water.jpg',
    alt: 'Sapienza Foiling Moth 9352 Racing in SuMoth Challenge',
  },

  {
    src: '/images/sponsor-03-sail-partners-2.jpg',
    alt: 'Sapienza Foiling Moth 9352 Racing in SuMoth Challenge',
  },
  {
    src: '/images/hero-05.jpg',
    alt: 'Sapienza Foiling Moth High Altitude Foil Flight',
  },
];

// Append first slide to allow seamless infinite forward sliding without reverse rewinding
const extendedSlides = [...heroSlides, heroSlides[0]];

const HeroSection: React.FC = () => {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitionEnabled(true);
      setCurrentSlide((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    if (currentSlide >= heroSlides.length) {
      setIsTransitionEnabled(false);
      setCurrentSlide(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitionEnabled(true);
        });
      });
    }
  };

  const goToSlide = (index: number) => {
    setIsTransitionEnabled(true);
    setCurrentSlide(index);
  };

  const handleCTAClick = (ctaType: 'learn_more' | 'view_boat') => {
    posthog.capture('hero_cta_clicked', {
      cta_type: ctaType,
      section: 'hero'
    });
  };

  const activeIndex = currentSlide % heroSlides.length;

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-void">
      {/* Edge-to-edge Continuous Sliding Track - Zero Black Flashes */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div
          className={`flex w-full h-full ${isTransitionEnabled ? 'transition-transform duration-1000 ease-in-out' : ''
            }`}
          style={{
            transform: `translate3d(-${currentSlide * 100}%, 0, 0)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((slide, index) => (
            <div
              key={`${slide.src}-${index}`}
              className="w-full h-full flex-shrink-0 relative"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority
              />
            </div>
          ))}
        </div>

        {/* Cinematic Vignette & Atmospheric Gradients on top of track */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-black/30 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none z-10" />
      </div>

      {/* Ambient Burgundy Glow Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] md:w-[800px] h-[300px] md:h-[450px] bg-brand/25 rounded-full blur-[130px] pointer-events-none z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto">
        {/* Main Title - Distinctive Glowing Styling */}
        <div className="text-center animate-fade-in-up">
          <h1 className="font-black text-6xl md:text-8xl lg:text-9xl text-white uppercase mb-[-0.1em] tracking-tighter leading-none opacity-95 drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            Sapienza
          </h1>
          <h1 className="font-bold text-5xl md:text-7xl lg:text-8xl text-white/90 uppercase tracking-tight leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            Foiling Team
          </h1>
        </div>

        {/* Subtitle description - Internationalized */}
        <p className="mt-6 text-white/80 max-w-xl text-center text-sm md:text-base font-light tracking-wide leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          {homeTranslations[language].heroSubtitle}
        </p>

        {/* Action Buttons with Refined States and Glow */}
        <div className="flex flex-col sm:flex-row gap-5 mt-10 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <Link
            href="/team"
            onClick={() => handleCTAClick('learn_more')}
            className="px-9 py-4 rounded-full bg-brand text-white font-bold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(130,36,51,0.5)] hover:shadow-[0_0_45px_rgba(130,36,51,0.8)] hover:bg-brand-light border border-white/10 uppercase text-xs sm:text-sm text-center"
          >
            {homeTranslations[language].learnMoreButton}
          </Link>
          <Link
            href="/boat"
            onClick={() => handleCTAClick('view_boat')}
            className="px-9 py-4 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white font-bold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white/20 hover:border-brand/50 shadow-xl uppercase text-xs sm:text-sm text-center"
          >
            {homeTranslations[language].viewMothButton}
          </Link>
        </div>
      </div>

      {/* Slide Navigation Indicators */}
      <div className="absolute bottom-10 z-20 flex items-center gap-2">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${idx === activeIndex
              ? 'w-8 bg-brand-light shadow-[0_0_12px_rgba(163,66,82,0.8)]'
              : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
