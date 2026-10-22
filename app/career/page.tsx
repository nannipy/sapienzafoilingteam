import type { Metadata } from 'next';
import CareerClientPage from './CareerClientPage';

export const metadata: Metadata = {
  title: 'Unisciti al Team | Candidature spontanee',
  description: 'Le selezioni del Sapienza Foiling Team sono momentaneamente chiuse. Puoi comunque inviare una candidatura spontanea.',
  alternates: {
    canonical: '/career',
  },
  openGraph: {
    title: 'Unisciti al Team | Sapienza Foiling Team',
    description: 'Selezioni momentaneamente chiuse: accettiamo solo candidature spontanee per il Sapienza Foiling Team.',
    url: 'https://sapienzafoilingteam.com/career',
  },
};

export default function CareerPage() {
  return <CareerClientPage />;
}