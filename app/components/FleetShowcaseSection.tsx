"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button, Card, CardContent } from "@sft/design-system";
import { useLanguage } from "../context/LanguageContext";
const details = [
  {
    image: "/images/studio-fem-cad.png",
    contain: true,
    it: ["Studio FEM e CAD", "Modelli CAD e analisi FEM per studiare geometrie e comportamento strutturale dei componenti."],
    en: ["FEM and CAD studies", "CAD models and FEM analysis to study component geometry and structural behaviour."],
  },
  {
    image: "/images/IMG_0631.jpeg",
    contain: false,
    it: ["Test in vasca e prototipi", "Prototipi e prove in vasca per confrontare il progetto con il comportamento in acqua."],
    en: ["Tank testing and prototypes", "Prototypes and tank tests to compare the design with its behaviour in water."],
  },
  {
    image: "/images/boat-03-water-launch.jpg",
    contain: false,
    it: ["Test sull’acqua", "Vele e configurazioni vengono verificate nelle condizioni reali del Garda."],
    en: ["Testing on the water", "Sails and configurations are tested in real conditions on Lake Garda."],
  },
  {
    image: "/images/IMG_3090.jpg",
    contain: false,
    it: ["Foil e assetto", "La bacchetta di regolazione meccanica controlla l’assetto durante il volo."],
    en: ["Foils and trim", "The mechanical wand regulates trim while the boat is foiling."],
  },
];

export default function FleetShowcaseSection() {
  const { language } = useLanguage();
  const it = language === "it";
  return (
    <section className="sft-site-fleet">
      <div className="sft-site-section">
        <div className="sft-site-section-heading">
          <div>
            <p className="sft-eyebrow">
              {it
                ? "Progettazione / Costruzione / Test"
                : "Design / Manufacturing / Testing"}
            </p>
            <h2 className="sft-display">
              {it ? "Meravijosa. Il nostro Moth." : "Meravijosa. Our Moth."}
            </h2>
          </div>
          <div>
            <p>
              {it
                ? "Un’imbarcazione foiling costruita dal team: dal lavoro in cantiere alle regate della SuMoth Challenge."
                : "A foiling boat built by the team, from the workshop to the SuMoth Challenge races."}
            </p>
            <Button asChild variant="link">
              <Link href="/boat">
                {it ? "Esplora la barca" : "Explore the boat"}
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
        <div className="sft-site-fleet-grid">
          {details.map((d) => (
            <Card key={d.image} className="sft-site-fleet-card">
              <div className="sft-site-card-image">
                <Image
                  src={d.image}
                  className={d.contain ? "sft-site-technical-image" : undefined}
                  alt={d[language][0]}
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                />
              </div>
              <CardContent>
                <h3 className="sft-display">{d[language][0]}</h3>
                <p>{d[language][1]}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
