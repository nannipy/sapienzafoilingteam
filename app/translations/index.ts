'use client';

import { useLanguage } from '@/app/context/LanguageContext';

export { authTranslations } from './auth';
export { blogTranslations } from './blog';
export { boatTranslations } from './boat';
export { careerTranslations } from './career';
export { contactTranslations } from './contact';
export { cookie as cookieTranslations } from './cookie';
export { eventTranslations } from './event';
export { footerTranslations } from './footer';
export { homeTranslations } from './home';
export { navbarTranslations } from './navbar';
export { pastEventsTranslations } from './pastEvents';
export { presentationTranslations } from './presentation';
export { privacy as privacyTranslations } from './privacy';
export { signatureTranslations } from './signature';
export { sponsorTranslations } from './sponsor';
export { sumothRulebookTranslations } from './sumothRulebook';
export { teamTranslations } from './team';
export { upcomingEventsTranslations } from './upcomingEvents';

import { authTranslations } from './auth';
import { blogTranslations } from './blog';
import { boatTranslations } from './boat';
import { careerTranslations } from './career';
import { contactTranslations } from './contact';
import { cookie } from './cookie';
import { eventTranslations } from './event';
import { footerTranslations } from './footer';
import { homeTranslations } from './home';
import { navbarTranslations } from './navbar';
import { pastEventsTranslations } from './pastEvents';
import { presentationTranslations } from './presentation';
import { privacy } from './privacy';
import { signatureTranslations } from './signature';
import { sponsorTranslations } from './sponsor';
import { sumothRulebookTranslations } from './sumothRulebook';
import { teamTranslations } from './team';
import { upcomingEventsTranslations } from './upcomingEvents';

export const translations = {
  auth: authTranslations,
  blog: blogTranslations,
  boat: boatTranslations,
  career: careerTranslations,
  contact: contactTranslations,
  cookie,
  event: eventTranslations,
  footer: footerTranslations,
  home: homeTranslations,
  navbar: navbarTranslations,
  pastEvents: pastEventsTranslations,
  presentation: presentationTranslations,
  privacy,
  signature: signatureTranslations,
  sponsor: sponsorTranslations,
  sumothRulebook: sumothRulebookTranslations,
  team: teamTranslations,
  upcomingEvents: upcomingEventsTranslations,
} as const;

export type TranslationNamespace = keyof typeof translations;

export function useTranslations<K extends TranslationNamespace>(namespace: K) {
  const { language } = useLanguage();
  return translations[namespace][language as keyof (typeof translations)[K]];
}
