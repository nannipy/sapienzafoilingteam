"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { Button } from "@sft/design-system";
import { useLanguage } from "../context/LanguageContext";
import { footerTranslations } from "../translations/footer";
export default function Footer() {
  const { language } = useLanguage();
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;
  return (
    <footer className="sft-root sft-site-footer">
      <div className="sft-site-footer-top">
        <div>
          <Link href="/" aria-label="Sapienza Foiling Team — Home">
            <span className="sft-brand sft-site-footer-lockup"><img src="/brand/logos/sft-burgundy.svg" alt="" width={36} height={48} />            <svg
              className="sft-site-wordmark"
              viewBox="0 0 156 48"
              aria-hidden="true"
            >
              <text
                x="0"
                y="21"
                textLength="156"
                lengthAdjust="spacingAndGlyphs"
              >
                SAPIENZA
              </text>
              <text
                x="0"
                y="46"
                textLength="156"
                lengthAdjust="spacingAndGlyphs"
              >
                FOILING TEAM
              </text>
            </svg></span>
          </Link>
          <p>{footerTranslations[language].description}</p>
        </div>
        <div>
          <p className="sft-eyebrow">
            {language === "it"
              ? "Parliamo del progetto"
              : "Let’s talk about the project"}
          </p>
          <a
            className="sft-site-email"
            href="mailto:sapienzafoilingteam@gmail.com"
          >
            sapienzafoilingteam@gmail.com
          </a>
          <div className="sft-site-socials">
            {[
              {
                Icon: Instagram,
                href: "https://instagram.com/sapienzafoilingteam",
                name: "Instagram",
              },
              {
                Icon: Linkedin,
                href: "https://linkedin.com/company/sapienzafoilingteam",
                name: "LinkedIn",
              },
              {
                Icon: Facebook,
                href: "https://facebook.com/sapienzafoilingteam",
                name: "Facebook",
              },
            ].map(({ Icon, href, name }) => (
              <Button key={name} asChild variant="outline" size="icon">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                >
                  <Icon />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="sft-site-footer-bottom">
        <p>© {new Date().getFullYear()} Sapienza Foiling Team</p>
        <Link href="/privacy-policy">Privacy Policy</Link>
      </div>
    </footer>
  );
}
