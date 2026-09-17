import type { Metadata } from 'next';
import BoatClientPage from './BoatClientPage';

export const metadata: Metadata = {
  title: 'Meravijosa Moth Foiling | Specifiche Tecniche & Design',
  description: 'Scopri Meravijosa, il foiling Moth ad alte prestazioni del Sapienza Foiling Team per la SuMoth Challenge. Scafo, foil in compositi, wand sensor e controllo del pitch.',
  alternates: {
    canonical: '/boat',
  },
  openGraph: {
    title: 'Meravijosa Moth Foiling | Sapienza Foiling Team',
    description: 'Specifiche tecniche di scafo, foil in lino e bio-resina, telemetria e assetto dinamico del nostro Moth da regata.',
    url: 'https://sapienzafoilingteam.com/boat',
    images: [
      {
        url: '/images/IMG_3090.jpg',
        width: 1200,
        height: 630,
        alt: 'Meravijosa Moth Foiling sul Lago di Garda',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meravijosa Moth Foiling | Sapienza Foiling Team',
    description: 'Specifiche tecniche e design aerodinamico di Meravijosa.',
    images: ['/images/IMG_3090.jpg'],
  },
};

export default function BoatPage() {
  return <BoatClientPage />;
}