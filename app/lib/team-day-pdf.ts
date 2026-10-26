import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, PDFDict, PDFArray, PDFRawStream, PDFName, rgb, type PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import sharp from 'sharp';
import QRCode from 'qrcode';
import tokens from '@sft/design-system/assets/tokens.json';
import { ticketQrValue, type TeamDayTicket } from './team-day-ticket-types';

const color = (hex: string) => rgb(...[1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255) as [number,number,number]);
const palette = {
  paper:color(tokens.brand['sft-paper']), ink:color(tokens.brand['sft-ink']),
  brand:color(tokens.brand['sft-burgundy']), gold:color(tokens.brand['sft-gold']),
  muted:color(tokens.light['muted-foreground']), border:color(tokens.light.border),
  white:rgb(1,1,1), soft:color(tokens.light.secondary),
};
const packageAssets = path.join(process.cwd(),'node_modules/@sft/design-system/public/brand');
let assets: Promise<{ body:Buffer; display:Buffer; mono:Buffer; logo:Buffer; flow:Buffer }> | undefined;
function loadAssets() {
  return assets ??= Promise.all([
    readFile(path.join(process.cwd(),'app/fonts/GeistVF.woff')),
    readFile(path.join(packageAssets,'fonts/Armasen - Kelson-ExtraBold.otf')),
    readFile(path.join(process.cwd(),'app/fonts/GeistMonoVF.woff')),
    sharp(path.join(process.cwd(),'public/brand/logos/sft-white.svg')).resize({height:128}).png().toBuffer(),
    sharp(path.join(process.cwd(),'public/brand/patterns/team-flow.svg')).resize(840,430,{fit:'cover'}).png().toBuffer(),
  ]).then(([body,display,mono,logo,flow])=>({body,display,mono,logo,flow}));
}
function lines(text: string, font: PDFFont, size: number, width: number) {
  const result:string[]=[];let line='';
  for(const character of text){
    if(line && font.widthOfTextAtSize(line+character,size)>width){
      const space=line.lastIndexOf(' ');
      if(space>0){result.push(line.slice(0,space));line=line.slice(space+1);}
      else{result.push(line);line='';}
    }
    line+=character;
  }
  if(line)result.push(line);
  return result;
}
/** One A5 ticket using the canonical SFT tokens, logo, flow artwork and type families. */
export async function createTeamDayTicketPdf(ticket: TeamDayTicket, options: { example?: boolean } = {}): Promise<Buffer> {
  const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
  const source=await loadAssets();
  const [body,display,mono,logo,flow]=await Promise.all([
    doc.embedFont(source.body,{subset:true}),doc.embedFont(source.display,{subset:false}),doc.embedFont(source.mono,{subset:true}),
    doc.embedPng(source.logo),doc.embedPng(source.flow),
  ]);
  doc.setTitle('Biglietto SFT Day');doc.setAuthor('Sapienza Foiling Team');
  const page=doc.addPage([420,595]);
  const text=(value:string,x:number,y:number,size:number,font=body,fill=palette.ink)=>page.drawText(value,{x,y,size,font,color:fill});
  page.drawRectangle({x:0,y:0,width:420,height:595,color:palette.paper});
  page.drawImage(flow,{x:0,y:380,width:420,height:215});
  page.drawImage(logo,{x:24,y:534,width:32*logo.width/logo.height,height:32});
  text('SAPIENZA',58,553,14,display,palette.white);
  text('FOILING TEAM',58,537,9,body,palette.white);
  text('ROMA / 2026',312,549,9,mono,palette.gold);
  text('SFT DAY',24,439,60,display,palette.white);
  text('08.11.2026',24,405,16,mono,palette.gold);
  text('DALLE 11:00',306,408,10,body,palette.white);

  text('AEROPORTO DELL’URBE',24,357,16,display);
  text('Via Salaria 825, Roma',24,339,11,body,palette.muted);
  page.drawLine({start:{x:24,y:325},end:{x:396,y:325},thickness:.6,color:palette.border});
  text('PARTECIPANTE',24,306,9,mono,palette.muted);
  const fullName=`${ticket.firstName} ${ticket.lastName}`;
  let nameSize=22;
  // The name has its own column; even 160 wide letters never enter the QR quiet zone.
  while((lines(fullName,body,nameSize,196).length-1)*(nameSize+3)>60) nameSize-=.5;
  lines(fullName,body,nameSize,196).forEach((line,i)=>text(line,24,281-i*(nameSize+3),nameSize));

  const qr=QRCode.create(ticketQrValue(ticket.code),{errorCorrectionLevel:'M'});
  const moduleSize=4,quiet=4,qrSize=(qr.modules.size+quiet*2)*moduleSize;
  const qrX=396-qrSize,qrY=162;
  // The QR has a pure white background and a four-module quiet zone, with no decoration.
  page.drawRectangle({x:qrX,y:qrY,width:qrSize,height:qrSize,color:palette.white});
  for(let row=0;row<qr.modules.size;row++)for(let col=0;col<qr.modules.size;col++){
    if(qr.modules.get(row,col))page.drawRectangle({x:qrX+(col+quiet)*moduleSize,
      y:qrY+(qr.modules.size-1-row+quiet)*moduleSize,width:moduleSize,height:moduleSize,color:rgb(0,0,0)});
  }
  const state=options.example?'ESEMPIO · NON VALIDO':{valid:'VALIDO',used:'INGRESSO REGISTRATO',cancelled:'ANNULLATO'}[ticket.status];
  const stateWidth=body.widthOfTextAtSize(state,9)+24;
  page.drawRectangle({x:24,y:180,width:stateWidth,height:24,color:palette.soft});
  text(state,36,188,9,body,palette.brand);
  text('Un biglietto, un ingresso.',24,164,9,body,palette.muted);

  page.drawLine({start:{x:24,y:146},end:{x:396,y:146},thickness:.6,dashArray:[3,3],color:palette.border});
  text('CODICE PERSONALE',24,130,8,mono,palette.muted);
  text(ticket.code,24,111,10,mono);
  text('Mostra questo QR all’arrivo.',24,78,13,display);
  text('Dal telefono o stampato. Conserva il biglietto e non condividere il codice.',24,59,9,body,palette.muted);
  text('Il biglietto non attesta il pagamento.',24,43,9,body,palette.muted);
  text('SAPIENZAFOILINGTEAM.COM',24,20,8,mono,palette.brand);
  text('SFT DAY / BIGLIETTO PERSONALE',252,20,7,mono,palette.muted);
  // pdf-lib labels a full OpenType/CFF file as a bare CFF stream by default.
  // Keep the original Kelson OTF and declare its actual format for PDF reader compatibility.
  await doc.flush();
  const displayDict=doc.context.lookup(display.ref,PDFDict);
  const cidFont=displayDict.lookup(PDFName.of('DescendantFonts'),PDFArray).lookup(0,PDFDict);
  const descriptor=cidFont.lookup(PDFName.of('FontDescriptor'),PDFDict);
  const originalFontKey=descriptor.has(PDFName.of('FontFile3'))?'FontFile3':'FontFile2';
  const fontReference=descriptor.get(PDFName.of(originalFontKey))!;
  const fontStream=doc.context.lookup(fontReference);
  if(!(fontStream instanceof PDFRawStream))throw new Error('Invalid display font stream');
  descriptor.delete(PDFName.of('FontFile2'));
  descriptor.set(PDFName.of('FontFile3'),fontReference);
  cidFont.set(PDFName.of('Subtype'),PDFName.of('CIDFontType0'));
  fontStream.dict.set(PDFName.of('Subtype'),PDFName.of('OpenType'));
  return Buffer.from(await doc.save());
}
