import { getTicketByCode } from '@/app/lib/team-day-tickets';
import { createTeamDayTicketPdf } from '@/app/lib/team-day-pdf';
import { parseTicketCode } from '@/app/lib/team-day-ticket-types';
export const runtime = 'nodejs';
export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const headers = { 'Cache-Control':'private, no-store', 'Referrer-Policy':'no-referrer', 'X-Robots-Tag':'noindex, nofollow', 'X-Content-Type-Options':'nosniff' };
  const code = parseTicketCode((await params).code);
  if (!code) return new Response('Biglietto non trovato',{status:404,headers});
  try {
    const ticket = await getTicketByCode(code);
    if (!ticket) return new Response('Biglietto non trovato',{status:404,headers});
    // Used/cancelled tickets can still be downloaded, with their current state clearly printed.
    return new Response(new Uint8Array(await createTeamDayTicketPdf(ticket)), { headers:{...headers,
      'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="SFT-Day-${code}.pdf"`,
    }});
  } catch { return new Response('PDF temporaneamente non disponibile. Riprova.',{status:503,headers}); }
}
