
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { DivisionConfig } from '../config';

interface DepartmentCardProps {
  id: string;
  name: string;
  description: string;
  config: DivisionConfig;
  onClick: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ id, name, description, config, onClick }) => {
  return (
    <motion.div
      layoutId={`card-${id}`}
      onClick={onClick}
      className="group relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-brand/20 h-full flex flex-col"
      whileHover={{ y: -5 }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowRight className="w-5 h-5 text-brand" />
      </div>

      <div className="mb-4 p-3 w-14 h-14 rounded-xl bg-brand/5 text-brand group-hover:bg-brand group-hover:text-white transition-colors duration-300 flex items-center justify-center">
        {config.icon}
      </div>

      <h3 className="text-xl font-bold font-syne mb-2 text-brand group-hover:text-brand transition-colors">
        {name}
      </h3>
      
      <p className="text-gray-600 text-sm leading-relaxed flex-grow">
        {description}
      </p>

      
    </motion.div>
  );
};

export default DepartmentCard;
