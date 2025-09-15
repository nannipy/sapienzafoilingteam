'use client';

import React from 'react';
import { HandshakeIcon, Rocket, Users, Target } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { sponsorTranslations } from '../translations/sponsor';
import { usePostHog } from 'posthog-js/react';

 const sponsors = [
        { name : 'Maire', link: 'https://www.groupmaire.com/it/', logo: 'maire.svg', width: 250 },
        { name : 'Fluidodesign', link: 'http://www.fluidodesign.eu/', logo: 'fluidodesign.svg', width: 270, height: 70 },
        { name : 'Gottifredi', link: 'https://www.gottifredimaffioli.com/', logo: 'gottifredi.svg', width: 250 },
        { name : 'Harken', link: 'https://www.harken.it/it/home/', logo: 'harken.svg', width: 250 },
        { name : 'Beta', link: 'https://www.beta-cae.com/', logo: 'beta.svg', width: 200, height: 80 },
        { name : 'Solidworks', link: 'https://www.solidworks.com', logo: 'solidworks.svg', width: 250, height: 80 },
        { name : 'Comaryachts', link: 'https://www.comaryachts.it', logo: 'comar.svg', width: 250 },
        { name : 'Notion', link: 'https://www.notion.so', logo: 'notion.svg', width: 100, height: 40 },
      ];
const SponsorPage = () => {
  const { language } = useLanguage();
  const posthog = usePostHog();

  const handleSponsorClick = (sponsorName: string) => {
    posthog.capture('sponsor_clicked', { sponsor_name: sponsorName });
  };

  const handleContactClick = () => {
    posthog.capture('sponsor_contact_clicked');
  };

  return (
    <main className="bg-white text-black">
      {/* Hero Section */}
      <div className="relative h-[28rem] sm:h-96 bg-gradient-to-br from-[#822433] to-[#6d1f2b]">
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4 ">
          <HandshakeIcon className="w-16 h-16 mt-20 " />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{sponsorTranslations[language].title}</h1>
          <p className="text-xl text-center">{sponsorTranslations[language].subtitle}</p>
          <a href="mailto:sapienzafoilingteam@gmail.com" onClick={handleContactClick} className="mt-4 bg-white text-[#822433] px-8 py-4 rounded-full text-lg font-semibold  transition-colors">
            {sponsorTranslations[language].contactButton}
          </a>
        </div>
      </div>
    
      
      {/* Sponsors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{sponsorTranslations[language].sponsorsSection.title}</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {sponsors.map(sponsor => (
            <a href={sponsor.link} onClick={() => handleSponsorClick(sponsor.name)} target="_blank" rel="noopener noreferrer" className="group w-full md:w-[calc((100%-4rem)/3)]" key={sponsor.link}>              
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center h-32 w-full">                
                <Image src={`/sponsors/${sponsor.logo}`} alt={sponsor.name} width={sponsor.width || 250} height={sponsor.height || 40} className="object-contain" />
              </div>
            </a>
          ))}
        </div>
      </div>

     

      {/* Base Nautica */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{sponsorTranslations[language].navybase.title}</h2>
        <div className="grid grid-cols-1  gap-8">
          <a href="https://www.centrovelico3v.it" onClick={() => handleSponsorClick('3V')} target="_blank" rel="noopener noreferrer" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center h-32 w-auto">
              <Image src="/sponsors/3v.svg" alt="Collaboration 1" width={300} height={100} className="object-contain" />
            </div>
          </a>
        </div>
      </div>

      {/* Collaborations*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{sponsorTranslations[language].collaborations.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <a href="https://www.dima.uniroma1.it/dima/" onClick={() => handleSponsorClick('DIMA')} target="_blank" rel="noopener noreferrer" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center h-32 w-auto">
              <Image src="/collaborations/dima.png" alt="Collaboration 1" width={300} height={100} className="object-contain" />
            </div>
          </a>
          <a href="https://www.inm.cnr.it/" onClick={() => handleSponsorClick('INM')} target="_blank" rel="noopener noreferrer" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center h-32 w-auto">
              <Image src="/collaborations/inm.png" alt="Collaboration 2" width={300} height={100} className="object-contain" />
            </div>
          </a>
        </div>
      </div>


      {/* Partnership Benefits */}
      <div className="bg-[#fdf1f3] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{sponsorTranslations[language].benefits.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-[#822433] mr-3" />
                <h3 className="text-xl font-semibold">{sponsorTranslations[language].benefits.visibility.title}</h3>
              </div>
              <p className="text-gray-600">{sponsorTranslations[language].benefits.visibility.description}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Rocket className="w-8 h-8 text-[#822433] mr-3" />
                <h3 className="text-xl font-semibold">{sponsorTranslations[language].benefits.innovation.title}</h3>
              </div>
              <p className="text-gray-600">{sponsorTranslations[language].benefits.innovation.description}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-[#822433] mr-3" />
                <h3 className="text-xl font-semibold">{sponsorTranslations[language].benefits.network.title}</h3>
              </div>
              <p className="text-gray-600">{sponsorTranslations[language].benefits.network.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SponsorPage;