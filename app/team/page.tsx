'use client';
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { teamTranslations } from '../translations/team';
import { JSX, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Anchor, Handshake, Component, PencilRuler, Leaf, 
         Truck, Wrench, Globe, Star, Layout, Lightbulb, 
         PersonStanding, Anvil, ChevronDown, CircuitBoard, Bolt  } from 'lucide-react';
import posthog from 'posthog-js';

const iconsMap: Record<string, JSX.Element> = {
  'Materiali Sostenibili': <Leaf className="w-4 h-4 mr-1 sm:mr-2" />,
  'Processi di Manufacturing': <Wrench className="w-4 h-4 mr-1 sm:mr-2" />,
  'Impatto Ambientale': <Globe className="w-4 h-4 mr-1 sm:mr-2" />,
  'Innovazione': <Lightbulb className="w-4 h-4 mr-1 sm:mr-2" />,
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

const iconKeyMap: Record<string, string> = {
  'Sustainable Materials': 'Materiali Sostenibili',
  'Manufacturing Processes': 'Processi di Manufacturing',
  'Environmental Impact': 'Impatto Ambientale',
  'Innovation': 'Innovazione',
  'Logistics': 'Logistica',
  'Maintenance': 'Manutenzione',
  'Electronics': 'Elettronica',
  'Fine Tuning': 'Fine Tuning',
  'Strategy and Management': 'Strategia e Management',
  'Communication': 'Comunicazione',
  'Public Relations': 'Relazioni Pubbliche',
  'Partnership': 'Partnership',
  'CAD and Design': 'CAD e Progettazione',
  'FEM Simulation': 'Simulazione FEM',
  'Performance Optimization': 'Performance Optimization',
  '3D Prototyping': 'Prototipazione 3D'
};

const TeamPage = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('all');

  const divisions = [
    {
      id: 'materials',
      name: teamTranslations[language].divisions.materials.name,
      icon: <PencilRuler className="w-6 h-6" />,
      color: 'bg-[#822433]',
      description: teamTranslations[language].divisions.materials.description,
      details: teamTranslations[language].divisions.materials.details,
      keyAreas: teamTranslations[language].divisions.materials.keyAreas
    },
    {
      id: 'shore',
      name: teamTranslations[language].divisions.shore.name,
      icon: <Anchor className="w-6 h-6" />,
      color: 'bg-[#822433]',
      description: teamTranslations[language].divisions.shore.description,
      details: teamTranslations[language].divisions.shore.details,
      keyAreas: teamTranslations[language].divisions.shore.keyAreas
    },
    {
      id: 'design',
      name: teamTranslations[language].divisions.design.name,
      icon: <Component className="w-6 h-6" />,
      color: 'bg-[#822433]',
      description: teamTranslations[language].divisions.design.description,
      details: teamTranslations[language].divisions.design.details,
      keyAreas: teamTranslations[language].divisions.design.keyAreas
    },
    {
      id: 'management',
      name: teamTranslations[language].divisions.management.name,
      icon: <Handshake className="w-6 h-6" />,
      color: 'bg-[#822433]',
      description: teamTranslations[language].divisions.management.description,
      details: teamTranslations[language].divisions.management.details,
      keyAreas: teamTranslations[language].divisions.management.keyAreas
    }
  ];

  const handleDivisionClick = (divisionId: string) => {
    setActiveSection(divisionId);
    posthog.capture('division_filter_clicked', {
      division: divisionId
    });
  };

  const handleKeyAreaClick = (keyArea: string, divisionId: string) => {
    posthog.capture('key_area_clicked', {
      key_area: keyArea,
      division: divisionId
    });
  };

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
          <h1 className="text-4xl md:text-5xl font-bold mb-1">{teamTranslations[language].title}</h1>
          <p className="text-xl max-w-3xl text-center mb-10 px-6">
            {teamTranslations[language].subtitle}
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
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
              onClick={() => handleDivisionClick('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300  ${
                activeSection === 'all'
                  ? 'bg-[#822433] text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {teamTranslations[language].allDepartments}
            </motion.button>
            {divisions.map((division) => (
              <motion.button
                key={division.id}
                onClick={() => handleDivisionClick(division.id)}
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
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 }
                  }}
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
                          <h3 className="text-xl font-semibold mb-4">{teamTranslations[language].activities}</h3>
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
                          <h3 className="text-xl font-semibold mb-4">{teamTranslations[language].competenceAreas}</h3>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {division.keyAreas.map((area, index) => (
                              <motion.div
                                key={index}
                                onClick={() => handleKeyAreaClick(area, division.id)}
                                whileHover={{ scale: 1.05 }}
                                className="bg-[#822433]/10 p-3 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#822433]/20 transition-colors"
                              >
                                {iconsMap[language === 'en' ? iconKeyMap[area] : area]}
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