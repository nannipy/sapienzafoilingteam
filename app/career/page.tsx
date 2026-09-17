import type { Metadata } from 'next';
import CareerClientPage from './CareerClientPage';

export const metadata: Metadata = {
  title: 'Unisciti al Team | Posizioni Aperte & Recruiting',
  description: 'Entra a far parte del Sapienza Foiling Team. Candidati per le divisioni di Aerodinamica, Idrodinamica, Strutture, Elettronica, Sostenibilità e Management.',
  alternates: {
    canonical: '/career',
  },
  openGraph: {
    title: 'Unisciti al Team | Sapienza Foiling Team',
    description: 'Candidati per entrare nel team velico foiling di Sapienza Università di Roma.',
    url: 'https://sapienzafoilingteam.com/career',
  },
};

export default function CareerPage() {
  return <CareerClientPage />;
}