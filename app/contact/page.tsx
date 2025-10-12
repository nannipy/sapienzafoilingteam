'use client';

import React from 'react';
import { 
  Mail, 
  MessageSquare,
}
from 'lucide-react';
import {  MapPin, Facebook, Instagram, Linkedin , TreePine} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { contactTranslations } from '../translations/contact';
import Link from 'next/link'


const ContactPage = () => {
  const { language } = useLanguage();
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-[#822433] to-[#6d1f2b] ">
        <div className="absolute inset-0 " />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <MessageSquare className="w-16 h-16 mb-4 mt-10" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{contactTranslations[language].title}</h1>
        </div>
      </div>

    

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Column 1: Contacts */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="border-b p-6">
              <h2 className="text-3xl font-bold text-gray-800">{contactTranslations[language].ourContacts}</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Email Section */}
                <div className="group">
                  <h3 className="text-lg font-semibold text-black mb-2">{contactTranslations[language].email}</h3>
                  <a 
                    href="mailto:sapienzafoilingteam@gmail.com" 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#fdf1f3] transition-colors duration-200"
                  >
                    <Mail className="w-6 h-6 text-[#822433]" />
                    <span className="text-[#822433] group-hover:underline">sapienzafoilingteam@gmail.com</span>
                  </a>
                </div>
                

                {/* Location Section */}
                <div className="group">
                  <h3 className="text-lg font-semibold text-black mb-2">{contactTranslations[language].location}</h3>
                  <a 
                    href="https://goo.gl/maps/YOUR_LOCATION" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#fdf1f3] transition-colors duration-200"
                  >
                    <MapPin className="w-6 h-6 text-[#822433]" />
                    <span className="text-[#822433] group-hover:underline">Via Eudossiana 18, 00184 Roma</span>
                  </a>
                </div>
                <div className="group">
                  <h3 className="text-lg font-semibold text-black mb-2">{contactTranslations[language].linktree}</h3>
                  <a 
                    href="linktr.ee/sapienzafoilingteam" 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#fdf1f3] transition-colors duration-200"
                  >
                    <TreePine className="w-6 h-6 text-[#822433]" />
                    <span className="text-[#822433] group-hover:underline">linktr.ee/sapienzafoilingteam</span>
                  </a>
                </div>
                

                {/* Social Links */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-black mb-3 ">{contactTranslations[language].social}</h3>
                  <div className="flex space-x-9 ml-4">
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
            </div>
          </div>

          {/* Column 2: Map */}
          <div className="bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.9876229173233!2d12.490363776654638!3d41.89312327124013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f61b0d854d591%3A0x479e9d6899d47703!2sVia%20Eudossiana%2C%2018%2C%2000184%20Roma%20RM!5e0!3m2!1sit!2sit!4v1760276733613!5m2!1sit!2sit" width="100%" height="100%" loading="lazy" ></iframe>
          </div>

          {/* Column 3: Get Involved */}
          <div className="bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{contactTranslations[language].joinUs}</h3>
                <p className="text-gray-600 mb-6">{contactTranslations[language].joinUsText}</p>
                <Link href="/career" className="inline-block bg-[#822433] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#6d1f2b] transition-colors">
                    {contactTranslations[language].goToCareerPage}
                </Link>
            </div>
            <div className="text-center mt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{contactTranslations[language].collaborateWithUs}</h3>
                <p className="text-gray-600 mb-6">{contactTranslations[language].collaborateWithUsText}</p>
                <a href="mailto:sapienzafoilingteam@gmail.com" className="inline-block bg-[#822433] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#6d1f2b] transition-colors">
                    {contactTranslations[language].contactUs}
                </a>
            </div>
          </div>
        </div>
      </div>

 

     
    </main>
  );
};

export default ContactPage;