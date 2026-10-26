"use client";
import Image from "next/image";
import { Card, CardContent, Badge } from "@sft/design-system";
import { useLanguage } from "../context/LanguageContext";
import { homeTranslations } from "../translations/home";
import { Event } from "../lib/types";
function EventCard({
  event,
  past,
  language,
}: {
  event: Event;
  past: boolean;
  language: "it" | "en";
}) {
  const title = language === "en" ? event.title_en || event.title : event.title;
  return (
    <Card className="sft-site-event-card">
      <div className="sft-site-card-image">
        <Image
          src={event.image_url || "/gallery/garda-racing.jpg"}
          alt={event.image_alt || title}
          fill
          sizes="(max-width:767px) 100vw, (max-width:1100px) 50vw, 33vw"
        />
      </div>
      <CardContent>
        <Badge variant="secondary">
          {language === "it"
            ? past
              ? "Archivio"
              : "In programma"
            : past
              ? "Archive"
              : "Upcoming"}
        </Badge>
        <h3 className="sft-display">{title}</h3>
        <time dateTime={event.date}>
          {new Date(event.date).toLocaleDateString(language, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <p>{event.location}</p>
      </CardContent>
    </Card>
  );
}
export default function EventsSection({ events, unavailable = false }: { events: Event[]; unavailable?: boolean }) {
  const { language } = useLanguage();
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.date).getTime() >= now);
  const past = events.filter((e) => new Date(e.date).getTime() < now);
  return (
    <section id="events" className="sft-site-events">
      <div className="sft-site-section">
        <p className="sft-eyebrow">
          {language === "it"
            ? "Il team fuori dal cantiere"
            : "The team beyond the workshop"}
        </p>
        {events.length === 0 && (
          <>
            <h2 className="sft-display">
              {language === "it" ? "Eventi del team" : "Team events"}
            </h2>
            <p role={unavailable ? "status" : undefined}>
              {unavailable
                ? language === "it"
                  ? "Gli eventi non sono raggiungibili al momento. Riprova tra poco."
                  : "Events are temporarily unavailable. Please try again shortly."
                : language === "it"
                  ? "Non ci sono eventi disponibili al momento."
                  : "There are no events available at the moment."}
            </p>
          </>
        )}
        {[
          {
            rows: upcoming,
            past: false,
            id: "upcoming-events",
            title: homeTranslations[language].upcomingEvents,
          },
          {
            rows: past,
            past: true,
            id: "past-events",
            title: homeTranslations[language].pastEvents,
          },
        ]
          .filter((g) => g.rows.length)
          .map((g) => (
            <section key={g.id} id={g.id} className="sft-site-events-group">
              <h2 className="sft-display">{g.title}</h2>
              <div className="sft-site-event-grid">
                {g.rows.map((e) => (
                  <EventCard
                    key={e.id}
                    event={e}
                    past={g.past}
                    language={language}
                  />
                ))}
              </div>
            </section>
          ))}
      </div>
    </section>
  );
}
