/** @jest-environment node */
jest.mock('@/app/lib/public-action-security', () => ({ publicSourceHash: jest.fn().mockResolvedValue('test-source-hash'), consumePublicLimit: jest.fn().mockResolvedValue(true) }));
Object.defineProperty(globalThis, 'window', { value: {}, configurable: true });
jest.mock('server-only',()=>({}));
jest.mock('@/app/lib/supabase-admin',()=>({supabaseAdmin:{rpc:jest.fn(),from:jest.fn()}}));
jest.mock('@/app/lib/team-day-tickets',()=>({getTicketByCode:jest.fn(),relationArray:(v:unknown)=>Array.isArray(v)?v:v?[v]:[]}));
jest.mock('@/app/lib/team-day-ticket-url',()=>({ticketOrigin:()=> 'https://tickets.example.test'}));
import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { deliverTicketEmail, deliverBookingEmails } from '@/app/lib/team-day-email';
import { getTicketByCode } from '@/app/lib/team-day-tickets';
import { parseTicketCode,ticketQrValue } from '@/app/lib/team-day-ticket-types';
import { validateTeamDayInput } from '@/app/lib/team-day-validation';
import { controlTeamDayTicket, resendTeamDayTicket } from '@/app/actions/team-day-admin';
jest.mock('@/app/lib/supabase-server',()=>({requireAdmin:jest.fn().mockResolvedValue({id:'admin'})}));
import { requireAdmin } from '@/app/lib/supabase-server';
const code='b58fb537-c994-43c7-98ed-2fa9a3351374';
const input={firstName:'Mario',lastName:'Rossi',email:'m@example.test',payment:'cash',privacyAccepted:true,website:'',requestId:code};
const rpc=jest.mocked(supabaseAdmin.rpc),from=jest.mocked(supabaseAdmin.from);
const ticket={id:code,code,status:'valid',firstName:'Mario <script>',lastName:'Rossi',email:'m@example.test'};
let updates:Record<string,unknown>[];
let savedPayload:unknown;
const fakeFetch=jest.fn();
beforeEach(()=>{
 jest.clearAllMocks();updates=[];savedPayload=undefined;
 process.env.RESEND_API_KEY='test-key';process.env.SFT_TICKET_EMAIL_FROM='Team <test@example.test>';process.env.SFT_PUBLIC_URL='https://tickets.example.test';
 global.fetch=fakeFetch;
 jest.mocked(getTicketByCode).mockResolvedValue(ticket as never);
 rpc.mockResolvedValue({data:{id:code,ticket_id:code,recipient:ticket.email,attempts:1,payload:null},error:null} as never);
 from.mockImplementation((table:string)=>{
  if(table==='team_day_tickets')return {select:()=>({eq:()=>({single:async()=>({data:{code},error:null})})})} as never;
  const query={eq:()=>query,then:(resolve:(value:unknown)=>void)=>resolve({error:null})};
  return {update:(values:Record<string,unknown>)=>{updates.push(values);if(values.payload)savedPayload=values.payload;return query;}} as never;
 });
 fakeFetch.mockResolvedValue({ok:true,json:async()=>({id:'provider-id'})});
});
it('validates each group attendee and caps the group',()=>{
 expect(validateTeamDayInput({...input,participants:[{firstName:'Anna',lastName:'Verdi',email:'ANNA@example.test'}]})?.participants?.[0].email).toBe('anna@example.test');
 expect(validateTeamDayInput({...input,participants:[{firstName:'',lastName:'Verdi'}]})).toBeNull();
 expect(validateTeamDayInput({...input,participants:new Array(10).fill({firstName:'Anna',lastName:'Verdi'})})).toBeNull();
 expect(validateTeamDayInput({...input,participants:[null]})).toBeNull();
});
it('QR carries only a random code and parses manual and scanned values',()=>{
 expect(ticketQrValue(code)).toBe(`sft:${code}`);expect(parseTicketCode(`sft:${code}`)).toBe(code);expect(parseTicketCode(code)).toBe(code);
 expect(parseTicketCode('https://attacker.test/?name=Mario')).toBeNull();
});
it('persists exact email with QR and personal PDF attachment before provider submission',async()=>{
 await deliverTicketEmail(code);
 expect(updates[0]).toHaveProperty('payload');
 const request=fakeFetch.mock.calls[0][1];const body=JSON.parse(request.body);
 expect(request.headers['Idempotency-Key']).toBe(`sft-ticket/${code}`);
 expect(body.to).toEqual(['m@example.test']);expect(body.html).toContain('Mario &lt;script&gt;');
 expect(body.html).toContain('cid:ticket-qr');expect(body.html).toContain('/pdf');expect(body.html).not.toMatch(/wallet|pkpass/i);
 expect(Buffer.from(body.attachments[1].content,'base64').subarray(0,5).toString()).toBe('%PDF-');
 expect(Buffer.from(body.attachments[0].content,'base64').subarray(1,4).toString()).toBe('PNG');
 expect(updates.at(-1)).toMatchObject({status:'sent',provider_id:'provider-id'});
});
it('network failure remains recoverable and retry reuses identical provider body and key',async()=>{
 fakeFetch.mockRejectedValueOnce(new Error('timeout'));
 await deliverTicketEmail(code);expect(updates.at(-1)).toMatchObject({status:'failed'});
 const first=fakeFetch.mock.calls[0][1];
 rpc.mockResolvedValueOnce({data:{id:code,ticket_id:code,recipient:ticket.email,attempts:1,payload:savedPayload,first_attempt_at:new Date().toISOString()},error:null} as never);
 await deliverTicketEmail(code);
 expect(fakeFetch.mock.calls[1][1].body).toEqual(first.body);
 expect(fakeFetch.mock.calls[1][1].headers).toEqual(first.headers);
 expect(updates.at(-1)).toMatchObject({status:'sent'});
});
it('reports pending booking emails when the provider rejects delivery',async()=>{
 const originalFrom = from.getMockImplementation()!;
 from.mockImplementation((table:string)=>table==='team_day_participants'
   ? {select:()=>({eq:async()=>({data:[{team_day_tickets:[{id:code}]}],error:null})})} as never
   : originalFrom(table));
 fakeFetch.mockResolvedValueOnce({ok:false,status:503});
 await expect(deliverBookingEmails(code)).rejects.toThrow('Alcune email sono ancora in sospeso');
 expect(updates.at(-1)).toMatchObject({status:'failed'});
});
it('does not send without a lease or with missing config or cancelled ticket',async()=>{
 rpc.mockResolvedValueOnce({data:null,error:null} as never);await deliverTicketEmail(code);expect(fakeFetch).not.toHaveBeenCalled();
 delete process.env.RESEND_API_KEY;await deliverTicketEmail(code);expect(updates.at(-1)).toMatchObject({status:'failed',error:'email_configuration_missing'});expect(fakeFetch).not.toHaveBeenCalled();
 process.env.RESEND_API_KEY='test-key';jest.mocked(getTicketByCode).mockResolvedValueOnce({...ticket,status:'cancelled'} as never);
 await deliverTicketEmail(code);expect(fakeFetch).not.toHaveBeenCalled();
});
it('requires authentication before admission or resend, rejects malformed codes before RPC',async()=>{
 jest.mocked(requireAdmin).mockRejectedValueOnce(new Error('unauthorized'));
 await expect(controlTeamDayTicket(code,'check_in')).rejects.toThrow('unauthorized');expect(rpc).not.toHaveBeenCalled();
 jest.mocked(requireAdmin).mockRejectedValueOnce(new Error('unauthorized'));
 await expect(resendTeamDayTicket(code,code)).rejects.toThrow('unauthorized');expect(rpc).not.toHaveBeenCalled();
 await expect(controlTeamDayTicket('Mario','check_in')).rejects.toThrow('Codice');expect(rpc).not.toHaveBeenCalled();
});
