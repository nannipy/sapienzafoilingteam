'use client'

import React from "react";
import { useLanguage } from "./context/LanguageContext";

import HeroSection from "./components/HeroSection";
import SocialMediaSection from "./components/SocialMediaSection";
import CallToActionSection from "./components/CallToActionSection";
import EventsSection from "./components/EventsSection";

export default function Home() {
  useLanguage();

  const handleChevronClick = () => {
    const targetElement = document.querySelector('#upcoming-events');
    if (targetElement) {
      window.scrollTo({
        top: targetElement.getBoundingClientRect().top + window.pageYOffset - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <main className="relative min-h-screen bg-black" data-testid="home-page">
        <HeroSection onChevronClick={handleChevronClick} />
        <EventsSection />
        <SocialMediaSection />
        <CallToActionSection />
      </main>
    </>
  );
}
