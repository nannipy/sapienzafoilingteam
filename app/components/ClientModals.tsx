'use client';

import dynamic from 'next/dynamic';

const CookieBanner = dynamic(() => import('./CookieBanner'), {
  ssr: false,
});

const RecruitingPopup = dynamic(() => import('./RecruitingPopup'), {
  ssr: false,
});

export default function ClientModals() {
  return (
    <>
      <CookieBanner />
      <RecruitingPopup />
    </>
  );
}
