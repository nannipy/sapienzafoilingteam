'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button, Card } from '@sft/design-system';
import { useLanguage } from '../context/LanguageContext';
import { usePostHog } from 'posthog-js/react';
import { sponsors } from './sponsors';

export default function SponsorClientPage() {
  const { language } = useLanguage();
  const it = language === 'it';
  const posthog = usePostHog();
  const track = (name: string) => posthog?.capture('sponsor_clicked', {sponsor_name:name});
  const partners = [
    {name:'Centro Velico 3V',src:'/sponsors/3v.svg',href:'https://www.centrovelico3v.it',group:it?'Base nautica':'Sailing base'},
    {name:'DIMA — Sapienza',src:'/collaborations/dima.png',href:'https://www.dima.uniroma1.it/dima/',group:it?'Collaborazione':'Collaboration'},
    {name:'INM — CNR',src:'/collaborations/inm.png',href:'https://www.inm.cnr.it/',group:it?'Collaborazione':'Collaboration'},
  ];
  return <main className="sft-root sft-content-page">
    <div className="sft-page-container">
      <header className="sft-page-intro">
        <h1 className="sft-display">{it?'Sponsor e partner':'Sponsors & partners'}</h1>
        <p>{it?'Le realtà che sostengono il lavoro del team: dalla progettazione e costruzione della barca ai test e alle regate.':'The organisations supporting the team’s work, from boat design and construction to testing and racing.'}</p>
      </header>
      <section aria-labelledby="sponsors-heading" className="sft-partners-section">
        <h2 id="sponsors-heading" className="sft-eyebrow">{it?'I nostri sponsor':'Our sponsors'}</h2>
        <div className="sft-site-partner-grid">
          {sponsors.map(sponsor => <Card key={sponsor.name} className="sft-sponsor-card"><a href={sponsor.link} target="_blank" rel="noopener noreferrer" onClick={()=>track(sponsor.name)}>
            <div className="sft-sponsor-logo"><Image className={sponsor.logo === 'fluidodesign.svg' ? 'sft-fluidodesign-logo' : undefined} src={`/sponsors/${sponsor.logo}`} alt="" width={sponsor.width} height={sponsor.height||40} sizes="240px" /></div>
            <span>{sponsor.name}<ArrowUpRight aria-hidden="true" size={16}/></span>
          </a></Card>)}
        </div>
      </section>
    </div>
    <section className="sft-partner-network" aria-labelledby="network-heading">
      <div className="sft-page-container">
        <h2 id="network-heading" className="sft-display">{it?'Base nautica e collaborazioni':'Sailing base & collaborations'}</h2>
        <div className="sft-network-grid">{partners.map(partner=><Card className="sft-sponsor-card" key={partner.name}><a href={partner.href} target="_blank" rel="noopener noreferrer" onClick={()=>track(partner.name)}>
          <p className="sft-eyebrow">{partner.group}</p>
          <div className="sft-sponsor-logo"><Image src={partner.src} alt="" width={240} height={80} /></div>
          <span>{partner.name}<ArrowUpRight aria-hidden="true" size={16}/></span>
        </a></Card>)}</div>
      </div>
    </section>
    <section className="sft-page-container sft-partner-invitation" aria-labelledby="partner-invitation">
      <div><h2 id="partner-invitation" className="sft-display">{it?'Lavora con il team':'Work with the team'}</h2><p>{it?'Materiali, attrezzature, software e competenze tecniche: raccontaci come vorresti contribuire al progetto.':'Materials, equipment, software and technical expertise: tell us how you would like to contribute to the project.'}</p></div>
      <Button asChild variant="brand" size="lg"><Link href="/contact" onClick={()=>posthog?.capture('sponsor_contact_clicked')}>{it?'Parliamone':'Let’s talk'}<ArrowUpRight /></Link></Button>
    </section>
  </main>;
}
