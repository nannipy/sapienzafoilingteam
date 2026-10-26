'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@sft/design-system';
import { useLanguage } from '../context/LanguageContext';

const media = [
  { image: '/images/hero-02.jpg', it: 'Meravijosa sul Garda', en: 'Meravijosa on Lake Garda' },
  { image: '/gallery/video/meravijosa-in-acqua.jpg', video: '/gallery/video/meravijosa-in-acqua.mp4', it: 'Meravijosa in acqua', en: 'On the water' },
  { image: '/images/hero-05.jpg', it: 'In volo sul lago', en: 'Foiling across the lake' },
  { image: '/images/sponsor-02-sail-partners-1.jpg', it: 'Sotto la vela', en: 'Under the sail' },
  { image: '/gallery/video/meravijosa-dal-cielo.jpg', video: '/gallery/video/meravijosa-dal-cielo.mp4', it: 'Meravijosa dall’alto', en: 'Meravijosa from above' },
  { image: '/images/boat-02-foil-wand-transport.jpg', it: 'Verso l’acqua', en: 'Heading for the water' },
  { image: '/images/sponsor-05-full-sail-partners.jpg', it: 'Vela, scafo e foil', en: 'Sail, hull and foils' },
  { image: '/images/team-06-passion-hull.jpg', it: 'Gli ultimi dettagli', en: 'The finishing touches' },
];

export default function BoatGallerySection() {
  const { language } = useLanguage();
  const it = language === 'it';
  const [selected, setSelected] = useState(0);
  const current = media[selected];
  const step = (direction: number) => setSelected(index => (index + direction + media.length) % media.length);

  return <section className="sft-boat-gallery" aria-labelledby="boat-gallery-title">
    <div className="sft-site-section">
      <div className="sft-site-section-heading">
        <div>
          <p className="sft-eyebrow">{it ? 'Dal cantiere al Garda' : 'From the workshop to Lake Garda'}</p>
          <h2 className="sft-display" id="boat-gallery-title">{it ? 'Meravijosa, da vicino.' : 'Meravijosa, up close.'}</h2>
        </div>
        <p>{it ? 'La barca, le persone e i primi voli. Una selezione di foto e video della nostra avventura sull’acqua.' : 'The boat, the people and the first flights. Selected photos and videos from our time on the water.'}</p>
      </div>
      <figure>
        <div className="sft-boat-gallery-stage">
          {current.video ? <video key={current.video} controls playsInline preload="none" poster={current.image} aria-label={current[language]}>
            <source src={current.video} type="video/mp4" />
            <a href={current.video}>{it ? 'Apri il video' : 'Open video'}</a>
          </video> : <Image key={current.image} src={current.image} alt={current[language]} fill sizes="(max-width: 767px) 100vw, 1256px" />}
        </div>
        <figcaption className="sft-boat-gallery-caption">
          <div aria-live="polite" aria-atomic="true"><span className="sft-eyebrow">{String(selected + 1).padStart(2, '0')} / {String(media.length).padStart(2, '0')} · {current.video ? 'VIDEO' : it ? 'FOTO' : 'PHOTO'}</span><p>{current[language]}</p></div>
          <div className="sft-boat-gallery-arrows">
            <Button variant="outline" size="icon" aria-label={it ? 'Contenuto precedente' : 'Previous item'} onClick={() => step(-1)}><ChevronLeft /></Button>
            <Button variant="outline" size="icon" aria-label={it ? 'Contenuto successivo' : 'Next item'} onClick={() => step(1)}><ChevronRight /></Button>
          </div>
        </figcaption>
      </figure>
      <div className="sft-boat-gallery-thumbnails" role="group" aria-label={it ? 'Scegli una foto o un video' : 'Choose a photo or video'}>
        {media.map((item, index) => <button key={item.image} type="button" aria-label={`${item.video ? 'Video' : it ? 'Foto' : 'Photo'}: ${item[language]}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
          <Image src={item.image} alt="" fill sizes="(max-width: 767px) 112px, 140px" />
          {item.video && <span className="sft-boat-gallery-play"><Play size={18} aria-hidden="true" /></span>}
        </button>)}
      </div>
    </div>
  </section>;
}
