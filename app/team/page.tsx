'use client';

import React, { useState } from 'react';
import { Users, Heart, Wrench, Gauge, Anchor, Construction } from 'lucide-react';

const TeamPage = () => {
  const [activeSection, setActiveSection] = useState('all');

  const divisions = [
    {
      id: 'mechatronics',
      name: 'Mechatronics',
      icon: <Wrench className="w-6 h-6" />,
      description: 'Sviluppo e manutenzione dei sistemi elettronici e meccanici dell\'imbarcazione.',
      details: [
        'Progettazione dei sistemi di controllo elettronici',
        'Sviluppo software per l\'automazione',
        'Manutenzione dei sistemi di bordo',
        'Integrazione dei sensori di navigazione'
      ],
      keyAreas: [
        'Controllo Elettronico',
        'Automazione',
        'Sistemi Embedded',
        'IoT Marino'
      ]
    },
    {
      id: 'performance',
      name: 'Performance',
      icon: <Gauge className="w-6 h-6" />,
      description: 'Analisi delle prestazioni e ottimizzazione delle strategie di regata.',
      details: [
        'Analisi dei dati di navigazione in tempo reale',
        'Sviluppo di modelli predittivi',
        'Ottimizzazione delle prestazioni',
        'Machine learning applicato alla navigazione'
      ],
      keyAreas: [
        'Data Analysis',
        'Predictive Modeling',
        'Race Strategy',
        'Performance Optimization'
      ]
    },
    {
      id: 'shore',
      name: 'Shore Team',
      icon: <Anchor className="w-6 h-6" />,
      description: 'Gestione logistica e supporto a terra durante gli eventi.',
      details: [
        'Coordinamento delle operazioni a terra',
        'Manutenzione preventiva',
        'Gestione delle emergenze',
        'Supporto logistico durante le regate'
      ],
      keyAreas: [
        'Logistica',
        'Manutenzione',
        'Gestione Emergenze',
        'Coordinamento Eventi'
      ]
    },
    {
      id: 'structures',
      name: 'Structures',
      icon: <Construction className="w-6 h-6" />,
      description: 'Progettazione e modellizzazione CAD delle strutture dell\'imbarcazione.',
      details: [
        'Progettazione e modellizzazione CAD delle strutture',
        'Analisi FEM per lo studio delle sollecitazioni',
        'Produzione e testing delle parti progettate',
        'Prototipazione delle componenti tramite stampa 3D'
      ],
      keyAreas: [
        'Simulazione FEM',
        'Analisi Strutturale',
        'Sviluppo Sostenibile',
        'Prototipazione 3D'
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: <Heart className="w-6 h-6" />,
      description: 'Gestione della comunicazione, social media e relazioni pubbliche del team.',
      details: [
        'Sviluppo strategie di comunicazione',
        'Gestione dei social media',
        'Organizzazione eventi',
        'Relazioni con sponsor e partner'
      ],
      keyAreas: [
        'Comunicazione',
        'Social Media',
        'Eventi',
        'Partnership'
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header Section */}
      <div className="relative h-96 bg-blue-900 overflow-hidden">
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
          <Users className="w-16 h-16 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Il Nostro Team</h1>
          <p className="text-xl">Passione, competenza e dedizione</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="bg-white sticky top-20 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-4 justify-center">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                activeSection === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Tutti i Team
            </button>
            {divisions.map((division) => (
              <button
                key={division.id}
                onClick={() => setActiveSection(division.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                  activeSection === division.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {division.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Team Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {divisions
            .filter(d => activeSection === 'all' || activeSection === d.id)
            .map((division) => (
              <div key={division.id} className="group">
                <div className="flex items-center gap-4 mb-6 justify-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    {division.icon}
                  </div>
                  <h2 className="text-3xl font-bold">{division.name}</h2>
                </div>
                <div className="max-w-3xl mx-auto">
                  <p className="text-lg mb-8 text-center">{division.description}</p>
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Attività Principali</h3>
                        <ul className="list-disc pl-6 space-y-2">
                          {division.details.map((detail, index) => (
                            <li key={index} className="text-gray-700">{detail}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Aree di Competenza</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {division.keyAreas.map((area, index) => (
                            <div key={index} className="bg-blue-50 p-3 rounded-lg text-center">
                              {area}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};

export default TeamPage;