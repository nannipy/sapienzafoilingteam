'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Gauge, Sparkles, Wind, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FleetShowcaseSection: React.FC = () => {
  const { language } = useLanguage();

  const isItalian = language === 'it';

  const specs = [
    {
      icon: Gauge,
      value: '30+ KTS',
      label: isItalian ? 'Velocità Massima' : 'Top Speed',
      detail: isItalian ? 'Raggiunta sul Lago di Garda' : 'Recorded at Lake Garda',
    },
    {
      icon: Wind,
      value: '8.0 KTS',
      label: isItalian ? 'Velocità di Decollo' : 'Takeoff Velocity',
      detail: isItalian ? 'Foiling immediato con brezza leggera' : 'Immediate foiling in light breeze',
    },
    {
      icon: Sparkles,
      value: '100%',
      label: isItalian ? 'Bio-Resina & Lino' : 'Bio-Resin & Flax',
      detail: isItalian ? 'Compositi sostenibili ad alte prestazioni' : 'High-performance sustainable composites',
    },
    {
      icon: ShieldCheck,
      value: '30 KG',
      label: isItalian ? 'Peso Scafo & Rig' : 'Hull & Rig Weight',
      detail: isItalian ? 'Design ultraleggero da regata' : 'Ultralight racing design',
    },
  ];

  return (
    <section className="relative py-24 bg-void text-white overflow-hidden border-t border-white/5">
      {/* Background Ambient Burgundy Glows - Zero-cost radial gradient */}
      <div
        className="absolute top-1/4 -left-40 w-[500px] h-[500px] pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(130, 36, 51, 0.3) 0%, rgba(130, 36, 51, 0.05) 50%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-10 -right-40 w-[500px] h-[500px] pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(130, 36, 51, 0.25) 0%, rgba(130, 36, 51, 0.05) 50%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-black font-syne tracking-tighter uppercase leading-none">
              {isItalian ? (
                <>In Volo Verso Il <span className="text-brand-light">Futuro</span></>
              ) : (
                <>Engineered To <span className="text-brand-light">Fly Fast</span></>
              )}
            </h2>
          </div>
          <p className="max-w-md text-white/70 text-sm md:text-base font-light leading-relaxed">
            {isItalian
              ? 'Il nostro Moth foiling da competizione combina aerodinamica avanzata, controllo autonomo del pitch e materiali sostenibili.'
              : 'Our competition foiling Moth fuses advanced aerodynamics, dynamic pitch control, and next-gen bio-composites.'}
          </p>
        </div>

        {/* Bento Grid with Clean Garda Photography */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          {/* Main Feature Card */}
          <div className="md:col-span-8 group relative rounded-3xl overflow-hidden border border-white/10 bg-carbon h-[420px] md:h-[500px] transition-all duration-500 hover:border-brand/40 hover:shadow-2xl">
            <Image
              src="/images/IMG_3090.jpg"
              alt="Sapienza Foiling Moth in flight"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-black font-syne text-white tracking-tight">
                  {isItalian ? 'Dinamica dei Foil & Assetto' : 'Hydrofoil Dynamics in Action'}
                </h3>
                <p className="text-white/75 text-sm font-light mt-1 max-w-lg">
                  {isItalian
                    ? 'Stabilità dinamica e controllo millimetrico tramite la bacchetta di regolazione meccanica.'
                    : 'Dynamic stability and active pitch trim powered by our precision wand sensor mechanism.'}
                </p>
              </div>
              <Link
                href="/boat"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all group-hover:bg-brand group-hover:border-transparent flex-shrink-0"
              >
                <span>{isItalian ? 'Dettagli Tecnici' : 'Explore Tech'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Secondary Feature Card */}
          <div className="md:col-span-4 group relative rounded-3xl overflow-hidden border border-white/10 bg-carbon h-[420px] md:h-[500px] transition-all duration-500 hover:border-brand/40 hover:shadow-2xl">
            <Image
              src="/images/IMG_0631.jpeg"
              alt="Sapienza Moth sailing on Garda"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-xl md:text-2xl font-black font-syne text-white tracking-tight">
                {isItalian ? 'Sessioni di Test & Velocità' : 'High-Velocity Regatta Tests'}
              </h3>
              <p className="text-white/70 text-sm font-light mt-1">
                {isItalian
                  ? 'Verifica aerodinamica e ottimizzazione delle vele in condizioni reali di regata.'
                  : 'Aerodynamic verification and sail optimization under genuine regatta winds.'}
              </p>
            </div>
          </div>

          {/* Bottom Card 1 */}
          <div className="md:col-span-6 group relative rounded-3xl overflow-hidden border border-white/10 bg-carbon h-[280px] transition-all duration-500 hover:border-brand/40 hover:shadow-2xl">
            <Image
              src="/images/team-03-crew-rigging.jpg"
              alt="Sailing action"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h4 className="text-lg font-bold font-syne text-white">
                {isItalian ? 'Efficienza Energetica' : 'Low Drag Aero Efficiency'}
              </h4>
              <p className="text-white/70 text-xs font-light mt-0.5">
                {isItalian
                  ? 'Scafo e Foil progettati tramite simulazioni CFD avanzate.'
                  : 'Hull and Foils designed using advanced CFD simulations.'}
              </p>
            </div>
          </div>

          {/* Bottom Card 2 */}
          <div className="md:col-span-6 group relative rounded-3xl overflow-hidden border border-white/10 bg-carbon h-[280px] transition-all duration-500 hover:border-brand/40 hover:shadow-2xl">
            <Image
              src="/images/boat-03-water-launch.jpg"
              alt="Race preparation"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h4 className="text-lg font-bold font-syne text-white">
                {isItalian ? 'Costruzione Sostenibile' : 'Sustainable Engineering'}
              </h4>
              <p className="text-white/70 text-xs font-light mt-0.5">
                {isItalian
                  ? 'Utilizzo pionieristico di fibre naturali e bio-resine per abbattere l’impronta ecologica.'
                  : 'Pioneering natural flax fibers and bio-resins to minimize carbon lifecycle footprint.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FleetShowcaseSection;
