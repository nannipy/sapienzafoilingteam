'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { boatTranslations } from '../translations/boat';
import { usePostHog } from 'posthog-js/react';
import PageLayout from '../components/PageLayout';

type ComponentKey = 'hull' | 'foils' | 'wand' | 'wings' | 'rig' | 'pcb';

const BoatPage = () => {
  const { language } = useLanguage();
  const [activeKey, setActiveKey] = useState<ComponentKey>('hull');
  const cardRef = useRef<HTMLDivElement>(null);
  const posthog = usePostHog();
  const t = boatTranslations[language];

  const currentComponent = t.components[activeKey];

  const handleSelect = (key: ComponentKey, fromHotspot = false) => {
    setActiveKey(key);
    posthog.capture('boat_specification_viewed', { section: key });

    if (fromHotspot && typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const hotspots = [
    { key: 'hull' as ComponentKey, id: '01', top: '73%', left: '65%', label: t.components.hull.tab },
    { key: 'foils' as ComponentKey, id: '02', top: '88%', left: '59%', label: t.components.foils.tab },
    { key: 'wand' as ComponentKey, id: '03', top: '70%', left: '76%', label: t.components.wand.tab },
    { key: 'wings' as ComponentKey, id: '04', top: '63%', left: '32%', label: t.components.wings.tab },
    { key: 'rig' as ComponentKey, id: '05', top: '28%', left: '56%', label: t.components.rig.tab },
    { key: 'pcb' as ComponentKey, id: '06', top: '74%', left: '40%', label: t.components.pcb.tab },
  ];

  return (
    <PageLayout>
      <div className="px-6 md:px-12 py-8">

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-100">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-syne uppercase tracking-tight text-gray-900 leading-none">
              MERA<span className="text-brand">VIJOSA</span>
            </h1>
          </div>
          <div className="max-w-xl">
            <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
              {t.description}
            </p>
          </div>
        </div>

        {/* Blueprint Workspace */}
        <div className="pt-10 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT: 3D Render Viewport with Hotspots (Span 7) */}
            <div className="lg:col-span-7 bg-[#FAFBFD] rounded-3xl border border-gray-200 p-6 md:p-8 relative overflow-hidden shadow-sm">
              <div className="flex justify-between items-center text-[11px] font-mono text-gray-400 mb-2">
                <span>// CAD BLUEPRINT</span>
                <span className="text-brand font-bold">MERAVIJOSA 9352</span>
              </div>

              {/* 3D Model Image with Hotspots and CAD Blueprint Background */}
              <div className="relative w-full aspect-[3/4] max-h-[580px] mx-auto flex items-center justify-center rounded-2xl overflow-hidden">

                {/* Technical Blueprint CAD Architectural Background */}
                <div className="absolute inset-0 pointer-events-none select-none z-0">
                  {/* Fine Technical Grid */}
                  <div
                    className="absolute inset-0 opacity-45"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(130, 36, 51, 0.14) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(130, 36, 51, 0.14) 1px, transparent 1px),
                        linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
                      `,
                      backgroundSize: '80px 80px, 80px 80px, 16px 16px, 16px 16px'
                    }}
                  />

                  {/* SVG Technical Vector Drawing Overlay */}
                  <svg className="w-full h-full text-brand/25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" fill="none">
                    {/* Compass / CAD Radial Arc */}
                    <circle cx="250" cy="460" r="180" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" />
                    <circle cx="250" cy="460" r="120" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="250" cy="460" r="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />

                    {/* Centerline & Vertical Mast Datum Axis */}
                    <line x1="280" y1="20" x2="280" y2="620" stroke="currentColor" strokeWidth="0.75" strokeDasharray="6 3" />
                    <text x="284" y="32" fill="currentColor" fontSize="7" fontFamily="monospace">CL / MAST AXIS</text>

                    {/* Horizontal Design Waterline (DWL) */}
                    <line x1="30" y1="475" x2="470" y2="475" stroke="currentColor" strokeWidth="0.75" strokeDasharray="8 4" />
                    <text x="35" y="470" fill="currentColor" fontSize="7" fontFamily="monospace">DWL 0.00 [DESIGN WATERLINE]</text>

                    {/* Hull Length Dimension Line (LWL) */}
                    <line x1="120" y1="510" x2="430" y2="510" stroke="currentColor" strokeWidth="0.75" />
                    <line x1="120" y1="504" x2="120" y2="516" stroke="currentColor" strokeWidth="0.75" />
                    <line x1="430" y1="504" x2="430" y2="516" stroke="currentColor" strokeWidth="0.75" />
                    <text x="275" y="505" fill="currentColor" fontSize="8" fontFamily="monospace" textAnchor="middle">LWL 3.355 m</text>

                    {/* Mast Height Dimension */}
                    <line x1="215" y1="60" x2="215" y2="420" stroke="currentColor" strokeWidth="0.75" />
                    <line x1="208" y1="60" x2="222" y2="60" stroke="currentColor" strokeWidth="0.75" />
                    <line x1="208" y1="420" x2="222" y2="420" stroke="currentColor" strokeWidth="0.75" />
                    <text x="205" y="240" fill="currentColor" fontSize="7.5" fontFamily="monospace" textAnchor="end">H: 5.50 m</text>

                    {/* Technical Crosshairs at Key Coordinate Stations */}
                    <g stroke="currentColor" strokeWidth="0.75">
                      <path d="M30,40 L40,40 M35,35 L35,45" />
                      <path d="M460,40 L470,40 M465,35 L465,45" />
                      <path d="M30,610 L40,610 M35,605 L35,615" />
                      <path d="M460,610 L470,610 M465,605 L465,615" />
                    </g>

                    {/* Naval Architecture Drawing Title Block */}
                    <rect x="20" y="590" width="165" height="38" stroke="currentColor" strokeWidth="0.75" fill="rgba(255,255,255,0.7)" />
                    <text x="28" y="602" fill="currentColor" fontSize="6.5" fontFamily="monospace" fontWeight="bold">SAPIENZA FOILING TEAM</text>
                    <text x="28" y="612" fill="currentColor" fontSize="6" fontFamily="monospace">PROGETTO: MERAVIJOSA ITA 9352</text>
                    <text x="28" y="621" fill="currentColor" fontSize="5.5" fontFamily="monospace">NAVAL CAD // ORTHO ISOMETRIC</text>
                  </svg>
                </div>

                {/* Soft Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand/10 rounded-full blur-[70px] pointer-events-none" />

                <Image
                  src="/images/meravijosa.png"
                  alt="Meravijosa 3D Render"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.15)] relative z-10"
                  priority
                />

                {/* Hotspots */}
                {hotspots.map((hs) => {
                  const isSelected = activeKey === hs.key;
                  return (
                    <button
                      key={hs.key}
                      onClick={() => handleSelect(hs.key, true)}
                      style={{ top: hs.top, left: hs.left }}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 z-20 focus:outline-none"
                      aria-label={hs.label}
                    >
                      <div className="relative flex items-center justify-center">
                        {isSelected && (
                          <>
                            <span className="absolute -inset-2 rounded-full border border-brand/60 animate-pulse pointer-events-none" />
                            <span className="absolute -inset-3.5 rounded-full border border-dashed border-brand/35 pointer-events-none" />
                          </>
                        )}
                        <span
                          className={`w-8 h-8 rounded-full border-2 border-white text-xs font-mono font-bold flex items-center justify-center text-white shadow-md transition-all ${isSelected
                            ? 'bg-brand scale-110 ring-4 ring-brand/30 shadow-lg'
                            : 'bg-brand/95 hover:bg-brand hover:scale-105 shadow'
                            }`}
                        >
                          {hs.id}
                        </span>
                      </div>
                      <span className="hidden md:block absolute left-10 top-1/2 -translate-y-1/2 bg-gray-900 text-white font-mono text-[11px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md z-30">
                        {hs.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 text-center text-xs font-mono text-gray-400">
                {t.exploreCta}
              </div>
            </div>

            {/* RIGHT: Clean Simplified Detail Card & Component Filters (Span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-4">

              {/* Component Filters Bar - Single row, compact */}
              <div className="flex flex-nowrap items-center justify-between gap-1 sm:gap-1.5 w-full text-[10px] sm:text-[11px] font-mono">
                {hotspots.map((item) => {
                  const isActive = activeKey === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleSelect(item.key)}
                      className={`flex-1 text-center px-1.5 sm:px-2 py-1 rounded-full border transition-all whitespace-nowrap ${isActive
                        ? 'bg-brand text-white border-brand font-bold shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-brand hover:text-brand hover:bg-brand/5'
                        }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div
                ref={cardRef}
                className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm transition-all duration-300"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeKey}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-brand/10 text-brand">
                        COMPONENTE {currentComponent.id}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                        {currentComponent.subsystem}
                      </span>
                    </div>

                    {/* Component Title */}
                    <h3 className="text-2xl font-black font-syne uppercase text-gray-900 tracking-tight mb-2.5">
                      {currentComponent.title}
                    </h3>

                    {/* Short Clear Description */}
                    <p className="text-sm text-gray-600 font-light leading-relaxed mb-5">
                      {currentComponent.desc}
                    </p>

                    {/* Embedded Photo */}
                    <div className="relative rounded-2xl overflow-hidden border border-gray-100 mb-5 group aspect-video bg-gray-100">
                      <Image
                        src={currentComponent.photo}
                        alt={currentComponent.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Two Key Tags */}
                    <div className="grid grid-cols-2 gap-2.5 mb-5 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-gray-400 text-[10px] uppercase">
                          {language === 'it' ? 'MATERIALE' : 'MATERIAL'}
                        </div>
                        <div className="text-gray-900 font-bold mt-0.5">
                          {currentComponent.material}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-gray-400 text-[10px] uppercase">
                          {language === 'it' ? 'CARATTERISTICA' : 'KEY FEATURE'}
                        </div>
                        <div className="text-gray-900 font-bold mt-0.5">
                          {currentComponent.feature}
                        </div>
                      </div>
                    </div>

                    {/* Bullets */}
                    <div className="border-t border-gray-100 pt-3.5">
                      <ul className="space-y-1.5 text-xs text-gray-700 font-light">
                        {currentComponent.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-brand" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Partners Strip */}
              <div className="p-5 rounded-3xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
                <div className="font-bold text-gray-900 font-syne mb-1">
                  {t.partnersTitle}
                </div>
                <p className="font-light text-[11px] leading-relaxed">
                  {t.partnersDesc}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SuMoth Rulebook Link Card */}
      <div className="px-6 md:px-12 pt-8 pb-4">
        <div className="bg-gradient-to-r from-gray-900 via-[#181a20] to-gray-900 rounded-2xl border border-gray-800 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          {/* Technical blueprint grid accent */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #822433 1px, transparent 1px), linear-gradient(to bottom, #822433 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[#822433]/40 bg-[#822433]/10 text-brand text-[11px] font-mono uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              {t.rulebook.badge}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white font-syne mb-2">
              {t.rulebook.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              {t.rulebook.desc}
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <a
              href="https://sumoth.org/challenge/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-lg hover:shadow-brand/25 hover:scale-[1.02]"
            >
              <span>{t.rulebook.button}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-6 md:px-12 py-16">
        <div className="bg-brand-dark rounded-3xl p-10 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 font-syne">{t.joinProject.title}</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              {t.joinProject.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-brand px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:scale-105"
              >
                {t.joinProject.contactButton}
              </Link>
              <Link
                href="/career"
                className="bg-transparent text-white border border-white/30 px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all hover:scale-105"
              >
                {t.joinProject.joinButton}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BoatPage;