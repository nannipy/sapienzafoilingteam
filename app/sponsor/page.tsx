


'use client';

import React from 'react';
import { HandshakeIcon, Rocket, Users, Target } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { sponsorTranslations } from '../translations/sponsor';
import { usePostHog } from 'posthog-js/react';
import PageHero from '../components/PageHero';

const sponsors = [
  { name: 'Maire', link: 'https://www.groupmaire.com/it/', logo: 'maire.svg', width: 250 },
  { name: 'Fluidodesign', link: 'http://www.fluidodesign.eu/', logo: 'fluidodesign.svg', width: 270, height: 70 },
  { name: 'Gottifredi', link: 'https://www.gottifredimaffioli.com/', logo: 'gottifredi.svg', width: 250 },
  { name: 'Harken', link: 'https://www.harken.it/it/home/', logo: 'harken.svg', width: 250 },
  { name: 'Beta', link: 'https://www.beta-cae.com/', logo: 'beta.svg', width: 200, height: 80 },
  { name: 'Solidworks', link: 'https://www.solidworks.com', logo: 'solidworks.svg', width: 250, height: 80 },
  { name: 'Comaryachts', link: 'https://www.comaryachts.it', logo: 'comar.svg', width: 250 },
  { name: 'Notion', link: 'https://www.notion.so', logo: 'notion.svg', width: 100, height: 40 },
];

const SponsorPage = () => {
  const { language } = useLanguage();
  const posthog = usePostHog();
  const t = sponsorTranslations[language];

  const handleSponsorClick = (sponsorName: string) => {
    posthog.capture('sponsor_clicked', { sponsor_name: sponsorName });
  };

  const handleContactClick = () => {
    posthog.capture('sponsor_contact_clicked');
  };

  return (
    <main className="min-h-screen bg-brand-dark">
      <PageHero
        title={t.title}
        subtitle={t.subtitle}
        Icon={HandshakeIcon}
      />

      <div className="relative -mt-20 z-10 mx-4">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[600px] pb-10">

          <div className="px-6 md:px-12 py-16">
            <div className="text-center mb-12">
              <a
                href="mailto:sapienzafoilingteam@gmail.com"
                onClick={handleContactClick}
                className="inline-block bg-brand-dark text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-brand transition-all hover:scale-105"
              >
                {t.contactButton}
              </a>
            </div>

            {/* Sponsors Grid */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 border-b border-gray-100 pb-4">{t.sponsorsSection.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sponsors.map(sponsor => (
                  <a
                    href={sponsor.link}
                    onClick={() => handleSponsorClick(sponsor.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    key={sponsor.link}
                  >
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-xl group-hover:border-brand-light transition-all duration-300 flex items-center justify-center h-40 w-full group-hover:scale-[1.02]">
                      <Image
                        src={`/sponsors/${sponsor.logo}`}
                        alt={sponsor.name}
                        width={sponsor.width || 250}
                        height={sponsor.height || 40}
                        className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Base Nautica & Collaborations Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
              {/* Base Nautica */}
              <div>
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">{t.navybase.title}</h2>
                <a href="https://www.centrovelico3v.it" onClick={() => handleSponsorClick('3V')} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex items-center justify-center h-48 w-full hover:scale-[1.02]">
                    <Image src="/sponsors/3v.svg" alt="3V Base" width={300} height={100} className="object-contain" />
                  </div>
                </a>
              </div>

              {/* Collaborations */}
              <div>
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">{t.collaborations.title}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <a href="https://www.dima.uniroma1.it/dima/" onClick={() => handleSponsorClick('DIMA')} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-center h-32 w-full hover:scale-[1.02]">
                      <Image src="/collaborations/dima.png" alt="DIMA" width={150} height={50} className="object-contain" />
                    </div>
                  </a>
                  <a href="https://www.inm.cnr.it/" onClick={() => handleSponsorClick('INM')} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-center h-32 w-full hover:scale-[1.02]">
                      <Image src="/collaborations/inm.png" alt="INM" width={150} height={50} className="object-contain" />
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Partnership Benefits */}
            <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{t.benefits.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:translate-y-[-4px] transition-transform">
                  <div className="bg-brand-dark/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-brand" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{t.benefits.visibility.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{t.benefits.visibility.description}</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:translate-y-[-4px] transition-transform">
                  <div className="bg-brand-dark/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Rocket className="w-8 h-8 text-brand" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{t.benefits.innovation.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{t.benefits.innovation.description}</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:translate-y-[-4px] transition-transform">
                  <div className="bg-brand-dark/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-brand" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{t.benefits.network.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{t.benefits.network.description}</p>
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

export default SponsorPage;