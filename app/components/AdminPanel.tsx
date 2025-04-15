'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { useLanguage } from '../context/LanguageContext';
import { blogTranslations } from '../translations/blog';
import {
  LayoutDashboard,
  Edit,
  Image as ImageIcon,
  LogOut
} from 'lucide-react';

type AdminPanelProps = {
  user: User | null;
  viewMode: 'list' | 'form';
  isEditing: boolean;
  onViewModeChange: (mode: 'list' | 'form') => void;
  onLogout?: () => void;
  children: React.ReactNode;
};


export default function AdminPanel({
  user,
  viewMode,
  isEditing,
  onLogout,
  children
}: AdminPanelProps) {
  const { language } = useLanguage();
  const currentPath = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-100">
        <nav className="flex-grow pt-4">
          <ul>
            <li className="px-4 mb-2">
            <Link
                href="/blog/admin"
                className={`w-full flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors duration-150 ${
                  currentPath === '/blog/admin'
                    ? 'bg-[#f0e4e6] text-[#822433]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                
                  {blogTranslations[language].admin.articlesList}
                </Link>
            </li>
            {isEditing && viewMode === 'form' && (
              <li className="px-4 mb-2">
                <button
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium bg-[#f0e4e6] text-[#822433] cursor-default`}
                >
                  <Edit className="mr-3 h-5 w-5" />
                  Edit Article
                </button>
              </li>
            )}
            <li className="px-4 mb-2">
              <Link
                href="/blog/admin/media"
                className={`w-full flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors duration-150 ${
                  currentPath === '/blog/admin/media'
                    ? 'bg-[#f0e4e6] text-[#822433]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <ImageIcon className="mr-3 h-5 w-5" />
                Media
              </Link>
            </li>
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-4 mt-16">
          <p className="text-xs text-gray-500 mb-1">Logged in as:</p>
          <p className="text-sm font-medium text-gray-800 truncate mb-3">{user?.email}</p>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-150 border border-red-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
     

      <main className="flex-1 ml-64 p-6 md:p-10">{children}</main>
    </div>
  );
}