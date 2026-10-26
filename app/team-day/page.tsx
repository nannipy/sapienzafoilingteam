import type { Metadata } from 'next';
import { getTeamDayPaymentOptions, TEAM_DAY_DATE, TEAM_DAY_PRICE_EUR } from '@/app/lib/team-day-config';
import TeamDayClientPage from './TeamDayClientPage';
import './team-day.css';

export const metadata: Metadata = {
  title: 'Team Day — 8 novembre 2026',
  description: 'Prenota il tuo posto al Sapienza Foiling Team Day, l’8 novembre 2026 dalle 12:00 all’Aeroporto dell’Urbe, Via Salaria 825, Roma. Quota di partecipazione: 15 € a persona.',
  alternates: { canonical: '/team-day' },
  openGraph: {
    title: 'Sapienza Foiling Team Day — 8 novembre 2026',
    description: 'Dalle 12:00 all’Aeroporto dell’Urbe, Via Salaria 825, Roma. Musica dal vivo, food e drinks. Partecipazione: 15 € a persona.',
    url: '/team-day',
    images: [{ url: '/events/sft-team-day-2026-11-08.png', width: 1080, height: 1350, alt: 'Locandina Sapienza Foiling Team Day' }],
  },
};

export default function TeamDayPage() {
  return <TeamDayClientPage paymentOptions={getTeamDayPaymentOptions()} eventDate={TEAM_DAY_DATE} priceEur={TEAM_DAY_PRICE_EUR} />;
}
