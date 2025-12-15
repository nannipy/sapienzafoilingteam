'use client';

import { Instagram, Linkedin, Facebook } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { footerTranslations } from '../translations/footer';


const Footer: React.FC = () => {
  const { language } = useLanguage();
  return (
    <footer className="bg-gray-50 text-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
           {/* Brand / Logo Area */}
           <div>
             <h2 className="text-[8rem] leading-[0.8] font-syne font-black text-black/5 tracking-widest select-none -ml-4">
               SFT
             </h2>
             <p className="mt-8 text-gray-400 font-geist max-w-sm">
               {footerTranslations[language].description}
             </p>
           </div>
           
           {/* Quick Links / Contact */}
           <div className="flex flex-col justify-end items-start md:items-end space-y-4">
              <a href="mailto:sapienzafoilingteam@gmail.com" className="text-2xl text-black/50 md:text-3xl font-syne font-bold hover:text-[] transition-colors">
                sapienzafoilingteam@gmail.com
              </a>
              <div className="flex space-x-6 mt-4">
                {[
                  { Icon: Instagram, href: "https://instagram.com/sapienzafoilingteam" },
                  { Icon: Linkedin, href: "https://linkedin.com/company/sapienzafoilingteam" }, // Replace with actual LinkedIn URL
                  { Icon: Facebook, href: "https://facebook.com/sapienzafoilingteam" }, // Replace with actual Facebook URL
                ].map((social, idx) => (
                  <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-brand hover:text-white transition-all duration-300">
                    <social.Icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-geist">
          <div>
            {footerTranslations[language].copyright}
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;