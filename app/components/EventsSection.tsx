
'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from '../context/LanguageContext';
import { homeTranslations } from '../translations/home';

interface Event {
  id: number;
  title: string;
  title_en: string;
  date: string;
  location: string;
  image_url: string;
  image_alt: string;
  link: string;
}

const EventsSection: React.FC = () => {
  const { language } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const events: Event[] = await response.json();
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
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const EventCard = ({ event, isPast = false }: { event: Event; isPast?: boolean }) => (
    <div className="group relative overflow-hidden rounded-3xl glass-panel border border-white/5 hover:border-brand/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 w-full max-w-md mx-auto h-[300px]">
      {/* Image Background */}
      <div className="absolute inset-0">
        <Image
          src={event.image_url}
          alt={event.image_alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-end">
        <div className="mb-4">
          <span className={`bg-white inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${isPast ? 'border-gray-500 text-gray-300' : 'border-brand text-brand bg-brand/10'}`}>
            {isPast ? homeTranslations[language].pastEvents : homeTranslations[language].upcomingEvents}
          </span>
        </div>
        
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

  return (
    <div className="bg-brand py-24 relative overflow-hidden">
       {/* Decorative Elements */}
       <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
       <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {upcomingEvents.length > 0 && (
          <section className="mb-20" id="upcoming-events">
            <h2 className="text-4xl md:text-5xl font-syne font-bold text-white mb-12 flex items-center gap-4">
              <span className="w-12 h-1 bg-brand rounded-full bg-white"></span>
              {homeTranslations[language].upcomingEvents}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          </section>
        )}

        {pastEvents.length > 0 && (
          <section id="past-events">
            <h2 className="text-4xl md:text-5xl font-syne font-bold text-white mb-12 flex items-center gap-4">
               <span className="w-12 h-1 bg-white rounded-full"></span>
               {homeTranslations[language].pastEvents}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(event => <EventCard key={event.id} event={event} isPast />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default EventsSection;
