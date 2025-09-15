'use client';

import React from "react";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { homeTranslations } from '../translations/home';
import { usePostHog } from 'posthog-js/react';

type SocialMediaSectionProps = Record<string, never>;

const SocialMediaSection: React.FC<SocialMediaSectionProps> = () => {
  const { language } = useLanguage();
  const posthog = usePostHog();

  const handleSocialClick = (platform: 'instagram' | 'linkedin' | 'facebook') => {
    posthog.capture('social_media_clicked', {
      platform: platform,
      location: 'social_section'
    });
  };

  return (
    <section className="py-12 bg-[#FDF1F3] text-black">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-8">{homeTranslations[language].followUs}</h3>
          <div className="flex justify-center space-x-8">
            <a 
              href="https://www.instagram.com/sapienzafoilingteam/" 
              onClick={() => handleSocialClick('instagram')}
              className="hover:text-[#822433] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-8 h-8 hover:scale-110 transition-transform" />
            </a>
            <a 
              href="https://www.linkedin.com/company/sapienza-foiling-team/about/" 
              onClick={() => handleSocialClick('linkedin')}
              className="hover:text-[#822433] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-8 h-8 hover:scale-110 transition-transform" />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61572515878295" 
              onClick={() => handleSocialClick('facebook')}
              className="hover:text-[#822433] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-8 h-8 hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
