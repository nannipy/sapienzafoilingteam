
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { teamTranslations } from '../../translations/team';

const TeamHero = () => {
  const { language } = useLanguage();
  const t = teamTranslations[language];

  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-brand-dark text-white">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-light rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6 shadow-2xl">
            <Users className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="font-syne font-bold text-5xl md:text-7xl mb-6 tracking-tight drop-shadow-lg">
            {t.title}
          </h1>
          
          <p className="font-geist text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Gradient Overlay for bottom blending */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default TeamHero;
