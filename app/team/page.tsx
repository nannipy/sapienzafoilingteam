
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { teamTranslations } from '../translations/team';
import PageLayout from '../components/PageLayout';
import TeamHero from './components/TeamHero';
import DepartmentFilter from './components/DepartmentFilter';
import DepartmentCard from './components/DepartmentCard';
import DepartmentDetail from './components/DepartmentDetail';
import { divisionsConfig } from './config';

const TeamPage = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('all');
  const t = teamTranslations[language];

  // Helper to get division data safely
  const getDivisionData = (id: string) => {
    return t.divisions[id as keyof typeof t.divisions];
  };

  return (
    <PageLayout>
      <DepartmentFilter
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="px-6 md:px-12 py-5">
        <AnimatePresence mode="wait">
          {activeSection === 'all' ? (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            >
              {Object.keys(divisionsConfig).map((id) => (
                <div key={id} className="h-full">
                  <DepartmentCard
                    id={id}
                    config={divisionsConfig[id]}
                    name={getDivisionData(id).name}
                    description={getDivisionData(id).description}
                    onClick={() => setActiveSection(id)}
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <DepartmentDetail
              key={activeSection}
              id={activeSection}
              config={divisionsConfig[activeSection]}
              data={getDivisionData(activeSection)}
            />
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};

export default TeamPage;