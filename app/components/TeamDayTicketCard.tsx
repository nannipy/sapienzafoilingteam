'use client';
import { Button, Card, CardContent } from '@sft/design-system';
import { useLanguage } from '@/app/context/LanguageContext';
import { teamDayTranslations } from '@/app/translations/team-day';
import type { TicketView } from '@/app/lib/team-day-ticket-types';

export default function TeamDayTicketCard({ ticket }: { ticket: TicketView }) {
  const { language } = useLanguage();
  const t = teamDayTranslations[language];
  const href = `/sft-day/tickets/${ticket.code}`;
  return <Card className="sft-personal-ticket"><CardContent>
    <h3>{ticket.firstName} {ticket.lastName}</h3>
    <p>SFT Day · {t.date}</p><p>{t.location}</p>
    <p>{t.ticketStates[ticket.status]}</p>
    {/* Local data URL: QR contents never go to a third-party image service. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={ticket.qrDataUrl} width={240} height={240} alt={t.ticketQr} />
    <code>{ticket.code}</code>
    <p>{t.emailStates[ticket.emailStatus]}</p>
    <div className="sft-team-day-links">
      <Button asChild variant="outline"><a href={href} target="_blank" rel="noopener noreferrer">{t.openTicket}</a></Button>
      <Button asChild variant="outline"><a href={ticket.qrDataUrl} download={`SFT-Day-${ticket.code}.png`}>{t.downloadQr}</a></Button>
      <Button asChild variant="brand"><a href={`${href}/pdf`}>{t.downloadPdf}</a></Button>
    </div>
    <p>{t.keepPrivate}</p>
  </CardContent></Card>;
}
