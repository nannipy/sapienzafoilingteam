/** Run: bun --conditions=react-server scripts/test-team-day-pdf.ts. No database or email provider. */
import { mkdtemp,writeFile,rm,mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import { QRCodeReader, BinaryBitmap, HybridBinarizer, RGBLuminanceSource } from '@zxing/library';
import { createTeamDayTicketPdf } from '../app/lib/team-day-pdf';
import { ticketQrValue, type TeamDayTicket } from '../app/lib/team-day-ticket-types';
const root=await mkdtemp(join(tmpdir(),'sft-pdf-test-'));
const code='b58fb537-c994-43c7-98ed-2fa9a3351374';
const ticket:TeamDayTicket={id:code,code,participant_id:code,event_id:'sft-day-2026',status:'valid',checked_in_at:null,firstName:'Giulia',lastName:'D’Angelo',email:null,emailStatus:'no_email',emailSentAt:null};
try {
 const pdf=await createTeamDayTicketPdf(ticket,{example:true});
 const doc=await PDFDocument.load(pdf);assert.equal(doc.getPageCount(),1);
 const output=join(process.cwd(),'docs/admin/examples');await mkdir(output,{recursive:true});
 const file=join(output,'sft-day-ticket-example.pdf');await writeFile(file,pdf);
 const text=execFileSync('pdftotext',[file,'-'],{encoding:'utf8'});
 const fonts=execFileSync('pdffonts',[file],{encoding:'utf8'});
 assert(/Kelson-ExtraBold.*CID Type 0C \(OT\).*yes/.test(fonts));
 assert(/Geist-Regular.*yes/.test(fonts));assert(/GeistMono-Regular.*yes/.test(fonts));
 assert(text.includes('Giulia D’Angelo'));assert(text.includes('NON VALIDO'));assert(text.includes(code));
 execFileSync('pdftoppm',['-r','144','-singlefile','-png',file,join(root,'page')]);
 const {data,info}=await sharp(join(root,'page.png')).extract({left:496,top:570,width:296,height:296}).greyscale().raw().toBuffer({resolveWithObject:true});
 const decoded=new QRCodeReader().decode(new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(new Uint8ClampedArray(data),info.width,info.height))));
 assert.equal(decoded.getText(),ticketQrValue(code));
 const longName={...ticket,firstName:'W'.repeat(80),lastName:'W'.repeat(80),status:'cancelled' as const};
 const longPdf=await createTeamDayTicketPdf(longName);await writeFile(join(root,'long.pdf'),longPdf);
 const longText=execFileSync('pdftotext',[join(root,'long.pdf'),'-'],{encoding:'utf8'});
 assert(longText.replace(/\s/g,'').includes('W'.repeat(160)));assert(longText.includes('ANNULLATO'));
 execFileSync('pdftoppm',['-r','144','-singlefile','-png',join(root,'long.pdf'),join(root,'long')]);
 const longImage=await sharp(join(root,'long.png')).extract({left:496,top:570,width:296,height:296}).greyscale().raw().toBuffer({resolveWithObject:true});
 const longQr=new QRCodeReader().decode(new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(new Uint8ClampedArray(longImage.data),longImage.info.width,longImage.info.height))));
 assert.equal(longQr.getText(),ticketQrValue(code));
 console.log('PASS: one-page personal PDF, accented names, maximum name length, cancelled state and QR decoded from actual rendered PDF. Example saved to '+file);
} finally {await rm(root,{recursive:true,force:true});}
