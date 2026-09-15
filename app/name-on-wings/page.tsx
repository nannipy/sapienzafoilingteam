import type { Metadata } from 'next';
import NameOnWingsClientPage from './NameOnWingsClientPage';

export const metadata: Metadata = {
  title: 'Metti la tua Firma sulle Ali | Sostieni il Team',
  description: 'Supporta il Sapienza Foiling Team e vola con noi alla SuMoth Challenge. Apponi il tuo nome sulle ali di Meravijosa e sostieni l’innovazione velica sostenibile.',
  alternates: {
    canonical: '/name-on-wings',
  },
  openGraph: {
    title: 'Metti la tua Firma sulle Ali | Sapienza Foiling Team',
    description: 'Supporta il team e metti la tua firma sull’ala di Meravijosa per le regate sul Lago di Garda.',
    url: 'https://sapienzafoilingteam.com/name-on-wings',
    images: [
      {
        url: '/images/hero-01.jpg',
        width: 1200,
        height: 630,
        alt: 'Sapienza Foiling Team Name on Wings',
      },
    ],
  },
};

export default function NameOnWingsPage() {
  return <NameOnWingsClientPage />;
}
