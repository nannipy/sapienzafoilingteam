import type { Metadata } from 'next';
import TeamClientPage from './TeamClientPage';

export const metadata: Metadata = {
  title: 'Il Team | Reparti & Ingegneria Foiling',
  description: 'Scopri i reparti e gli studenti della Sapienza Università di Roma che progettano Meravijosa: Aerodinamica, Idrodinamica, Strutture, Elettronica, Sostenibilità e Management.',
  alternates: {
    canonical: '/team',
  },
  openGraph: {
    title: 'Il Team | Sapienza Foiling Team',
    description: 'I membri e le divisioni ingegneristiche del Sapienza Foiling Team.',
    url: 'https://sapienzafoilingteam.com/team',
    images: [
      {
        url: '/images/team-01-crew-official.jpg',
        width: 1200,
        height: 630,
        alt: 'Il team Sapienza Foiling',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Il Team | Sapienza Foiling Team',
    description: 'I reparti ingegneristici del Sapienza Foiling Team.',
    images: ['/images/team-01-crew-official.jpg'],
  },
};

export default function TeamPage() {
  return <TeamClientPage />;
}