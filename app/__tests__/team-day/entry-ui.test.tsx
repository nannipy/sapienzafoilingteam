import { fireEvent, render, screen } from '@testing-library/react';
import { TeamDayEntryControl } from '@/app/components/TeamDayTicketAdmin';
import { controlTeamDayTicket, setTeamDayPaymentStatus } from '@/app/actions/team-day-admin';
jest.mock('@/app/context/LanguageContext',()=>({useLanguage:()=>({language:'it'})}));
jest.mock('@/app/actions/team-day-admin',()=>({controlTeamDayTicket:jest.fn(),resendTeamDayTicket:jest.fn(),retryTeamDayEmails:jest.fn(),setTeamDayPaymentStatus:jest.fn(),setTeamDayParticipantArchived:jest.fn()}));
const control=jest.mocked(controlTeamDayTicket);
const markPaid=jest.mocked(setTeamDayPaymentStatus);
const code='b58fb537-c994-43c7-98ed-2fa9a3351374';
const registrationId='d1c5f7a2-1234-4abc-8def-0123456789ab';
beforeEach(()=>jest.clearAllMocks());
it('requires an explicit admission after verifying identity and blocks a second used-ticket admission',async()=>{
 control.mockResolvedValueOnce({result:'valid',firstName:'Anna',lastName:'Test',ticket:{code,checked_in_at:null}})
  .mockResolvedValueOnce({result:'admitted',firstName:'Anna',lastName:'Test',ticket:{code,checked_in_at:'2026-11-08T10:00:00Z'}})
  .mockResolvedValueOnce({result:'used',firstName:'Anna',lastName:'Test',ticket:{code,checked_in_at:'2026-11-08T10:00:00Z'}});
 const changed=jest.fn();render(<TeamDayEntryControl onChanged={changed}/>);
 fireEvent.change(screen.getByRole('textbox',{name:'QR o codice del biglietto'}),{target:{value:`sft:${code}`}});
 fireEvent.click(screen.getByRole('button',{name:'Verifica'}));
 expect(await screen.findByText('Anna Test')).toBeInTheDocument();
 expect(control).toHaveBeenLastCalledWith(`sft:${code}`,'verify');
 expect(changed).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Registra ingresso'}));
 expect(await screen.findByText('Ingresso registrato.')).toBeInTheDocument();
 expect(control).toHaveBeenLastCalledWith(code,'check_in');expect(changed).toHaveBeenCalledTimes(1);
 fireEvent.click(screen.getByRole('button',{name:'Verifica'}));
 expect(await screen.findByText(/Non ammettere di nuovo/)).toBeInTheDocument();
 expect(screen.queryByRole('button',{name:'Registra ingresso'})).not.toBeInTheDocument();
});
it.each(['cancelled','not_found'] as const)('does not offer admission for %s',async result=>{
 control.mockResolvedValueOnce({result});render(<TeamDayEntryControl onChanged={jest.fn()}/>);
 fireEvent.change(screen.getByRole('textbox'),{target:{value:code}});
 fireEvent.click(screen.getByRole('button',{name:'Verifica'}));
 await screen.findByText(result==='cancelled'?'Biglietto annullato. Ingresso non consentito.':'Biglietto non trovato per questo evento.');
 expect(screen.queryByRole('button',{name:'Registra ingresso'})).not.toBeInTheDocument();
});

it('shows payment and entry state from the scan',async()=>{
 control.mockResolvedValueOnce({result:'valid',firstName:'Anna',lastName:'Test',paymentStatus:'paid',paymentMethod:'cash',amountCents:1500,registrationId,ticket:{code,checked_in_at:null}});
 render(<TeamDayEntryControl onChanged={jest.fn()}/>);
 fireEvent.change(screen.getByRole('textbox'),{target:{value:code}});
 fireEvent.click(screen.getByRole('button',{name:'Verifica'}));
 expect(await screen.findByText('Anna Test')).toBeInTheDocument();
 expect(screen.getAllByText('Pagato').length).toBeGreaterThan(0);
 expect(screen.getByText('Non ancora entrato')).toBeInTheDocument();
 expect(screen.getByText(/15,00/)).toBeInTheDocument();
 expect(screen.queryByRole('button',{name:'Segna come pagato'})).not.toBeInTheDocument();
});

it('allows staff to mark the scanned booking as paid before admitting',async()=>{
 control.mockResolvedValueOnce({result:'valid',firstName:'Anna',lastName:'Test',paymentStatus:'pending',paymentMethod:'cash',amountCents:1500,registrationId,ticket:{code,checked_in_at:null}});
 markPaid.mockResolvedValueOnce(undefined);
 render(<TeamDayEntryControl onChanged={jest.fn()}/>);
 fireEvent.change(screen.getByRole('textbox'),{target:{value:code}});
 fireEvent.click(screen.getByRole('button',{name:'Verifica'}));
 expect(await screen.findByText('Da pagare')).toBeInTheDocument();
 expect(screen.getByText(/incassa la quota prima di ammettere/)).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Segna come pagato'}));
 expect(markPaid).toHaveBeenCalledWith(registrationId,'paid');
 expect(await screen.findByText('Quota segnata come pagata.')).toBeInTheDocument();
 expect(screen.getAllByText('Pagato').length).toBeGreaterThan(0);
});

it('does not offer admission for an archived person',async()=>{
 control.mockResolvedValueOnce({result:'archived',firstName:'Anna',lastName:'Test',archivedAt:'2026-10-26T12:00:00Z'});
 render(<TeamDayEntryControl onChanged={jest.fn()}/>);
 fireEvent.change(screen.getByRole('textbox'),{target:{value:code}});
 fireEvent.click(screen.getByRole('button',{name:'Verifica'}));
 await screen.findByText(/Persona archiviata/);
 expect(screen.queryByRole('button',{name:'Registra ingresso'})).not.toBeInTheDocument();
});
