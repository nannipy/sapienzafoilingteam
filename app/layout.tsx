import type { Metadata, Viewport } from "next";
import Script from "next/script";
import ClientModals from "./components/ClientModals";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { LanguageProvider } from "./context/LanguageContext";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PHProvider, PostHogPageview } from "./PostHogProvider";
import { Suspense } from "react";
import { WebAnalytics } from "./components/WebAnalytics";
import { geist, geistMono, kelson } from "./fonts";

const SITE_URL = 'https://sapienzafoilingteam.com';

export const viewport: Viewport = {
  themeColor: '#0a0808',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sapienza Foiling Team | SuMoth Challenge Sailing Team',
    template: '%s | Sapienza Foiling Team',
  },
  description: 'Team velico universitario della Sapienza Università di Roma. Progettiamo e costruiamo imbarcazioni foiling sostenibili ad alte prestazioni per la SuMoth Challenge sul Lago di Garda.',
  applicationName: 'Sapienza Foiling Team',
  keywords: [
    'Sapienza Foiling Team',
    'SuMoth Challenge',
    'Moth foiling',
    'Meravijosa',
    'Sapienza Vela',
    'Sailing Team Sapienza',
    'barca volante',
    'idrofoil',
    'Lake Garda foiling',
    'bio-resina',
    'lino',
    'sostenibilità nautica',
    'Sapienza Università di Roma',
  ],
  authors: [{ name: 'Sapienza Foiling Team', url: SITE_URL }],
  creator: 'Sapienza Foiling Team',
  publisher: 'Sapienza Foiling Team',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    alternateLocale: ['en_US'],
    url: SITE_URL,
    siteName: 'Sapienza Foiling Team',
    title: 'Sapienza Foiling Team | SuMoth Challenge Sailing Team',
    description: 'Team velico universitario della Sapienza Università di Roma. Progettiamo e costruiamo imbarcazioni foiling sostenibili ad alte prestazioni per la SuMoth Challenge.',
    images: [
      {
        url: '/images/hero-01.jpg',
        width: 1200,
        height: 630,
        alt: 'Sapienza Foiling Team - Volo sul Lago di Garda',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sapienza Foiling Team | SuMoth Challenge Sailing Team',
    description: 'Team velico universitario della Sapienza Università di Roma. Progettiamo e costruiamo imbarcazioni foiling sostenibili ad alte prestazioni.',
    images: ['/images/hero-01.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SportsTeam',
      '@id': `${SITE_URL}/#team`,
      name: 'Sapienza Foiling Team',
      url: SITE_URL,
      logo: `${SITE_URL}/logosft.svg`,
      image: `${SITE_URL}/images/hero-01.jpg`,
      description: 'Team velico studentesco della Sapienza Università di Roma che progetta e costruisce barche a vela foiling sostenibili per la SuMoth Challenge.',
      sport: 'Sailing / Hydrofoil',
      parentOrganization: {
        '@type': 'CollegeOrUniversity',
        name: 'Sapienza Università di Roma',
        url: 'https://www.uniroma1.it',
      },
      sameAs: [
        'https://instagram.com/sapienzafoilingteam',
        'https://linkedin.com/company/sapienzafoilingteam',
        'https://facebook.com/sapienzafoilingteam',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Sapienza Foiling Team',
      publisher: {
        '@id': `${SITE_URL}/#team`,
      },
      inLanguage: ['it-IT', 'en-US'],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} ${kelson.variable} antialiased`}>
        <PHProvider>
          <WebAnalytics />
          <Suspense>
            <PostHogPageview />
          </Suspense>
          <LanguageProvider>
            <Navbar />
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
            <ClientModals />
            <Script
              defer
              src="https://cloud.umami.is/script.js"
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "8e192a5d-4d99-4f60-98eb-b89d5a77bdf0"}
              strategy="afterInteractive"
            />
          </LanguageProvider>
        </PHProvider>
      </body>
    </html>
  );
}
