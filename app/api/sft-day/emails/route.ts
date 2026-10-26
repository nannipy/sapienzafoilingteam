import { timingSafeEqual } from 'node:crypto';
import { processPendingTicketEmails } from '@/app/lib/team-day-email';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const actual = Buffer.from(request.headers.get('authorization') ?? '');
  const expected = Buffer.from(`Bearer ${process.env.CRON_SECRET ?? ''}`);
  if (!process.env.CRON_SECRET || actual.length !== expected.length || !timingSafeEqual(actual,expected)) return new Response(null,{status:401});
  try { return Response.json(await processPendingTicketEmails(),{headers:{'Cache-Control':'no-store'}}); }
  catch { return Response.json({error:'Email queue unavailable'},{status:503}); }
}
