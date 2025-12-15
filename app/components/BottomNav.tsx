'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ship, Users, Handshake, Mail, BookOpen, Briefcase } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { navbarTranslations } from '../translations/navbar';

const BottomNav = () => {
  const currentPath = usePathname();
  const { language } = useLanguage();

  const navigationItems = [
    { label: navbarTranslations[language].boat, href: '/boat', icon: Ship },
    { label: navbarTranslations[language].team, href: '/team', icon: Users },
    { label: navbarTranslations[language].sponsor, href: '/sponsor', icon: Handshake },
    { label: navbarTranslations[language].blog, href: '/blog', icon: BookOpen },
    { label: navbarTranslations[language].contact, href: '/contact', icon: Mail },
  ];

  const isCurrentPath = (path: string) => currentPath === path;

  return (
    <nav className="fixed bottom-6 left-4 right-4 mx-auto max-w-md z-50 md:hidden">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-white/20 flex justify-around items-center h-16 px-2">
        {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isCurrentPath(item.href);
            return (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
                    isActive ? 'text-[#822433]' : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    <Icon className="w-6 h-6" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
            );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
