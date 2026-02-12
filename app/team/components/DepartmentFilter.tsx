
'use client';

import React from 'react';
import { divisionsConfig } from '../config';
import { useLanguage } from '../../context/LanguageContext';
import { teamTranslations } from '../../translations/team';

interface DepartmentFilterProps {
  activeSection: string;
  setActiveSection: (id: string) => void;
}

const DepartmentFilter: React.FC<DepartmentFilterProps> = ({ activeSection, setActiveSection }) => {
  const { language } = useLanguage();
  const t = teamTranslations[language];

  const divisions = Object.keys(divisionsConfig);

  return (
    <div className="sticky top-5 z-40 bg-background/80 backdrop-blur-md border-b border-gray-200/50 py-4 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-2 sm:gap-4 pb-2 sm:pb-0 scrollbar-hide sm:justify-center">
          {/* All Departments Button */}
          <button
            onClick={() => setActiveSection('all')}
            className={`
              relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
              ${activeSection === 'all'
                ? 'text-white bg-brand '
                : 'text-gray-600 hover:bg-gray-100 bg-gray-50'
              }
            `}
          >
            {t.allDepartments}
          </button>

          {/* Individual Divisions */}
          {divisions.map((id) => {
            const config = divisionsConfig[id];
            const translation = t.divisions[id as keyof typeof t.divisions];

            return (

              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`
                  relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2
                  ${activeSection === id
                    ? 'text-white bg-brand'
                    : 'text-gray-600 hover:bg-gray-100 bg-gray-50'
                  }
                `}
              >
                <div className={`flex items-center justify-center w-4 h-4 shrink-0 ${activeSection === id ? 'text-white' : 'text-gray-500'}`}>
                  {config.icon}
                </div>
                <span className="leading-none">{translation.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DepartmentFilter;
