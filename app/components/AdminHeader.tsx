// components/AdminHeader.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { blogTranslations } from '../translations/blog';
import { useAdminContext } from '../../app/context/AdminContext';
import {
  LayoutDashboard,
  Edit,
  Image as ImageIcon,
  LogOut,
  FileUser,
  Calendar
} from 'lucide-react';

type AdminHeaderProps = {
  onLogout?: () => void;
};

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  const { language } = useLanguage();
  const currentPath = usePathname();
  const { user, viewMode, isEditing } = useAdminContext(); // Consume context

  return (
    <div className="z-50 bg-white shadow-md h-16 flex items-center mx-4 sm:mx-8 md:mx-80 rounded-xl">
      <div className="flex items-center justify-between w-full px-4 sm:px-8 md:px-2">

        {/* Left Side: Logo and Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-6">
          <nav className="flex items-center space-x-6 sm:space-x-2 justify-start">
            {/* Articles List Link */}
            <Link
              href="/admin"
              className={`flex items-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-150 ${currentPath === '/admin' && viewMode === 'list' // Active only if on admin page AND list view
                ? 'bg-brand/10 text-brand'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <LayoutDashboard className="h-6 w-6 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="ml-1 hidden sm:inline">{blogTranslations[language].admin.articlesList}</span>
            </Link>

            {/* Conditional Edit Article Button/Indicator */}
            {isEditing && viewMode === 'form' && (
              <span
                className={`flex items-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium bg-brand/10 text-brand cursor-default`}
              >
                <Edit className="h-6 w-6 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="ml-1 hidden sm:inline">Edit Article</span>
              </span>
            )}

            {/* Media Management Link */}
            <Link
              href="/admin/media"
              className={`flex items-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-150 ${currentPath === '/admin/media'
                ? 'bg-brand/10 text-brand'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <ImageIcon className="h-6 w-6 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="ml-1 hidden sm:inline">Media</span>
            </Link>
            {/* Media Management Link */}
            <Link
              href="/admin/positions"
              className={`flex items-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-150 ${currentPath === '/admin/positions'
                ? 'bg-brand/10 text-brand'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <FileUser className="h-6 w-6 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="ml-1 hidden sm:inline">Open Positions</span>
            </Link>
            {/* Events Management Link */}
            <Link
              href="/admin/events"
              className={`flex items-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-150 ${currentPath === '/admin/events'
                ? 'bg-brand/10 text-brand'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <Calendar className="h-6 w-6 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="ml-1 hidden sm:inline">Events</span>
            </Link>
          </nav>
        </div>

        {/* Right Side: User Info and Logout */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-500 hidden md:block">Logged in as:</p>
            <p className="text-xs sm:text-sm font-medium text-gray-800 truncate max-w-[150px] lg:max-w-[200px]" title={user?.email ?? ''}>
              {user?.email?.split('@')[0]}
            </p>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            className="flex items-center justify-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-150 border border-red-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Optional: Add a Mobile Menu Button Here if needed */}

      </div>
      {/* Optional: Mobile navigation below the main bar if needed */}
      {/* <nav className="md:hidden flex items-center space-x-2 border-t mt-2 pt-2"> ... </nav> */}
    </div>
  );
}