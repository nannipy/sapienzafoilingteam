import type { Metadata } from 'next';
import SponsorClientPage from './SponsorClientPage';

export const metadata: Metadata = {
  title: 'Sponsor & Partner Tecnologici',
  description: 'Scopri le aziende, le istituzioni e i partner industriali che supportano l’innovazione, la ricerca sui materiali sostenibili e le regate del Sapienza Foiling Team.',
  alternates: {
    canonical: '/sponsor',
  },
  openGraph: {
    title: 'Sponsor & Partner | Sapienza Foiling Team',
    description: 'Le realtà industriali al fianco del team velico di Sapienza Università di Roma.',
    url: 'https://sapienzafoilingteam.com/sponsor',
    images: [
      {
        url: '/images/sponsor-03-sail-partners-2.jpg',
        width: 1200,
        height: 630,
        alt: 'Sponsor e Partner Sapienza Foiling Team',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sponsor & Partner | Sapienza Foiling Team',
    description: 'Le realtà industriali al fianco del Sapienza Foiling Team.',
    images: ['/images/sponsor-03-sail-partners-2.jpg'],
  },
};

export default function SponsorPage() {
  return <SponsorClientPage />;
}