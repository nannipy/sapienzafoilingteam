// app/career/page.tsx
import { supabase } from '../lib/supabase';
import CareerClientPage from './CareerClientPage';
import { OpenPosition } from '../lib/types';

// Revalidate the page every hour to keep content fresh without a full rebuild
export const revalidate = 3600;


async function getOpenPositions(): Promise<OpenPosition[]> {
  const { data, error } = await supabase
    .from('open_positions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching open positions:', error.message);
    // In a real app, you might want to show a specific error page.
    // Throwing an error will be caught by the nearest error.js/tsx boundary.
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