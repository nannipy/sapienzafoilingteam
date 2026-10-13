'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Card, Button, Input } from '@sft/design-system';
import { useLanguage } from '../context/LanguageContext';
import { blogTranslations } from '../translations/blog';
import type { Article } from '../lib/types';

function BlogCover({src,alt,featured}:{src:string|null;alt:string;featured:boolean}) {
  const [failed,setFailed]=useState(false);
  const fallback=!src||failed;
  return <Image src={fallback?'/images/team-01-crew-official.jpg':src} alt={fallback?'Sapienza Foiling Team':alt} fill sizes={featured?'(max-width: 900px) 100vw, 60vw':'(max-width: 767px) 100vw, 33vw'} priority={featured} onError={()=>setFailed(true)} />;
}

export default function BlogClientPage({articles}:{articles:Article[]}) {
  const {language}=useLanguage();
  const it=language==='it';
  const t=blogTranslations[language];
  return <main className="sft-root sft-content-page"><div className="sft-page-container">
    <header className="sft-page-intro">
      <h1 className="sft-display">Blog</h1><p>{it?'Dal cantiere alle regate: aggiornamenti sul progetto, prove sull’acqua e vita del team.':'From the workshop to racing: project updates, testing on the water and team life.'}</p>

    </header>
    {articles.length===0?<section className="sft-blog-empty"><h2 className="sft-display">{t.noArticles}</h2><p>{t.noArticlesDescription}</p><a href="https://instagram.com/sapienzafoilingteam" target="_blank" rel="noopener noreferrer">Instagram<ArrowUpRight /></a></section>:<div className="sft-blog-grid">{articles.map((article,index)=>{
      const title=language==='en'?(article.title_en||article.title):article.title;
      return <Card key={article.id} className={`sft-blog-card ${index===0?'sft-blog-featured':''}`}><article><Link href={`/blog/${article.id}`}>
        <div className="sft-blog-image"><BlogCover src={article.image_url} alt={article.image_alt||title} featured={index===0}/></div>
        <div className="sft-blog-copy"><time dateTime={article.created_at}>{new Date(article.created_at).toLocaleDateString(it?'it-IT':'en-US',{year:'numeric',month:'long',day:'numeric'})}</time><h2>{title}</h2><span>{t.readMore}<ArrowUpRight aria-hidden="true" size={18}/></span></div>
      </Link></article></Card>;
    })}</div>}
      <section className="sft-blog-newsletter" aria-labelledby="newsletter-heading">
        <h2 id="newsletter-heading" className="sft-display">{it?'Iscriviti alla newsletter per rimanere aggiornato':'Subscribe to the newsletter to stay updated'}</h2>
        <form onSubmit={event=>event.preventDefault()}>
          <label htmlFor="newsletter-email">{it?'La tua email':'Your email'}</label>
          <div><Input id="newsletter-email" type="email" placeholder="nome@email.it" autoComplete="email" aria-describedby="newsletter-status"/><Button type="submit" variant="secondary" disabled>{it?'Iscriviti':'Subscribe'}</Button></div>
          <p id="newsletter-status">{it?'Iscrizioni in arrivo. Questo modulo è un’anteprima.':'Sign-ups coming soon. This form is a preview.'}</p>
        </form>
      </section>
  </div></main>;
}
