
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
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const events: Event[] = await response.json();
        
        const now = new Date();
        const upcoming: Event[] = [];
        const past: Event[] = [];

        events.forEach(event => {
          const eventDate = new Date(event.date);
          if (eventDate >= now) {
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

  const renderEvent = (event: Event) => (
    <div
      key={event.id}
      className="bg-[#822433] p-6 px-10 md:px-18 md:py-5 mx-auto rounded-xl transition-all duration-300 hover:transform hover:scale-105 md:grid md:grid-cols-2 gap-4 my-5"
    >
      <div className="flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-white mb-2">{language === 'en' ? event.title_en : event.title}</h3>
        <p className="text-white">{new Date(event.date).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p className="text-white">{event.location}</p>
      </div>
      <div className="flex justify-center md:justify-end">
        <Image
          className="rounded-xl mt-4 w-60 h-40"
          src={event.image_url}
          alt={event.image_alt}
          layout="intrinsic"
          width={240}
          height={160}
        />
      </div>
    </div>
  );

  return (
    <>
      {upcomingEvents.length > 0 && (
        <div className="bg-gray-50 py-16" id="upcoming-events" role="region" aria-label="upcoming events">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              {homeTranslations[language].upcomingEvents}
            </h2>
            <div className="grid md:grid-cols-1">
              {upcomingEvents.map(renderEvent)}
            </div>
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div className="bg-gray-50 py-16" id="past-events" role="region" aria-label="past events">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              {homeTranslations[language].pastEvents}
            </h2>
            <div className="grid md:grid-cols-1">
              {pastEvents.map(renderEvent)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsSection;
