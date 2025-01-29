'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Warehouse, Anchor, Handshake, Component, PencilRuler, Leaf, 
         Truck, Wrench, Globe, Star, Layout, Lightbulb, LifeBuoy, 
         PersonStanding, Anvil, ChevronDown, CircuitBoard, Bolt  } from 'lucide-react';

const TeamPage = () => {
  const [activeSection, setActiveSection] = useState('all');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const iconsMap: Record<string, JSX.Element> = {
    'Materiali Sostenibili': <Leaf className="w-4 h-4 mr-1 sm:mr-2" />,
    'Processi di Manufacturing': <Wrench className="w-4 h-4 mr-1 sm:mr-2" />,
    'Impatto Ambientale': <Globe className="w-4 h-4 mr-1 sm:mr-2" />,
    'Innovazione': <Lightbulb className="w-4 h-4 mr-1 sm:mr-2" />,
    'Pianificazione Logistica': <Truck className="w-4 h-4 mr-1 sm:mr-2" />,
    'Supply Chain': <Warehouse className="w-4 h-4 mr-1 sm:mr-2" />,
    'Gestione Risorse': <Users className="w-4 h-4 mr-1 sm:mr-2" />,
    'Supporto Operativo': <LifeBuoy className="w-4 h-4 mr-1 sm:mr-2" />,
    'Logistica': <Truck className="w-4 h-4 mr-1 sm:mr-2" />,
    'Manutenzione': <Wrench className="w-4 h-4 mr-1 sm:mr-2" />,
    'Elettronica': <CircuitBoard className="w-4 h-4 mr-1 sm:mr-2" />,
    'Fine Tuning': <Bolt className="w-4 h-4 mr-1 sm:mr-2" />,
    'Strategia e Management': <Users className="w-4 h-4 mr-1 sm:mr-2" />,
    'Comunicazione': <Globe className="w-4 h-4 mr-1 sm:mr-2" />,
    'Relazioni Pubbliche': <PersonStanding className="w-4 h-4 mr-1 sm:mr-2" />,
    'Partnership': <Handshake className="w-4 h-4 mr-1 sm:mr-2" />,
    'CAD e Progettazione': <PencilRuler className="w-4 h-4 mr-1 sm:mr-2" />,
    'Simulazione FEM': <Anvil className="w-4 h-4 mr-1 sm:mr-2" />,
    'Performance Optimization': <Star className="w-4 h-4 mr-1 sm:mr-2" />,
    'Prototipazione 3D': <Layout className="w-4 h-4 mr-1 sm:mr-2" />
  };

  const divisions = [
    {
      id: 'materials',
      name: 'Materiali, Sostenibilità e Manufacturing',
      icon: <PencilRuler className="w-6 h-6" />,
      color: 'bg-[#822433]',
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
      id: 'shore',
      name: 'Shore Team',
      icon: <Anchor className="w-6 h-6" />,
      color: 'bg-[#822433]',
      description: ' Messa a punto e tuning della barca durante allenamenti ed eventi, presa e analisi dati.',
      details: [
        'Coordinamento delle operazioni a terra e in acqua',
        'Manutenzione ',
        'Installazione di sensori per la presa dati e analisi dei dati raccolti',
        'Supporto logistico durante le regate'
      ],
      keyAreas: [
        'Logistica',
        'Manutenzione',
        'Elettronica',
        'Fine Tuning'
      ]
    },
    {
      id: 'design',
      name: 'Progettazione e Ottimizzazione',
      icon: <Component className="w-6 h-6" />,
      color: 'bg-[#822433]',
      description: 'Progettazione e ottimizzazione dei componenti dell\'imbarcazione per massimizzare le prestazioni.',
      details: [
        'Progettazione CAD delle strutture',
        'Analisi e simulazioni FEM',
        'Ottimizzazione della resistenza e delle performance',
        'CFD e simulazioni 3D'
      ],
      keyAreas: [
        'CAD e Progettazione',
        'Simulazione FEM',
        'Performance Optimization',
        'Prototipazione 3D'
      ]
    },
    {
      id: 'management',
      name: 'Management e Comunicazione',
      icon: <Handshake className="w-6 h-6" />,
      color: 'bg-[#822433]',
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
    }
  ];

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Enhanced Header Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-full bg-gradient-to-br from-[#822433] to-[#6d1f2b] overflow-hidden "
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 h-96 flex flex-col items-center justify-center text-white mt-20 sm:mt-10"
        >
          <Users className="w-16 h-16 mb-2 mt-10"/>
          <h1 className="text-4xl md:text-5xl font-bold mb-1">Il Nostro Team</h1>
          <p className="text-xl max-w-3xl text-center mb-10 px-6">
            Il nostro team si articola in quattro reparti fondamentali, ognuno con un ruolo strategico 
            e un contributo distintivo al successo del progetto.
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="cursor-pointer"
            onClick={() => {
              document.getElementById('team-sections')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <ChevronDown className="w-8 h-8"/>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Navigation Section */}
      <div className="bg-white sticky top-24 z-20 shadow-md ">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-8">
          <motion.div 
            className="flex overflow-x-auto py-4 gap-4 sm:justify-center justify-start sm:scrollbar-hide scrollbar-hide sm:overflow-visible"
            whileTap={{ cursor: "grabbing" }}
          >
            <motion.button
              onClick={() => setActiveSection('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300  ${
                activeSection === 'all'
                  ? 'bg-[#822433] text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tutti i Reparti
            </motion.button>
            {divisions.map((division) => (
              <motion.button
                key={division.id}
                onClick={() => setActiveSection(division.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300  ${
                  activeSection === division.id
                    ? 'bg-[#822433] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {division.name}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Team Sections */}
      <div id="team-sections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div className="space-y-16 justify-start" >
            {divisions
              .filter(d => activeSection === 'all' || activeSection === d.id)
              .map((division) => (
                <motion.div
                  key={division.id}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeInUp}
                  className="group"
                >
                  <div className="flex items-center gap-4 mb-6 justify-center mx-auto">
                    <motion.div 
                      className={`p-3 rounded-full bg-gradient-to-r text-white ${division.color}`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {division.icon}
                    </motion.div>
                    <h2 className="text-3xl font-extrabold ">{division.name}</h2>
                  </div>
                  <div className="max-w-3xl mx-auto">
                    <p className="text-lg mb-8 text-center">{division.description}</p>
                    <motion.div 
                      className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
                      whileHover={{ y: -5 }}
                    >
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4">Attività Principali</h3>
                          <ul className="list-disc pl-6 space-y-2">
                            {division.details.map((detail, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-gray-700 md:text-base sm:text-sm"
                              >
                                {detail}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-4">Aree di Competenza</h3>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {division.keyAreas.map((area, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="bg-[#822433]/10 p-3 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#822433]/20 transition-colors"
                              >
                                {iconsMap[area]}
                                <span className="text-sm sm:text-base ">{area}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default TeamPage;