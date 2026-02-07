'use client';

import React, { useState } from 'react';
import {
  Sailboat,
  Info,
  Plus,
  Minus,
  ChevronRight,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { boatTranslations } from '../translations/boat';
import SuMothRulebookSection from '../components/SuMothRulebookSection';
import { usePostHog } from 'posthog-js/react';
import Link from 'next/link';
import PageHero from '../components/PageHero';

const BoatPage = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<SectionKey>('foils');
  type SectionKey = 'foils' | 'hull' | 'rig' | 'controls';
  const posthog = usePostHog();
  const t = boatTranslations[language];

  const mothParts: Record<SectionKey, {
    title: string;
    description: string;
    details: string[];
    technicalSpecs: string[];
  }> = {
    foils: t.foils,
    hull: t.hull,
    rig: t.rig,
    controls: t.controls
  };

  const handleSectionClick = (key: SectionKey) => {
    setActiveSection(key);
    posthog.capture('boat_specification_viewed', { section: key });
  };

  return (
    <main className="min-h-screen bg-brand-dark">
      <PageHero
        title={t.title}
        Icon={Sailboat}
      />

      <div className="relative -mt-20 z-10 mx-4">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[600px] pb-10">

          <div className="px-6 md:px-12 py-16">
            {/* Why Moth Section */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-16 flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <Info className="w-10 h-10 text-[#822433] mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">{t.whyMoth.title}</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed italic pr-4">
                  &quot;{t.whyMoth.description}&quot;
                </p>
              </div>
              <div className="flex-shrink-0 relative w-64 h-64 md:w-80 md:h-80">
                <Image
                  src="/moth.png"
                  alt="Moth Model"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Moth Technical Details */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Navigation Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
                  <h3 className="text-xl font-bold mb-6 text-gray-800">{t.mainComponents}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(mothParts).map(([key, part]) => (
                      <button
                        key={key}
                        onClick={() => handleSectionClick(key as SectionKey)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 border ${activeSection === key
                          ? 'bg-brand-dark text-white border-brand shadow-lg scale-105'
                          : 'bg-white border-gray-100 hover:border-brand-light text-gray-600 hover:text-brand'
                          }`}
                      >
                        <span className="font-semibold">{part.title}</span>
                        <ChevronRight className={`w-5 h-5 transition-transform ${activeSection === key ? 'rotate-90' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 h-full">
                  <h2 className="text-3xl font-bold mb-6 text-brand">{mothParts[activeSection].title}</h2>

                  {/* Main Description */}
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">{mothParts[activeSection].description}</p>

                  {/* Technical Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Characteristics */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                        <Info className="w-5 h-5 mr-2 text-brand" />
                        {t.characteristics}
                      </h3>
                      <ul className="space-y-3">
                        {mothParts[activeSection].details.map((detail, index) => (
                          <li key={index} className="flex items-start">
                            <Plus className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-brand" />
                            <span className="text-gray-600">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical Specifications */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                        <Wrench className="w-5 h-5 mr-2 text-brand" />
                        {t.technicalSpecs}
                      </h3>
                      <ul className="space-y-3">
                        {mothParts[activeSection].technicalSpecs.map((spec, index) => (
                          <li key={index} className="flex items-start">
                            <Minus className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-brand" />
                            <span className="text-gray-600">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SuMoth Rulebook Section */}
          <div className="mt-10 border-t border-gray-100">
            <SuMothRulebookSection />
          </div>

          {/* Call to Action */}
          <div className="px-6 md:px-12 py-16">
            <div className="bg-brand-dark rounded-3xl p-10 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">{t.joinProject.title}</h2>
                <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                  {t.joinProject.description}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/contact"
                    className="bg-white text-brand px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:scale-105"
                  >
                    {t.joinProject.contactButton}
                  </Link>
                  <Link
                    href="/career"
                    className="bg-transparent text-white border border-white/30 px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all hover:scale-105"
                  >
                    {t.joinProject.joinButton}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-24" />
    </main>
  );
};

export default BoatPage;