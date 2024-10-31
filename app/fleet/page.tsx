'use client';

import React, { useState } from 'react';
import { 
  Sailboat, 
  Construction, 
  Info, 
  Plus,
  Minus,
  ChevronRight,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';

const FleetPage = () => {
  const [activeSection, setActiveSection] = useState<SectionKey>('foils');
  type SectionKey = 'foils' | 'hull' | 'rig' | 'controls';
  
  const mothParts: Record<SectionKey, {
    title: string;
    description: string;
    details: string[];
    technicalSpecs: string[];
  }> = {
    foils: {
      title: "I Foil",
      description: "I foil sono ali sottomarine che generano portanza idrodinamica, permettendo all'imbarcazione di sollevarsi dall'acqua.",
      details: [
        "Foil principale: Genera la maggior parte della portanza",
        "T-Foil del timone: Controlla l'assetto longitudinale",
        "Flap: Regola la portanza durante la navigazione",
        "Supporti: Strutture in carbonio per il fissaggio"
      ],
      technicalSpecs: [
        "Materiale: Carbonio pre-preg",
        "Span foil principale: ~80 cm",
        "Profilo alare: Specifico per alte velocità",
        "Regolazioni: Rake e ride height"
      ]
    },
    hull: {
      title: "Lo Scafo",
      description: "Lo scafo del Moth è progettato per minimizzare il peso e massimizzare l'aerodinamica quando vola sui foil.",
      details: [
        "Struttura ultra-leggera in carbonio",
        "Design ottimizzato per il volo",
        "Sistema di svuotamento automatico",
        "Pozzetto ergonomico"
      ],
      technicalSpecs: [
        "Lunghezza: 3.355m",
        "Larghezza: 2.25m",
        "Peso minimo: 30kg",
        "Materiale: Carbonio pre-preg"
      ]
    },
    rig: {
      title: "La Vela",
      description: "La vela del Moth è altamente efficiente e completamente regolabile per ottimizzare le prestazioni.",
      details: [
        "Albero in carbonio ad alta modularità",
        "Vela ad alto aspect ratio",
        "Sistema di regolazione dinamica",
        "Boma in carbonio"
      ],
      technicalSpecs: [
        "Superficie velica: 8m²",
        "Altezza albero: ~5.5m",
        "Materiale albero: Carbonio pre-preg",
        "Controlli: Cunningham, vang, base"
      ]
    },
    controls: {
      title: "I controlli di volo",
      description: "I controlli di volo permettono al timoniere di gestire l'assetto e la potenza durante il volo.",
      details: [
        "Controlli ride height",
        "Sistema wand automatico",
        "Regolazione rake foil",
        "Comando flap del timone"
      ],
      technicalSpecs: [
        "Tipo wand: Meccanica/idraulica",
        "Rapporti di leva: Regolabili",
        "Sistema di emergenza: Quick release",
        "Feedback: Real-time ride height"
      ]
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="absolute inset-0 " />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <Sailboat className="w-16 h-16 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">La Nostra Flotta</h1>
          <p className="text-xl text-center">Il futuro della vela volante</p>
        </div>
      </div>

      {/* Work in Progress Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-blue-50 rounded-xl p-8 mb-16">
          <div className="flex items-center justify-center mb-6">
            <Construction className="w-12 h-12 text-blue-600 mr-4" />
            <h2 className="text-3xl font-bold">Flotta in Costruzione</h2>
          </div>
          <p className="text-lg text-center max-w-3xl mx-auto">
          Come team appena formato, stiamo lavorando alla costruzione della nostra
          prima imbarcazione. Nel frattempo, ti invitiamo a scoprire tutti i dettagli tecnici
          del Moth, una delle classi più innovative nel mondo della vela, alla quale anche
          la nostra barca apparterrà.
          </p>
        </div>

       {/* Why Moth Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl p-8 shadow-lg mb-16 flex flex-col lg:flex-row">
            <div className="flex-1 mb-6 lg:mb-0 lg:mr-6">
              <div className="flex items-center justify-center mb-6">
                <Info className="w-12 h-12 text-blue-600 mr-4" />
                <h2 className="text-3xl font-bold">Perché il SuMoth?</h2>
              </div>
              <p className="text-lg text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
              Abbiamo scelto di partecipare alla SuMoth Challenge perché condividiamo i
              valori che persegue: innovazione, tecnologia e sostenibilità. Il Moth è una delle
              imbarcazioni più innovative nel mondo della vela, capace di &quot;volare&quot; sopra
              l&apos;acqua grazie all&apos;uso dei foil. Il suo design avanzato e le sfide tecniche che
              comporta, che ci permettono di esplorare soluzioni ingegneristiche
              all&apos;avanguardia. Per noi, costruire un Moth significa spingerci oltre i limiti della
              tecnologia e della scienza applicata alla nautica. L’utilizzo di materiali eco-
              compatibili per la costruzione ci spinge ad esplorare e testare tecniche
              sostenibili che possono avere un impatto concreto sui metodi di costruzione in
              ambito nautico.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Image src="/moth_model.jpg" alt="Moth Model" className="w-full h-auto rounded-lg"  width={300} height={300}/>
            </div>
          </div>
        </div>


        {/* Moth Technical Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Componenti Principali</h3>
              <div className="space-y-2">
                {Object.entries(mothParts).map(([key, part]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key as keyof typeof mothParts)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      activeSection === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>{part.title}</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6">{mothParts[activeSection].title}</h2>
              
              {/* Main Description */}
              <p className="text-lg mb-8">{mothParts[activeSection].description}</p>

              {/* Technical Details */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Characteristics */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Caratteristiche
                  </h3>
                  <ul className="space-y-3">
                    {mothParts[activeSection].details.map((detail, index) => (
                      <li key={index} className="flex items-start">
                        <Plus className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-600" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Specifications */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Wrench className="w-5 h-5 mr-2" />
                    Specifiche Tecniche
                  </h3>
                  <ul className="space-y-3">
                    {mothParts[activeSection].technicalSpecs.map((spec, index) => (
                      <li key={index} className="flex items-start">
                        <Minus className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-600" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Vuoi far parte del progetto?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Se sei uno studente appassionato di vela e ingegneria e vuoi contribuire alla
          costruzione della nostra flotta, invia una candidatura spontanea.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contattaci
            </a>
            <a
              href="/join"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-blue-600"
            >
              Unisciti al Team
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FleetPage;