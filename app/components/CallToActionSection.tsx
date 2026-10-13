"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@sft/design-system";
import { useLanguage } from "../context/LanguageContext";
import { homeTranslations } from "../translations/home";
export default function CallToActionSection() {
  const { language } = useLanguage();
  const t = homeTranslations[language];
  return (
    <section className="sft-site-recruit">
      <div>
        <p className="sft-eyebrow">
          {language === "it"
            ? "Il progetto cresce con le persone"
            : "The project grows with its people"}
        </p>
        <h2 className="sft-display">{t.joinTeamTitle}</h2>
        <p>{t.joinTeamDescription}</p>
        <Button asChild variant="secondary" size="lg">
          <Link href="/career">
            {t.joinUsButton}
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
      <div className="sft-site-recruit-word" aria-hidden="true">
        SFT
      </div>
    </section>
  );
}
