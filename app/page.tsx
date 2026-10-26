
import React from "react";
import type { Event } from "./lib/types";
import { getEvents } from "./lib/db/events";
import HeroSection from "./components/HeroSection";
import FleetShowcaseSection from "./components/FleetShowcaseSection";
import BoatGallerySection from "./components/BoatGallerySection";
import CallToActionSection from "./components/CallToActionSection";
import EventsSection from "./components/EventsSection";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  let events: Event[] = [];
  let eventsUnavailable = false;
  try {
    events = await getEvents(AbortSignal.timeout(8000));
  } catch {
    eventsUnavailable = true;
    console.error("[Home] Eventi temporaneamente non raggiungibili.");
  }

  return (
    <>
      <main className="sft-root sft-site-home" data-testid="home-page">
        <HeroSection />
        <FleetShowcaseSection />
        <BoatGallerySection />
        <EventsSection events={events} unavailable={eventsUnavailable} />
        <CallToActionSection />
      </main>
    </>
  );
}
