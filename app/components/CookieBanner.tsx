"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { cookie } from "../translations/cookie";
import posthog from "posthog-js";
import { Button } from "@sft/design-system";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "accepted") {
      posthog.opt_in_capturing();
    } else if (consent === "rejected") {
      posthog.opt_out_capturing();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
    posthog.opt_in_capturing();
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowBanner(false);
    posthog.opt_out_capturing();
  };

  if (!showBanner) return null;

  return (
    <div
      className="sft-root sft-site-cookie"
      role="region"
      aria-label={
        language === "it" ? "Preferenze cookie" : "Cookie preferences"
      }
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-600">
          {cookie[language].message}
          <Link
            href="/privacy-policy"
            className="text-brand hover:underline ml-1 text-xs"
          >
            {cookie[language].privacyLink}
          </Link>
        </p>
        <div className="sft-site-cookie-actions">
          <Button onClick={handleReject} variant="outline">
            {cookie[language].reject}
          </Button>
          <Button onClick={handleAccept}>{cookie[language].accept}</Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
