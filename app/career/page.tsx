import type { Metadata } from 'next';
import { supabase } from '../lib/supabase';
import CareerClientPage from './CareerClientPage';
import { OpenPosition } from '../lib/types';

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

// Revalidate the page every hour to keep content fresh without a full rebuild
export const revalidate = 3600;


async function getOpenPositions(): Promise<OpenPosition[]> {
  const { data, error } = await supabase
    .from('open_positions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching open positions:', error.message);
    throw new Error('Failed to fetch open positions');
  }

  return data || [];
}

export default async function CareerPage() {
  // Fetch open positions on the server
  const openPositions = await getOpenPositions();

  // Render the client component with the fetched data
  return <CareerClientPage initialPositions={openPositions} />;
}