'use client';

import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  onChevronClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onChevronClick }) => {
  return (
    <div className="relative h-screen flex items-center justify-center">
      <Image
        src="/moth_5.jpg"
        alt="regatta"
        fill
        className="object-cover brightness-50"
        priority
      />
      
      <div className="relative z-10 text-center text-white px-4">
        <div className="transition-all duration-500" data-testid="animated-element">
          <h1 className="text-5xl md:text-7xl font-bold pb-4">
            Sapienza Foiling Team
          </h1>
        </div>
      </div>

      <div className="absolute bottom-8 w-full flex justify-center">
        <div className="animate-bounce">
          <ChevronDown
            data-testid="chevron-down"
            className="text-white w-8 h-8"
            onClick={onChevronClick}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
