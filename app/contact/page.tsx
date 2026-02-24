'use client';

import React from 'react';
import {
  Mail,
  MessageSquare,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  TreePine
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { contactTranslations } from '../translations/contact';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';

const ContactPage = () => {
  const { language } = useLanguage();
  const t = contactTranslations[language];

  return (
    <PageLayout
      title={t.title}
      Icon={MessageSquare}
    >
      {/* Main Content */}
      <div className="px-6 md:px-12 py-16">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Column 1: Contacts */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="border-b p-6">
              <h2 className="text-3xl font-bold text-gray-800">{t.ourContacts}</h2>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Email Section */}
                <div className="group">
                  <h3 className="text-lg font-semibold text-black mb-2">{t.email}</h3>
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
                  <h3 className="text-lg font-semibold text-black mb-2">{t.location}</h3>
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
                  <h3 className="text-lg font-semibold text-black mb-2">{t.linktree}</h3>
                  <a
                    href="https://linktr.ee/sapienzafoilingteam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#fdf1f3] transition-colors duration-200"
                  >
                    <TreePine className="w-6 h-6 text-[#822433]" />
                    <span className="text-[#822433] group-hover:underline">linktr.ee/sapienzafoilingteam</span>
                  </a>
                </div>


                {/* Social Links */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-black mb-3 ">{t.social}</h3>
                  <div className="flex space-x-9 ml-4">
                    <a
                      href="https://www.instagram.com/sapienzafoilingteam/"
                      className="hover:text-[#822433] transition-colors"
                      aria-label="Instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-8 h-8 hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/sapienza-foiling-team/about/"
                      className="hover:text-[#822433] transition-colors"
                      aria-label="LinkedIn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-8 h-8 hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href="https://www.facebook.com/profile.php?id=61572515878295"
                      className="hover:text-[#822433] transition-colors"
                      aria-label="Facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="w-8 h-8 hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Map */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center overflow-hidden min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.9876229173233!2d12.490363776654638!3d41.89312327124013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f61b0d854d591%3A0x479e9d6899d47703!2sVia%20Eudossiana%2C%2018%2C%2000184%20Roma%20RM!5e0!3m2!1sit!2sit!4v1760276733613!5m2!1sit!2sit"
              width="100%"
              height="100%"
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>

          {/* Column 3: Get Involved */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center p-6 space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.joinUs}</h3>
              <p className="text-gray-600 mb-6">{t.joinUsText}</p>
              <Link href="/career" className="inline-block bg-[#822433] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#6d1f2b] transition-colors">
                {t.goToCareerPage}
              </Link>
            </div>
            <div className="text-center w-full pt-8 border-t border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.collaborateWithUs}</h3>
              <p className="text-gray-600 mb-6">{t.collaborateWithUsText}</p>
              <a href="mailto:sapienzafoilingteam@gmail.com" className="inline-block bg-white text-[#822433] border border-[#822433] font-bold py-3 px-6 rounded-lg hover:bg-[#fdf1f3] transition-colors">
                {t.contactUs}
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactPage;