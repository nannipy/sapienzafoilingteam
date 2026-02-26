
'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from '../context/LanguageContext';
import { homeTranslations } from '../translations/home';

import { Event } from '../lib/types';

interface EventsSectionProps {
  events: Event[];
}

const EventCard = ({ event, isPast = false, language }: { event: Event; isPast?: boolean; language: 'en' | 'it' }) => (
  <div className="group relative overflow-hidden rounded-3xl glass-panel border border-white/5 hover:border-brand/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 w-full max-w-md mx-auto h-[300px]">
    {/* Image Background */}
    <div className="absolute inset-0">
      <Image
        src={event.image_url || '/placeholder.jpg'}
        alt={event.image_alt || event.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent" />
    </div>

    {/* Content */}
    <div className="relative z-10 p-8 h-full flex flex-col justify-end">
      <h3 className="text-2xl font-syne font-bold text-white mb-2 leading-tight group-hover:text-brand-light transition-colors">
        {language === 'en' ? event.title_en : event.title}
      </h3>

      <div className="flex flex-col gap-1 text-gray-300 text-sm font-geist">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
          {new Date(event.date).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
          {event.location}
        </span>
      </div>
    </div>
  </div>
);

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  const { language } = useLanguage();

  const { upcomingEvents, pastEvents } = React.useMemo(() => {
    const now = new Date();
    const upcoming: Event[] = [];
    const past: Event[] = [];
    events.forEach(event => {
      if (new Date(event.date) >= now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  return (
    <div className="bg-brand py-32 relative overflow-hidden">
      {/* Intentional Pattern Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-light/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {upcomingEvents.length > 0 ? (
          <section className="mb-24" id="upcoming-events">
            <h2 className="text-4xl md:text-6xl font-syne font-black text-white mb-16 flex items-center gap-6 tracking-tighter uppercase">
              <span className="w-16 h-2 bg-white rounded-full"></span>
              {homeTranslations[language].upcomingEvents}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {upcomingEvents.map(event => <EventCard key={event.id} event={event} language={language} />)}
            </div>
          </section>
        ) : null}

        {pastEvents.length > 0 ? (
          <section id="past-events">
            <h2 className="text-4xl md:text-6xl font-syne font-black text-white mb-16 flex items-center gap-6 tracking-tighter uppercase">
              <span className="w-16 h-2 bg-white/40 rounded-full"></span>
              {homeTranslations[language].pastEvents}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {pastEvents.map(event => <EventCard key={event.id} event={event} isPast language={language} />)}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default EventsSection;
