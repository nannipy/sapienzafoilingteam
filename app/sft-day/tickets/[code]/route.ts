import { getTicketByCode, ticketView } from '@/app/lib/team-day-tickets';
import { parseTicketCode } from '@/app/lib/team-day-ticket-types';
export const runtime = 'nodejs';
const escape = (s: string) => s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
// Standalone document deliberately bypasses the public marketing layout and its analytics.
// Ticket codes are bearer secrets and must never be reported to third-party page trackers.
export async function GET(_request: Request, { params }: { params: Promise<{code:string}> }) {
  const headers = { 'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'private, no-store', 'Referrer-Policy':'no-referrer',
    'X-Robots-Tag':'noindex, nofollow, noarchive', 'Content-Security-Policy':"default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'" };
  const code = parseTicketCode((await params).code);
  if (!code) return new Response('Biglietto non trovato',{status:404,headers});
  try {
    const ticket = await getTicketByCode(code);
    if (!ticket) return new Response('Biglietto non trovato',{status:404,headers});
    const view = await ticketView(ticket);
    const pdfPath = `/sft-day/tickets/${code}/pdf`;
    const status = {valid:'Valido · Valid',used:'Ingresso già registrato · Already used',cancelled:'Annullato · Cancelled'}[ticket.status];
    return new Response(`<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Biglietto SFT Day</title><style>
:root{--primary:#761c2a;--border:#ddd;--radius:12px}*{box-sizing:border-box}body{margin:0;background:#faf9f7;color:#211a1a;font:16px/1.6 system-ui,sans-serif}main{max-width:600px;margin:32px auto;padding:24px;background:white;border:1px solid var(--border);border-radius:var(--radius)}h1{color:var(--primary)}img{display:block;max-width:100%;height:auto}code{display:block;overflow-wrap:anywhere}nav{display:flex;flex-wrap:wrap;gap:16px;margin-block:24px}a{color:var(--primary);padding:12px;border:1px solid var(--border);border-radius:var(--radius)}a:focus-visible{outline:3px solid var(--primary)}@media print{nav{display:none}main{border:0;margin:0}}
</style></head><body><main><p>Sapienza Foiling Team</p><h1>SFT Day</h1><h2>${escape(ticket.firstName)} ${escape(ticket.lastName)}</h2><p>8 novembre 2026 · 11:00<br>Aeroporto dell’Urbe · Via Salaria 825, Roma</p><p><strong>${status}</strong></p><img src="${view.qrDataUrl}" width="320" height="320" alt="QR code personale / Personal entry QR"><code>${ticket.code}</code><nav aria-label="Salva biglietto / Save ticket"><a href="${view.qrDataUrl}" download="SFT-Day-QR.png">Scarica QR / Save QR</a><a href="${pdfPath}">Scarica biglietto PDF / Download PDF ticket</a></nav><p>Conserva il biglietto, anche come stampa o screenshot. Non condividere il codice: consente un solo ingresso.<br>Keep this ticket private. One admission per ticket.</p><p>Il biglietto non attesta il pagamento. / A ticket is not proof of payment.</p></main></body></html>`,{headers});
  } catch { return new Response('Biglietto temporaneamente non disponibile. Riprova.',{status:503,headers}); }
}
