
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DivisionConfig, iconsMap, iconKeyMap } from '../config';
import { useLanguage } from '../../context/LanguageContext';
import { teamTranslations } from '../../translations/team';

interface DivisionData {
  name: string;
  description: string;
  details: string[];
  keyAreas: string[];
}

interface DepartmentDetailProps {
  id: string; // Keep id if we want to use it for key prop or analytics, otherwise remove from destructuring if truly unused
  config: DivisionConfig;
  data: DivisionData; 
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({ config, data }) => {
  const { language } = useLanguage();
  const t = teamTranslations[language];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-brand/5 text-brand shrink-0">
          <div className="w-12 h-12 [&>svg]:w-full [&>svg]:h-full">
             {config.icon}
          </div>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold font-syne mb-4 text-brand-dark">{data.name}</h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
            {data.description}
          </p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Main Activities */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-xl text-brand font-bold mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
            <span className="w-2 h-8 bg-brand rounded-full"/>
            {t.activities}
          </h3>
          <ul className="space-y-4">
            {data.details.map((detail: string, index: number) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2.5 shrink-0" />
                <span className="leading-relaxed">{detail}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Areas of Expertise */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-xl text-brand font-bold mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
             <span className="w-2 h-8 bg-brand rounded-full"/>
            {t.competenceAreas}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.keyAreas.map((area: string, index: number) => {
               // Resolve icon: try direct match, then English key map, fallback to generic
               // The original code Logic: iconsMap[language === 'en' ? iconKeyMap[area] : area]
               // If language is 'en', we look up the key in iconKeyMap (e.g. 'Sustainable Materials' -> 'Materiali Sostenibili')
               // Then look up 'Materiali Sostenibili' in iconsMap.
               // If language is 'it', we iterate 'area' directly (e.g. 'Materiali Sostenibili').
               
               // But wait, iconKeyMap maps English(Key) -> Italian(Key in iconsMap).
               // So if language is 'en', area is 'Sustainable Materials'. iconKeyMap['Sustainable Materials'] is active.
               
               const iconKey = language === 'en' ? iconKeyMap[area] : area;
               const icon = iconsMap[iconKey];

               return (
                <div 
                  key={index}
                  className="group flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-brand/20 hover:bg-brand/5 transition-all duration-300 text-center"
                >
                  <div className="text-brand mb-2 opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-all">
                    {icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-brand-dark">
                    {area}
                  </span>
                </div>
               );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DepartmentDetail;
