'use client';

import React from 'react';
import { Briefcase, Send, Brain, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { careerTranslations } from '../translations/career';
import { usePostHog } from 'posthog-js/react';
import OpenPosition from '../components/OpenPosition';
import { OpenPosition as OpenPositionType } from '../lib/types';

interface CareerClientPageProps {
  initialPositions: OpenPositionType[];
}

const CareerClientPage: React.FC<CareerClientPageProps> = ({ initialPositions: openPositions }) => {
  const { language } = useLanguage();
  const posthog = usePostHog();

  const handleApplyClick = (position: string) => {
    posthog.capture('apply_clicked', { position });
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-[#822433] to-[#6d1f2b]">
        <div className="absolute inset-0" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <Briefcase className="w-16 h-16 mb-4 mt-10" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{careerTranslations[language].title}</h1>
          <p className="text-xl text-center">{careerTranslations[language].subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 py-16">
        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">{careerTranslations[language].openPositions.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {openPositions.length > 0 ? (
              openPositions.map((position) => (
                <OpenPosition key={position.id} {...position} />
              ))
            ) : (
              <div className="col-span-3 bg-gray-50 rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-4">No open positions at the moment</h3>
                <p className="text-lg text-gray-600">{careerTranslations[language].openPositions.noPositions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Spontaneous Application */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col lg:flex-row items-center">
            <div className="flex-1 mb-6 lg:mb-0 lg:mr-6 text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-4">{careerTranslations[language].spontaneousApplication.title}</h2>
              <p className="text-lg text-gray-600 mb-6">{careerTranslations[language].spontaneousApplication.description}</p>
              <a
                href="mailto:sapienzafoilingteam@gmail.com"
                onClick={() => handleApplyClick('spontaneous')}
                className="inline-block bg-[#822433] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6d1f2b] transition-colors"
              >
                <Send className="w-5 h-5 mr-2 inline-block" />
                {careerTranslations[language].spontaneousApplication.applyButton}
              </a>
            </div>
            <div className="flex-shrink-0">
              <Send className="w-32 h-32 text-[#822433]" />
            </div>
          </div>
        </div>

        {/* Thesis and Internship */}
        <div className="bg-[#fdf1f3] rounded-3xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">{careerTranslations[language].thesisInternship.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <Brain className="w-8 h-8 text-[#822433] mr-3" />
                  <h3 className="text-xl font-semibold">{careerTranslations[language].thesisInternship.thesis.title}</h3>
                </div>
                <p className="text-gray-600">{careerTranslations[language].thesisInternship.thesis.description}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 text-[#822433] mr-3" />
                  <h3 className="text-xl font-semibold">{careerTranslations[language].thesisInternship.internship.title}</h3>
                </div>
                <p className="text-gray-600">{careerTranslations[language].thesisInternship.internship.description}</p>
              </div>
            </div>
             <div className="text-center mt-12">
                <a
                    href="mailto:sapienzafoilingteam@gmail.com"
                    onClick={() => handleApplyClick('thesis_internship')}
                    className="inline-block bg-[#822433] text-white px-8 py-3 rounded-2xl font-semibold hover:bg-[#6d1f2b] transition-colors"
                >
                    {careerTranslations[language].thesisInternship.contactButton}
                </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CareerClientPage;