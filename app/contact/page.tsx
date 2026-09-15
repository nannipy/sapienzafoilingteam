import type { Metadata } from 'next';
import ContactClientPage from './ContactClientPage';

export const metadata: Metadata = {
  title: 'Contattaci | Collaborazioni & Informazioni',
  description: 'Contatta il Sapienza Foiling Team per opportunità di sponsorizzazione, tesi di laurea, progetti di ricerca o informazioni sulle attività del team velico.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contatti | Sapienza Foiling Team',
    description: 'Mettiti in contatto con il team velico foiling di Sapienza Università di Roma.',
    url: 'https://sapienzafoilingteam.com/contact',
  },
};

export default function ContactPage() {
  return <ContactClientPage />;
}