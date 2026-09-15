'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
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

const HeroSection: React.FC = () => {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<number[]>([0]);
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Mark slides as loaded when needed
  const markSlideLoaded = useCallback((index: number) => {
    setLoadedSlides((prev) => (prev.includes(index) ? prev : [...prev, index]));
  }, []);

  const goToSlide = useCallback((index: number) => {
    markSlideLoaded(index);
    setCurrentSlide(index);
  }, [markSlideLoaded]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % heroSlides.length;
      markSlideLoaded(next);
      return next;
    });
  }, [markSlideLoaded]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = (prev - 1 + heroSlides.length) % heroSlides.length;
      markSlideLoaded(next);
      return next;
    });
  }, [markSlideLoaded]);

  // Pause timer when out of viewport to save mobile CPU/GPU
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // Preload the next slide ahead of transition
  useEffect(() => {
    const nextIndex = (currentSlide + 1) % heroSlides.length;
    markSlideLoaded(nextIndex);
  }, [currentSlide, markSlideLoaded]);

  // Auto-advance slides every 5 seconds only when visible and active
  useEffect(() => {
    if (!isInView) return;

    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isInView, nextSlide]);

  // Touch swipe support for smooth mobile interaction
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  const handleCTAClick = (ctaType: 'learn_more' | 'view_boat') => {
    posthog.capture('hero_cta_clicked', {
      cta_type: ctaType,
      section: 'hero'
    });
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-void select-none"
    >
      {/* High-performance Crossfade Image Stack - Zero 800vw layer or GPU layer thrashing */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {heroSlides.map((slide, index) => {
          const isCurrent = index === currentSlide;
          const isLoaded = loadedSlides.includes(index);

          if (!isLoaded) return null;

          return (
            <div
              key={slide.src}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isCurrent ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority={index === 0}
              />
            </div>
          );
        })}

        {/* Cinematic Vignette & Atmospheric Gradients on top of track */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-black/30 pointer-events-none z-10" />
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-75"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 35%, rgba(10, 8, 8, 0.85) 100%)',
          }}
        />
      </div>

      {/* Ambient Burgundy Glow Accent - Efficient CSS radial gradient (0 blur calculation overhead) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[750px] h-[340px] md:h-[450px] pointer-events-none z-10 opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(130, 36, 51, 0.35) 0%, rgba(130, 36, 51, 0.08) 50%, transparent 70%)',
        }}
      />

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
            className="px-9 py-4 rounded-full bg-white/10 md:backdrop-blur-md border border-white/20 text-white font-bold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white/20 hover:border-brand/50 shadow-xl uppercase text-xs sm:text-sm text-center"
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
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentSlide
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
