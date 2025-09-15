'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { cookie } from '../translations/cookie';
import posthog from 'posthog-js';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'accepted') {
      posthog.opt_in_capturing();
    } else if (consent === 'rejected') {
      posthog.opt_out_capturing();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
    posthog.opt_in_capturing();
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowBanner(false);
    posthog.opt_out_capturing();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white border border-gray-200 p-3 rounded-lg shadow-lg z-50">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-600">
          {cookie[language].message}
          <a href="/privacy-policy" className="text-[#822433] hover:underline ml-1 text-xs">
            {cookie[language].privacyLink}
          </a>
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleReject}
            className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
          >
            {cookie[language].reject}
          </button>
          <button
            onClick={handleAccept}
            className="px-3 py-1 text-xs text-white bg-[#822433] rounded-md hover:bg-[#6d1f2b] transition-colors"
          >
            {cookie[language].accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;