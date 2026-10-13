"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@sft/design-system";
import { EditorialHero } from "@sft/design-system/identity";
import { useLanguage } from "../context/LanguageContext";
import { homeTranslations } from "../translations/home";
import posthog from "posthog-js";
const slides = [
  [
    "/images/hero-01.jpg",
    "La squadra prepara il Moth nel paddock",
    "The team preparing the Moth in the paddock",
  ],
  [
    "/images/hero-02.jpg",
    "Il Moth del team in regata",
    "The team’s Moth racing",
  ],
  [
    "/images/events-01-sumoth-village-aerial.jpg",
    "Il villaggio della SuMoth Challenge",
    "The SuMoth Challenge village",
  ],
  [
    "/images/events-03-competitors-lineup.jpg",
    "Le imbarcazioni alla SuMoth Challenge",
    "Boats at the SuMoth Challenge",
  ],
  [
    "/images/events-06-racing-water.jpg",
    "La regata sul Garda",
    "Racing on Lake Garda",
  ],
  [
    "/images/sponsor-03-sail-partners-2.jpg",
    "I partner sulla vela del team",
    "Team partners on the sail",
  ],
  [
    "/images/hero-05.jpg",
    "Il Moth in volo sull’acqua",
    "The Moth foiling on the water",
  ],
];
export default function HeroSection() {
  const { language } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const start = useRef<number | null>(null);
  const it = language === "it";
  const t = homeTranslations[language];
  const step = (n: number) =>
    setCurrent((c) => (c + n + slides.length) % slides.length);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);
  const track = (type: string) =>
    posthog.capture("hero_cta_clicked", { cta_type: type, section: "hero" });
  return (
    <div
      className="sft-site-hero-wrap"
      onTouchStart={(e) => {
        start.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (start.current !== null) {
          const delta = start.current - e.changedTouches[0].clientX;
          if (Math.abs(delta) > 40) step(delta > 0 ? 1 : -1);
          start.current = null;
        }
      }}
    >
      <EditorialHero
        title={
          <>
            Sapienza
            <br />
            Foiling Team
          </>
        }
        description={t.heroSubtitle}
        image={
          <>
            <Image
              key={slides[current][0]}
              src={slides[current][0]}
              alt={slides[current][it ? 1 : 2]}
              fill
              sizes="(max-width: 767px) 100vw, 56vw"
              priority={current === 0}
              className="sft-site-hero-photo"
            />
            <div className="sft-site-gallery-controls">
              <Button
                variant="ghost"
                size="icon"
                aria-label={it ? "Foto precedente" : "Previous photo"}
                onClick={() => step(-1)}
              >
                <ChevronLeft />
              </Button>
              {!reducedMotion && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={
                    it
                      ? paused
                        ? "Riprendi galleria"
                        : "Pausa galleria"
                      : paused
                        ? "Resume slideshow"
                        : "Pause slideshow"
                  }
                  onClick={() => setPaused((p) => !p)}
                >
                  {paused ? <Play /> : <Pause />}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label={it ? "Foto successiva" : "Next photo"}
                onClick={() => step(1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </>
        }
        actions={
          <>
            <Button asChild variant="secondary" size="lg">
              <Link href="/team" onClick={() => track("learn_more")}>
                {t.learnMoreButton}
                <ArrowUpRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/boat" onClick={() => track("view_boat")}>
                {t.viewMothButton}
                <ArrowUpRight />
              </Link>
            </Button>
          </>
        }
      />
    </div>
  );
}
