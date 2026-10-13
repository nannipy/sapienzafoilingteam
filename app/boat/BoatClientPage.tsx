'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button, Card, CardContent } from '@sft/design-system';
import { useLanguage } from '../context/LanguageContext';
import { boatTranslations } from '../translations/boat';
import { usePostHog } from 'posthog-js/react';

type ComponentKey = 'hull' | 'foils' | 'wand' | 'wings' | 'rig' | 'pcb';
const hotspots: {key:ComponentKey;top:string;left:string}[] = [
  {key:'hull',top:'73%',left:'65%'}, {key:'foils',top:'88%',left:'59%'},
  {key:'wand',top:'70%',left:'76%'}, {key:'wings',top:'63%',left:'32%'},
  {key:'rig',top:'28%',left:'56%'}, {key:'pcb',top:'74%',left:'40%'},
];
export default function BoatClientPage() {
  const {language}=useLanguage();
  const it=language==='it';
  const t=boatTranslations[language];
  const [activeKey,setActiveKey]=useState<ComponentKey>('hull');
  const cardRef=useRef<HTMLDivElement>(null);
  const posthog=usePostHog();
  const current=t.components[activeKey];
  const select=(key:ComponentKey,hotspot=false)=>{
    setActiveKey(key);
    posthog?.capture('boat_specification_viewed',{section:key});
    if(hotspot&&window.innerWidth<900) cardRef.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  };
  return <main className="sft-root sft-content-page">
    <div className="sft-page-container">
      <header className="sft-page-intro"><h1 className="sft-display">Meravijosa</h1><p>{t.description}</p></header>
      <div className="sft-boat-workspace">
        <section className="sft-boat-model" aria-label={it?'Modello interattivo di Meravijosa':'Interactive Meravijosa model'}>
          <p className="sft-eyebrow">{it?'Il nostro Moth':'Our Moth'}</p>
          <div className="sft-boat-render"><Image src="/images/meravijosa.png" alt="Meravijosa" fill sizes="(max-width: 900px) 100vw, 50vw" priority />
            {hotspots.map(({key,top,left})=><button className="sft-boat-pin" key={key} style={{top,left}} aria-label={t.components[key].tab} aria-pressed={activeKey===key} aria-controls="boat-component-detail" onClick={()=>select(key,true)}>{t.components[key].id}</button>)}
          </div>
          <p className="sft-boat-hint">{t.exploreCta}</p>
        </section>
        <div>
          <nav className="sft-boat-components" aria-label={it?'Componenti della barca':'Boat components'}>{hotspots.map(({key})=><Button key={key} variant={activeKey===key?'brand':'secondary'} aria-pressed={activeKey===key} aria-controls="boat-component-detail" onClick={()=>select(key)}>{t.components[key].tab}</Button>)}</nav>
          <Card className="sft-boat-detail" ref={cardRef} id="boat-component-detail"><CardContent>
            <div className="sft-boat-category"><p className="sft-eyebrow">{it?'Componente':'Component'} {current.id}</p><span>{current.subsystem}</span></div>
            <h2 className="sft-display">{current.title}</h2><p className="sft-boat-description">{current.desc}</p>
            <div className="sft-boat-component-photo" data-component={activeKey}><Image key={activeKey} src={current.photo} alt={current.title} fill sizes="(max-width: 900px) 100vw, 50vw" className="sft-boat-part-photo" /></div>
            <dl className="sft-boat-specs"><div><dt>{it?'Materiale':'Material'}</dt><dd>{current.material}</dd></div><div><dt>{it?'Caratteristica':'Key feature'}</dt><dd>{current.feature}</dd></div></dl>
            <ul className="sft-boat-bullets">{current.bullets.map(bullet=><li key={bullet}>{bullet}</li>)}</ul>
          </CardContent></Card>
        </div>
      </div>
      <aside className="sft-boat-partners"><h2 className="sft-eyebrow">{t.partnersTitle}</h2><p>{t.partnersDesc}</p></aside>
      <section className="sft-boat-rulebook"><div><p className="sft-eyebrow">{t.rulebook.badge}</p><h2 className="sft-display">{t.rulebook.title}</h2><p>{t.rulebook.desc}</p></div><Button asChild variant="secondary"><a href="https://sumoth.org/challenge/" target="_blank" rel="noopener noreferrer">{t.rulebook.button}<ArrowUpRight /></a></Button></section>
      <section className="sft-boat-join"><div><h2 className="sft-display">{t.joinProject.title}</h2><p>{t.joinProject.description}</p></div><div><Button asChild variant="brand"><Link href="/career">{t.joinProject.joinButton}</Link></Button><Button asChild variant="outline"><Link href="/contact">{t.joinProject.contactButton}</Link></Button></div></section>
    </div>
  </main>;
}
