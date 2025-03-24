'use client';

import { Instagram, Linkedin, Facebook } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { footerTranslations } from '../translations/footer';


const Footer: React.FC = () => {
  const { language } = useLanguage();
  return (
  <footer className="bg-gray-50 text-black py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center">
      <div className="">
        {footerTranslations[language].copyright}
      </div>
      <a
          href="mailto:sapienzafoilingteam@gmail.com"
          className="hover:text-[#822433] font-bold transition-colors flex items-center gap-2"
          aria-label="Email"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-8 h-8 hover:scale-110 transition-transform hidden md:block"
          >
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <span className="text-sm hidden md:block">sapienzafoilingteam@gmail.com</span>
        </a>
      
      <div className="flex space-x-3">
        {/* Social Media Icons */}
        <a 
          href="https://www.instagram.com/sapienzafoilingteam/" 
          className="hover:text-[#822433] transition-colors"
          aria-label="Instagram"
        >
          <Instagram className="w-8 h-8 hover:scale-110 transition-transform" />
        </a>
        <a 
          href="https://www.linkedin.com/company/sapienza-foiling-team/about/" 
          className="hover:text-[#822433] transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-8 h-8 hover:scale-110 transition-transform" />
        </a>
        <a 
          href="https://www.facebook.com/profile.php?id=61572515878295" 
          className="hover:text-[#822433] transition-colors"
          aria-label="Facebook"
        >
          <Facebook className="w-8 h-8 hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  </div>
</footer>
  );
}

export default Footer;