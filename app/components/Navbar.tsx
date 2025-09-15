'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { navbarTranslations } from '../translations/navbar';
import posthog from 'posthog-js';

const Navbar = () => {
  const [isRounded, setIsRounded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = usePathname();
  const { language, setLanguage } = useLanguage();
  
  const navigationItems = [
    { label: navbarTranslations[language].fleet, href: '/fleet' },
    { label: navbarTranslations[language].team, href: '/team' },
    { label: navbarTranslations[language].sponsor, href: '/sponsor' },
    { label: navbarTranslations[language].contact, href: '/contact' },
    { label: navbarTranslations[language].blog, href: '/blog'},
  ];

  const isCurrentPath = (path: string) => currentPath === path;

  const handleMenuToggle = () => {
    if (!isMobileMenuOpen) {
      setIsRounded(false);
      setTimeout(() => {
        setIsMobileMenuOpen(true);
      }, 300);
    } else {
      setIsMobileMenuOpen(false);
      setTimeout(() => {
        setIsRounded(true);
      }, 300);
    }
  };

  const handleNavClick = (toPage: string, type: 'menu' | 'cta' | 'link') => {
    posthog.capture('page_navigation', {
      from_page: currentPath,
      to_page: toPage,
      navigation_type: type
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className={`bg-white text-black font-bold mx-auto max-w-4xl shadow-lg hover:shadow-xl transition-all duration-300
        ${isRounded ? 'rounded-full' : 'rounded-lg'}`}>
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
            <Image src="/logosft.svg" alt="Logo" width={40} height={40} className="h-16 w-16" priority />
          </Link>

          <div data-testid="desktop-nav" className="hidden md:flex items-center space-x-4">
            
            {navigationItems.map((item) => (
              
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href, 'menu')}
                className={`px-4 py-2 rounded-full transition-all duration-300 hover:bg-gray-100 ${
                  isCurrentPath(item.href) ? 'bg-gray-100' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSfUxoIJQdocILXDDgykkHAJ1yg60mGeZ7T_fr5M6cob1ca8oA/viewform?usp=dialog"
              className="ml-4 px-6 py-2 bg-[#822433] text-white rounded-full transition-all duration-300 hover:bg-[#6d1f2b] hover:shadow-md"
              target="_blank"
              onClick={() => handleNavClick('join_us_form', 'cta')}
            >
              {navbarTranslations[language].joinUs}
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            onClick={handleMenuToggle}
            aria-label="Toggle navigation"
          >
            {!isRounded ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div 
          data-testid="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 ${
                  isCurrentPath(item.href) ? 'bg-gray-100' : ''
                }`}
                onClick={() => {handleMenuToggle(); handleNavClick(item.href, 'menu');}}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSfUxoIJQdocILXDDgykkHAJ1yg60mGeZ7T_fr5M6cob1ca8oA/viewform?usp=dialog"
              className="block mt-2 px-4 py-2 bg-[#822433] text-white rounded-lg text-center transition-all duration-300 hover:bg-[#6d1f2b]"
              onClick={() => {handleMenuToggle(); handleNavClick('join_us_form', 'cta');}}
            >
              {navbarTranslations[language].joinUs}
            </Link>
          </div>
        </div>
      </div>
      <button
        onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center bg-white hover:bg-gray-200 transition-colors duration-300
          fixed bottom-4 left-4 shadow-lg text-black`}
        aria-label="Switch language"
      >
        {language === 'en' ? (
          <Image 
            src="/flags/it-flag.png" 
            alt="Italian Flag" 
            width={24} 
            height={24}
          />
        ) : (
          <Image 
            src="/flags/en-flag.png" 
            alt="British Flag" 
            width={24} 
            height={24}
          />
        )}
      </button>
    </nav>
  );
};

export default Navbar;