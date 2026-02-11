
import React from "react";
import { getEvents } from "./lib/supabase-admin";
import HeroSection from "./components/HeroSection";
import CallToActionSection from "./components/CallToActionSection";
import EventsSection from "./components/EventsSection";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const events = await getEvents();

  return (
    <>
      <main className="relative min-h-screen bg-black" data-testid="home-page">
        <HeroSection />
        <EventsSection events={events} />
        <CallToActionSection />
      </main>
    </>
  );
}
