'use client';

import React from 'react';
import { 
  Mail, 
  MessageSquare,
} from 'lucide-react';
import {  MapPin, Facebook, Instagram, Linkedin , TreePine} from 'lucide-react';


const ContactPage = () => {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-[#822433] to-[#6d1f2b] ">
        <div className="absolute inset-0 " />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <MessageSquare className="w-16 h-16 mb-4 mt-10" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Contattaci</h1>
        </div>
      </div>

    

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-1 gap-12">

          <div className="bg-white w-full max-w-2xl mx-auto rounded-xl shadow-lg">
            <div className="border-b p-6">
              <h2 className="text-3xl font-bold text-gray-800">I Nostri Contatti</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Email Section */}
                <div className="group">
                  <h3 className="text-lg font-semibold text-black mb-2">Email</h3>
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
                  <h3 className="text-lg font-semibold text-black mb-2">Sede</h3>
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
                  <h3 className="text-lg font-semibold text-black mb-2">LinkTree</h3>
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
                  <h3 className="text-lg font-semibold text-black mb-3 ">Social</h3>
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
        </div>
      </div>

 

     
    </main>
  );
};

export default ContactPage;