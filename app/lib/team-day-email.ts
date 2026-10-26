import 'server-only';
import { randomUUID } from 'node:crypto';
import QRCode from 'qrcode';
import { supabaseAdmin } from './supabase-admin';
import { getTicketByCode, relationArray } from './team-day-tickets';
import { ticketOrigin } from './team-day-ticket-url';
import { createTeamDayTicketPdf } from './team-day-pdf';
import { ticketQrValue } from './team-day-ticket-types';

const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]!));
export async function deliverTicketEmail(jobId: string) {
  const lease = randomUUID();
  const { data: job, error } = await supabaseAdmin.rpc('claim_team_day_email', { p_id: jobId, p_lease: lease });
  if (error) throw new Error('Invio non disponibile');
  if (!job) return;
  const finish = async (values: Record<string, unknown>) => {
    const { error } = await supabaseAdmin.from('team_day_ticket_emails').update({ ...values, lease_until: null })
      .eq('id',jobId).eq('lease_id',lease);
    if (error) throw new Error('Stato email non aggiornato');
    return values.status as string;
  };
  if (!process.env.RESEND_API_KEY || !process.env.SFT_TICKET_EMAIL_FROM || !process.env.SFT_PUBLIC_URL) {
    return finish({ status:'failed',error:'email_configuration_missing',next_attempt_at:new Date(Date.now()+300000).toISOString() });
  }
  try {
    const { data: row, error } = await supabaseAdmin.from('team_day_tickets').select('code').eq('id', job.ticket_id).single();
    if (error || !row) throw new Error('ticket_missing');
    const ticket = await getTicketByCode(row.code);
    if (!ticket || ticket.status === 'cancelled') { return finish({ status:'suppressed',error:'ticket_cancelled' }); }
    let payload = job.payload;
    if (!payload) {
      const url = `${ticketOrigin()}/sft-day/tickets/${ticket.code}`;
      const qr = await QRCode.toBuffer(ticketQrValue(ticket.code), { width: 480, margin: 4 });
      const pdf = await createTeamDayTicketPdf(ticket);
      payload = {
        from: process.env.SFT_TICKET_EMAIL_FROM, to: [job.recipient], subject: 'Il tuo biglietto per SFT Day · 8 novembre 2026',
        html: `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#211a1a;line-height:1.6;max-width:560px">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b6b6b">Sapienza Foiling Team</p>
<h1 style="margin:0 0 16px;color:#761c2a">SFT Day</h1>
<p>Ciao ${escape(ticket.firstName)},</p>
<p>la tua prenotazione per l’SFT Day è registrata. Questo è il biglietto personale di <strong>${escape(ticket.firstName)} ${escape(ticket.lastName)}</strong>.</p>
<p style="margin:0 0 16px"><strong>Domenica 8 novembre 2026 · dalle 11:00</strong><br>Aeroporto dell’Urbe · Via Salaria 825, Roma</p>
<img src="cid:ticket-qr" width="240" height="240" alt="QR code del biglietto" style="display:block;margin:0 0 8px">
<p style="margin:0 0 24px;font-size:14px;color:#6b6b6b">Codice personale: <strong>${ticket.code}</strong></p>
<h2 style="margin:0 0 4px;font-size:17px">Il QR code è la tua prenotazione</h2>
<p style="margin:0 0 20px">Mostralo all’arrivo: conferma la tua prenotazione e permette al team di registrare l’ingresso. <strong>Non è una ricevuta</strong> e da solo non conferma il pagamento.</p>
<h2 style="margin:0 0 4px;font-size:17px">Il pagamento viene verificato alla reception</h2>
<p style="margin:0 0 20px">La quota di 15 € per persona viene controllata alla reception il giorno dell’evento. Se hai già pagato, porta con te la ricevuta o la contabile del bonifico per rendere la verifica più rapida.</p>
<p style="margin:0 0 20px">Un biglietto è personale e vale per un solo ingresso: non condividere il codice.</p>
<p style="margin:0 0 20px"><a href="${url}" style="color:#761c2a">Apri il tuo biglietto</a> &nbsp;·&nbsp; <a href="${url}/pdf" style="color:#761c2a">Scarica il biglietto PDF</a></p>
<p style="margin:0;font-size:14px;color:#6b6b6b">Per qualsiasi dubbio sul pagamento scrivi a sapienzafoilingteam@gmail.com.</p>
</div>`,
        text: `Sapienza Foiling Team · SFT Day\n\nCiao ${ticket.firstName},\nla tua prenotazione per l’SFT Day è registrata. Questo è il biglietto personale di ${ticket.firstName} ${ticket.lastName}.\n\nDomenica 8 novembre 2026 · dalle 11:00\nAeroporto dell’Urbe · Via Salaria 825, Roma\n\nCodice personale: ${ticket.code}\n\nIL QR CODE È LA TUA PRENOTAZIONE\nMostralo all’arrivo: conferma la prenotazione e permette al team di registrare l’ingresso. Non è una ricevuta e da solo non conferma il pagamento.\n\nIL PAGAMENTO VIENE VERIFICATO ALLA RECEPTION\nLa quota di 15 € per persona viene controllata alla reception il giorno dell’evento. Se hai già pagato, porta con te la ricevuta o la contabile del bonifico per rendere la verifica più rapida.\n\nUn biglietto è personale e vale per un solo ingresso: non condividere il codice.\n\nBiglietto: ${url}\nPDF: ${url}/pdf\n\nPer qualsiasi dubbio sul pagamento scrivi a sapienzafoilingteam@gmail.com.`,
        attachments: [{ filename:'biglietto-qr.png', content:qr.toString('base64'), content_id:'ticket-qr' }, { filename:`SFT-Day-${ticket.code}.pdf`,content:pdf.toString('base64'),content_type:'application/pdf' }],
      };
      // Persist the exact provider body before the first send. Retries cannot change its idempotency payload.
      const { error: saveError } = await supabaseAdmin.from('team_day_ticket_emails').update({ payload })
        .eq('id',jobId).eq('lease_id',lease);
      if (saveError) throw new Error('payload_not_saved');
    }
    if (!job.first_attempt_at) {
      const { error: saveError } = await supabaseAdmin.from('team_day_ticket_emails').update({ first_attempt_at:new Date().toISOString() })
        .eq('id',jobId).eq('lease_id',lease);
      if (saveError) throw new Error('attempt_not_saved');
    }
    const response = await fetch('https://api.resend.com/emails', {
      method:'POST', headers: { Authorization:`Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type':'application/json', 'Idempotency-Key':`sft-ticket/${jobId}` },
      body:JSON.stringify(payload), signal:AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`provider_${response.status}`);
    const result = await response.json();
    if (!result.id) throw new Error('provider_invalid_response');
    return await finish({ status:'sent',sent_at:new Date().toISOString(),provider_id:result.id,error:null });
  } catch {
    // No participant data, bearer codes, provider bodies or secrets in logs/errors.
    return finish({ status:'failed',error:'delivery_failed',next_attempt_at:new Date(Date.now()+Math.min(21600000,300000*2**Math.min(job.attempts,6))).toISOString() });
  }
}
export async function deliverBookingEmails(registrationId: string) {
  const { data: people, error } = await supabaseAdmin.from('team_day_participants').select('team_day_tickets(id)').eq('registration_id', registrationId);
  if (error) throw new Error('Email non disponibili');
  // The initial job ID equals the ticket ID. At most ten jobs per booking.
  const results = await Promise.allSettled((people ?? []).flatMap(p => relationArray(p.team_day_tickets).map(t => deliverTicketEmail(t.id))));
  if (results.some(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value === 'failed'))) throw new Error('Alcune email sono ancora in sospeso');
}
export async function processPendingTicketEmails() {
  const { data, error } = await supabaseAdmin.from('team_day_ticket_emails').select('id').in('status',['pending','failed','sending'])
    .lte('next_attempt_at',new Date().toISOString()).or(`lease_until.is.null,lease_until.lt.${new Date().toISOString()}`).order('created_at').limit(20);
  if (error) throw new Error('Coda non disponibile');
  const results = await Promise.allSettled((data ?? []).map(row => deliverTicketEmail(row.id)));
  return { processed:results.filter(r=>r.status==='fulfilled' && r.value==='sent').length, errors:results.filter(r=>r.status==='rejected' || (r.status==='fulfilled' && r.value==='failed')).length };
}
