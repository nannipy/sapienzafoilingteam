import type { Metadata } from 'next';
import { getTeamDayPaymentOptions, TEAM_DAY_DATE, TEAM_DAY_PRICE_EUR } from '@/app/lib/team-day-config';
import TeamDayClientPage from '@/app/team-day/TeamDayClientPage';
import '@/app/team-day/team-day.css';

export const metadata: Metadata = {
  title: 'SFT Day — 8 novembre 2026',
  description: 'Prenota il tuo posto all’SFT Day, l’8 novembre 2026 dalle 11:00 all’Aeroporto dell’Urbe, Via Salaria 825, Roma. Quota di partecipazione: 15 € a persona.',
  alternates: { canonical: '/sft-day' },
  openGraph: {
    title: 'SFT Day — 8 novembre 2026',
    description: 'Dalle 11:00 all’Aeroporto dell’Urbe, Via Salaria 825, Roma. Musica dal vivo, food e drinks. Partecipazione: 15 € a persona.',
    url: '/sft-day',
    images: [{ url: '/events/sft-team-day-2026-11-08-v2.png', width: 1080, height: 1350, alt: 'Locandina SFT Day' }],
  },
};

export default function SftDayPage() {
  return <TeamDayClientPage paymentOptions={getTeamDayPaymentOptions()} eventDate={TEAM_DAY_DATE} priceEur={TEAM_DAY_PRICE_EUR} />;
}
