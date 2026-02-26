import React from 'react';
import { MapPin, Briefcase } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { careerTranslations } from '../translations/career';

interface OpenPositionProps {
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[] | string;
}

const OpenPosition: React.FC<OpenPositionProps> = ({ title, location, type, description, requirements }) => {
  const { language } = useLanguage();

  const requirementsArray = (() => {
    if (Array.isArray(requirements)) {
      return requirements;
    }
    if (typeof requirements === 'string') {
      try {
        const parsed = JSON.parse(requirements);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // JSON.parse failed, treat as plain string
      }
      // If not an array after parsing, or parsing failed, split by newline
      return requirements.split('\n').filter(req => req.trim() !== '');
    }
    return []; // Default to empty array if not string or array
  })();

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 transition-shadow duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center cursor-pointer">
        <div>
          <h3 className="text-xl font-bold text-brand">{title}</h3>
          <div className="flex items-center text-gray-500 mt-2">
            <div className="flex items-center mr-4">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{location}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              <span>{type}</span>
            </div>
          </div>
        </div>
      </div>
      {(
        <div className="mt-6">
          <p className="text-gray-700 mb-4">{description}</p>
          <h4 className="font-semibold mb-2">{careerTranslations[language].openPositions.requirements}</h4>
          <ul className="list-disc list-inside text-gray-700">
            {requirementsArray.map((req, index) => (
              <li key={index} className="mb-1">{req}</li>
            ))}
          </ul>
          <a
            href="https://forms.gle/vQZf3VMJkiYtFqpZA"
            target="_blank"
            className="inline-block bg-brand text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-dark transition-colors mt-6"
          >
            {careerTranslations[language].spontaneousApplication.applyButton}
          </a>
        </div>
      )}
    </div>
  );
};

export default OpenPosition;
