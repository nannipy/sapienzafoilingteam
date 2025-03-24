'use client'

import React from "react";
import { useLanguage } from "./context/LanguageContext";
import { homeTranslations } from "./translations/home";
import Image from "next/image";
import { ChevronDown, Calendar, Instagram, Linkedin, Facebook, ArrowRight } from "lucide-react";

export default function Home() {
  const { language } = useLanguage();
  const upcomingEvents = [
    {
      title: "2025 SuMoth Challenge",
      date: "16 Giugno 2025",
      location: "Garda, Verona",
      image: "/sumoth.png",
      link: "https://sumoth.org"
    },
  ];

  return (
    <>


    <main className="relative min-h-screen bg-black" data-testid="home-page">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <Image
          src="/moth_5.jpg"
          alt="regatta"
          fill
          className="object-cover brightness-50"
          priority
        />
        
        <div className="relative z-10 text-center text-white px-4">
          <div className="transition-all duration-500" data-testid="animated-element">
            <h1 className="text-5xl md:text-7xl font-bold pb-4">
              Sapienza Foiling Team
            </h1>
          </div>
        </div>

        <div className="absolute bottom-8 w-full flex justify-center">
          <div className="animate-bounce">
          <ChevronDown
          data-testid="chevron-down"
          className="text-white w-8 h-8"
          onClick={() => {
          const targetElement = document.querySelector('#upcoming-events');
          if (targetElement) {
            window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.pageYOffset - 100,
            behavior: 'smooth'
            });
           }
          }}
          />
        </div>
        </div>
      </div>

     
      {/* Upcoming Events Section */}
      <div className="bg-gray-50 py-16" id="upcoming-events" role="region" aria-label="achievements">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-black mb-12 text-center">
            {homeTranslations[language].upcomingEvents}
          </h2>
          <div className="grid md:grid-cols-1">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="bg-[#822433] p-6  mx-auto rounded-xl transition-all duration-300 hover:transform hover:scale-105 md:grid md:grid-cols-2 gap-4"
              onClick={() => window.open(event.link, '_blank')}
            >
              {/* Contenuto del testo a sinistra */}
              <div className="flex flex-col justify-center">
                <Calendar className="text-white w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                <p className="text-white">{event.date}</p>
                <p className="text-white">{event.location}</p>
              </div>

              {/* Immagine a destra */}
              <div className="flex justify-center md:justify-end">
                <Image
                  className="rounded-xl mt-4"
                  src={event.image}
                  alt="Evento Sumoth 2025 al lago di Garda, Verona"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
      {/* Social Media Section */}
      <section className="py-12 bg-[#FDF1F3] text-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-8">{homeTranslations[language].followUs}</h3>
            <div className="flex justify-center space-x-8">
              <a 
                href="https://www.instagram.com/sapienzafoilingteam/" 
                className="hover:text-[#822433] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-8 h-8 hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.linkedin.com/company/sapienza-foiling-team/about/" 
                className="hover:text-[#822433] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-8 h-8 hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61572515878295" 
                className="hover:text-[#822433] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-8 h-8 hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section with Floating Elements */}
      <section className="relative py-20 bg-gradient-to-br from-[#822433] to-[#6d1f2b] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10 animate-slide" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              {homeTranslations[language].joinTeamTitle}
            </h2>
            <p className="text-xl mb-8">
              {homeTranslations[language].joinTeamDescription}
            </p>
            <button onClick={() => window.open('https://docs.google.com/forms/d/1TsTV28v7nggIEp98K8JGwtKbrV5P-9xzHIxmuFlSXCs/edit?pli=1', '_blank')} className="group bg-white text-[#822433] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              {homeTranslations[language].joinUsButton}
              <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

    </main>
    </>
  );
}