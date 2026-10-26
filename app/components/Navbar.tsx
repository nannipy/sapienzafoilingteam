"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@sft/design-system";

import { useLanguage } from "../context/LanguageContext";
import { navbarTranslations } from "../translations/navbar";
import posthog from "posthog-js";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  const { language, setLanguage } = useLanguage();
  const t = navbarTranslations[language];
  const items = [
    { label: t.boat, href: "/boat" },
    { label: t.team, href: "/team" },
    { label: t.sponsor, href: "/sponsor" },
    { label: t.contact, href: "/contact" },
    { label: t.blog, href: "/blog" },
  ];
  useEffect(() => {
    setOpen(false);
  }, [path]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  useEffect(() => {
    const update = () => setCompact(previous => window.scrollY > (previous ? 24 : 64));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const track = (to: string, type: "menu" | "cta") =>
    posthog.capture("page_navigation", {
      from_page: path,
      to_page: to,
      navigation_type: type,
    });
  if (path?.startsWith("/admin")) return null;
  return (
    <header className="sft-root sft-site-header" data-compact={compact && !open}>
      <a href="#main-content" className="sft-site-skip">
        {language === "it" ? "Vai al contenuto" : "Skip to content"}
      </a>
      <nav
        aria-label={
          language === "it" ? "Navigazione principale" : "Main navigation"
        }
        className="sft-site-nav"
      >
        <Link href="/" aria-label="Sapienza Foiling Team — Home">
          <span className="sft-brand sft-site-nav-lockup">
            <img
              src="/brand/logos/sft-burgundy.svg"
              alt=""
              width={36}
              height={48}
            />
            <svg
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
            </svg>
          </span>
        </Link>
        <div className="sft-site-desktop-nav" data-testid="desktop-nav">
          {items.map((item) => (
            <Link
              href={item.href}
              className={item.href === "/boat" ? "sft-site-boat-link" : undefined}
              key={item.href}
              aria-current={path === item.href ? "page" : undefined}
              onClick={() => track(item.href, "menu")}
            >
              {item.label}
              {item.href === "/boat" && <ArrowUpRight aria-hidden="true" />}
            </Link>
          ))}
          <Button asChild variant="brand">
            <Link href="/career" onClick={() => track("career", "cta")}>
              {t.career}
            </Link>
          </Button>
        </div>
        <div className="sft-site-nav-tools">
          <Button
            variant="outline"
            aria-label={
              language === "it" ? "Leggi in inglese" : "Read in Italian"
            }
            onClick={() => setLanguage(language === "it" ? "en" : "it")}
            className="sft-site-language"
          >
            <span aria-hidden="true">{language === "it" ? "EN" : "IT"}</span>
            <span className="sr-only">
              {language === "it" ? "Read in English" : "Leggi in italiano"}
            </span>
          </Button>
          <Button
            ref={trigger}
            variant="ghost"
            size="icon"
            className="sft-site-menu-toggle"
            aria-label={
              language === "it" ? "Menu di navigazione" : "Navigation menu"
            }
            aria-expanded={open}
            aria-controls="sft-mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>
      {open && (
        <div
          id="sft-mobile-menu"
          className="sft-site-mobile-menu"
          data-testid="mobile-menu"
        >
          <nav
            aria-label={
              language === "it" ? "Navigazione mobile" : "Mobile navigation"
            }
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={item.href === "/boat" ? "sft-site-boat-link" : undefined}
                aria-current={path === item.href ? "page" : undefined}
                onClick={() => {
                  setOpen(false);
                  track(item.href, "menu");
                }}
              >
                {item.label}
                {item.href === "/boat" && <ArrowUpRight aria-hidden="true" />}
              </Link>
            ))}
            <Button asChild variant="brand">
              <Link
                href="/career"
                onClick={() => {
                  setOpen(false);
                  track("career", "cta");
                }}
              >
                {t.career}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
