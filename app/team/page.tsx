'use client';

import React, { useState } from 'react';
import { Users, Warehouse, Anchor, Handshake, Component, PencilRuler, Leaf, Truck, Wrench, Globe, Star, Layout, Lightbulb, LifeBuoy, PersonStanding, Anvil } from 'lucide-react';



const TeamPage = () => {
  const [activeSection, setActiveSection] = useState('all');
  const iconsMap: Record<string, JSX.Element> = {
    'Materiali Sostenibili': <Leaf className="w-5 h-5 mr-2" />,
    'Processi di Manufacturing': <Wrench className="w-5 h-5 mr-2" />,
    'Impatto Ambientale': <Globe className="w-5 h-5 mr-2" />,
    'Innovazione': <Lightbulb className="w-5 h-5 mr-2" />,
    'Pianificazione Logistica': <Truck className="w-5 h-5 mr-2" />,
    'Supply Chain': <Warehouse className="w-5 h-5 mr-2" />,
    'Gestione Risorse': <Users className="w-5 h-5 mr-2" />,
    'Supporto Operativo': <LifeBuoy className="w-5 h-5 mr-2" />,
    'Logistica': <Truck className="w-5 h-5 mr-2" />,
    'Manutenzione': <Wrench className="w-5 h-5 mr-2" />,
    'Gestione Emergenze': <Globe className="w-5 h-5 mr-2" />,
    'Coordinamento Eventi': <Handshake className="w-5 h-5 mr-2" />,
    'Strategia e Management': <Users className="w-5 h-5 mr-2" />,
    'Comunicazione': <Globe className="w-5 h-5 mr-2" />,
    'Relazioni Pubbliche': <PersonStanding className="w-5 h-5 mr-2" />,
    'Partnership': <Handshake className="w-5 h-5 mr-2" />,
    'CAD e Progettazione': <PencilRuler className="w-5 h-5 mr-2" />,
    'Simulazione FEM': <Anvil className="w-5 h-5 mr-2" />,
    'Performance Optimization': <Star className="w-5 h-5 mr-2" />,
    'Prototipazione 3D': <Layout className="w-5 h-5 mr-2" />
  };

  const divisions = [
    {
      id: 'materials',
      name: 'Materiali, Sostenibilità e Manufacturing',
      icon: <PencilRuler className="w-6 h-6" />,
      description: 'Ricerca, selezione e gestione dei materiali e dei processi sostenibili per la costruzione dell\'imbarcazione.',
      details: [
        'Ricerca e sviluppo di materiali sostenibili',
        'Analisi e riduzione dell\'impatto ambientale',
        'Ottimizzazione dei processi di manufacturing',
        'Integrazione di soluzioni eco-friendly'
      ],
      keyAreas: [
        'Materiali Sostenibili',
        'Processi di Manufacturing',
        'Impatto Ambientale',
        'Innovazione'
      ]
    },
    {
      id: 'logistics',
      name: 'Logistica',
      icon: <Warehouse className="w-6 h-6" />,
      description: 'Gestione logistica e supporto delle operazioni di trasporto e movimentazione.',
      details: [
        'Pianificazione e coordinamento delle attività di trasporto',
        'Gestione della catena di approvvigionamento',
        'Ottimizzazione delle risorse logistiche',
        'Supporto nelle attività a terra e in acqua'
      ],
      keyAreas: [
        'Pianificazione Logistica',
        'Supply Chain',
        'Gestione Risorse',
        'Supporto Operativo'
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
      id: 'management',
      name: 'Management e Comunicazione',
      icon: <Handshake className="w-6 h-6" />,
      description: 'Strategia, comunicazione e gestione delle relazioni pubbliche del team.',
      details: [
        'Pianificazione e sviluppo delle strategie',
        'Gestione della comunicazione esterna',
        'Relazioni con sponsor e partner',
        'Organizzazione di eventi e attività promozionali'
      ],
      keyAreas: [
        'Strategia e Management',
        'Comunicazione',
        'Relazioni Pubbliche',
        'Partnership'
      ]
    },
    {
      id: 'design',
      name: 'Progettazione e Ottimizzazione',
      icon: <Component className="w-6 h-6" />,
      description: 'Progettazione e ottimizzazione dei componenti dell\'imbarcazione per massimizzare le prestazioni.',
      details: [
        'Progettazione CAD delle strutture',
        'Analisi e simulazioni FEM',
        'Ottimizzazione della resistenza e delle performance',
        'Prototipazione tramite stampa 3D'
      ],
      keyAreas: [
        'CAD e Progettazione',
        'Simulazione FEM',
        'Performance Optimization',
        'Prototipazione 3D'
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header Section */}
      <div className="relative h-full bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
        <div className="relative z-10 h-96 flex flex-col items-center justify-center text-white mt-20 sm:mt-0">
          <Users className="w-16 h-16 mb-2"/>
          <h1 className="text-4xl md:text-5xl font-bold mb-1">Il Nostro Team</h1>
          <p className="text-xl h-44 sm:h-0 sm:mx-48 mx-20 text-center mb-10 sm:mb-0 overflow-visible">Il nostro team si articola in cinque reparti fondamentali, ognuno con un ruolo strategico e un contributo distintivo al successo del progetto. Collaborando sinergicamente, ciascun reparto svolge una funzione specifica, contribuendo in modo essenziale alla crescita e all&apos;efficienza dell&apos;intera organizzazione.</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="bg-white sticky top-20 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-4 sm:justify-center justify-start">
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
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 sm:overflow-x-hidden ${
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
        <div className="space-y-16 justify-start">
          {divisions
            .filter(d => activeSection === 'all' || activeSection === d.id)
            .map((division) => (
              <div key={division.id} className="group">
                <div className="flex items-center gap-4 mb-6 justify-center mx-auto">
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
                            <div key={index} className="bg-blue-50 p-3 rounded-lg flex items-center justify-center">
                              {iconsMap[area]} {/* Icona per l'area */}
                              <span>{area}</span>
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