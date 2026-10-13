'use client';
import Link from 'next/link';
import { ArrowUpRight, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Button, Card, CardContent } from '@sft/design-system';
import { useLanguage } from '../context/LanguageContext';
import { contactTranslations } from '../translations/contact';

const socials = [
  {name:'Instagram',Icon:Instagram,href:'https://www.instagram.com/sapienzafoilingteam/'},
  {name:'LinkedIn',Icon:Linkedin,href:'https://www.linkedin.com/company/sapienza-foiling-team/about/'},
  {name:'Facebook',Icon:Facebook,href:'https://www.facebook.com/profile.php?id=61572515878295'},
];
export default function ContactClientPage() {
  const {language}=useLanguage();
  const it=language==='it';
  const t=contactTranslations[language];
  return <main className="sft-root sft-content-page">
    <div className="sft-page-container">
      <header className="sft-page-intro"><h1 className="sft-display">{it?'Contatti':'Contact'}</h1><p>{it?'Per collaborazioni, informazioni sul progetto o per conoscere il team, scrivici.':'For collaborations, project information or to get to know the team, write to us.'}</p></header>
      <div className="sft-contact-top">
        <section className="sft-contact-email" aria-labelledby="contact-email">
          <h2 id="contact-email" className="sft-eyebrow">{it?'Scrivi al team':'Write to the team'}</h2>
          <a href="mailto:sapienzafoilingteam@gmail.com" className="sft-contact-address">sapienzafoilingteam@gmail.com<ArrowUpRight aria-hidden="true"/></a>
          <div className="sft-contact-socials">{socials.map(({name,Icon,href})=><Button asChild variant="secondary" key={name}><a href={href} target="_blank" rel="noopener noreferrer"><Icon />{name}</a></Button>)}</div>
          <a className="sft-contact-linktree" href="https://linktr.ee/sapienzafoilingteam" target="_blank" rel="noopener noreferrer">{it?'Tutti i nostri link':'All our links'}<ArrowUpRight size={16} aria-hidden="true"/></a>
        </section>
        <Card className="sft-contact-career"><CardContent><p className="sft-eyebrow">{it?'Entra nel progetto':'Join the project'}</p><h2 className="sft-display">{t.joinUs}</h2><p>{t.joinUsText}</p><Button asChild variant="brand"><Link href="/career">{t.goToCareerPage}<ArrowUpRight /></Link></Button></CardContent></Card>
      </div>
      <section className="sft-contact-location" aria-labelledby="contact-location">
        <div><p className="sft-eyebrow">{t.location}</p><h2 id="contact-location" className="sft-display">{it?'Ci trovi a Roma':'Find us in Rome'}</h2><address>Via Eudossiana 18<br/>00184 Roma</address><Button asChild variant="outline"><a href="https://www.google.com/maps/search/?api=1&query=Via+Eudossiana+18+00184+Roma" target="_blank" rel="noopener noreferrer">{it?'Apri la mappa':'Open the map'}<ArrowUpRight /></a></Button></div>
        <div className="sft-contact-map"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.9876229173233!2d12.490363776654638!3d41.89312327124013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f61b0d854d591%3A0x479e9d6899d47703!2sVia%20Eudossiana%2C%2018%2C%2000184%20Roma%20RM!5e0!3m2!1sit!2sit!4v1760276733613!5m2!1sit!2sit" title={it?'Mappa della sede in Via Eudossiana 18, Roma':'Map of our location at Via Eudossiana 18, Rome'} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
      </section>
    </div>
  </main>;
}
