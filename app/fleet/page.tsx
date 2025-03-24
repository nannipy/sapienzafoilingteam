'use client';

import React, { useState } from 'react';
import { 
  Sailboat, 
  Construction, 
  Info, 
  Plus,
  Minus,
  ChevronRight,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { fleetTranslations } from '../translations/fleet';

const FleetPage = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<SectionKey>('foils');
  type SectionKey = 'foils' | 'hull' | 'rig' | 'controls';
  
  const mothParts: Record<SectionKey, {
    title: string;
    description: string;
    details: string[];
    technicalSpecs: string[];
  }> = {
    foils: fleetTranslations[language].foils,
    hull: fleetTranslations[language].hull,
    rig: fleetTranslations[language].rig,
    controls: fleetTranslations[language].controls
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-[#822433] to-[#6d1f2b]">
        <div className="absolute inset-0 " />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4 ">
          <Sailboat className="w-16 h-16 mb-4 mt-10 " />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{fleetTranslations[language].title}</h1>
          <p className="text-xl text-center">{fleetTranslations[language].subtitle}</p>
        </div>
      </div>

      {/* Work in Progress Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#fdf1f3] rounded-xl p-8 mb-16">
          <div className="flex items-center justify-center mb-6">
            <Construction className="w-12 h-12 text-[#822433] mr-4" />
            <h2 className="text-3xl font-bold">{fleetTranslations[language].workInProgress.title}</h2>
          </div>
          <p className="text-lg text-center max-w-3xl mx-auto">
            {fleetTranslations[language].workInProgress.description}
          </p>
        </div>

       {/* Why Moth Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl p-8 shadow-lg mb-16 flex flex-col lg:flex-row">
            <div className="flex-1 mb-6 lg:mb-0 lg:mr-6">
              <div className="flex items-center justify-center mb-6">
                <Info className="w-12 h-12 text-[#822433] mr-4" />
                <h2 className="text-3xl font-bold">{fleetTranslations[language].whyMoth.title}</h2>
              </div>
              <p className="text-lg text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
                {fleetTranslations[language].whyMoth.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Image src="/moth_model.jpg" alt="Moth Model" className="w-full h-auto rounded-lg" width={300} height={300}/>
            </div>
          </div>
        </div>

        {/* Moth Technical Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">{fleetTranslations[language].mainComponents}</h3>
              <div className="space-y-2">
                {Object.entries(mothParts).map(([key, part]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key as keyof typeof mothParts)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      activeSection === key
                        ? 'bg-[#822433] text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>{part.title}</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6">{mothParts[activeSection].title}</h2>
              
              {/* Main Description */}
              <p className="text-lg mb-8">{mothParts[activeSection].description}</p>

              {/* Technical Details */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Characteristics */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Caratteristiche
                  </h3>
                  <ul className="space-y-3">
                    {mothParts[activeSection].details.map((detail, index) => (
                      <li key={index} className="flex items-start">
                        <Plus className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-[#822433]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Specifications */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Wrench className="w-5 h-5 mr-2" />
                    Specifiche Tecniche
                  </h3>
                  <ul className="space-y-3">
                    {mothParts[activeSection].technicalSpecs.map((spec, index) => (
                      <li key={index} className="flex items-start">
                        <Minus className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-[#822433]" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#fdf1f3] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Vuoi far parte del progetto?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Se sei uno studente appassionato di vela e ingegneria e vuoi contribuire alla
          costruzione della nostra flotta, invia una candidatura spontanea.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/contact"
              className="bg-[#822433] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6d1f2b] transition-colors"
            >
              Contattaci
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfUxoIJQdocILXDDgykkHAJ1yg60mGeZ7T_fr5M6cob1ca8oA/viewform?usp=dialog"
              className="bg-white text-[#822433] px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-[#822433]"
            >
              Unisciti al Team
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FleetPage;