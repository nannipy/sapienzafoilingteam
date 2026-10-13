
import React from "react";
import { getEvents } from "./lib/db/events";
import HeroSection from "./components/HeroSection";
import FleetShowcaseSection from "./components/FleetShowcaseSection";
import CallToActionSection from "./components/CallToActionSection";
import EventsSection from "./components/EventsSection";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const events = await getEvents();

  return (
    <>
      <main className="sft-root sft-site-home" data-testid="home-page">
        <HeroSection />
        <FleetShowcaseSection />
        <EventsSection events={events} />
        <CallToActionSection />
      </main>
    </>
  );
}
