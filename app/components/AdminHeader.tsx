'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, FilePenLine, Image as ImageIcon, LogOut, FileUser, Calendar, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdminContext } from '../context/AdminContext';

export default function AdminHeader({ onLogout }: { onLogout?: () => void }) {
  const path = usePathname();
  const { user, setViewMode, setIsEditing } = useAdminContext();
  const { language, setLanguage } = useLanguage();
  const en = language === 'en';
  const links = [
    { href: '/admin', label: en ? 'Articles' : 'Articoli', icon: FileText },
    { href: '/admin/drafts', label: en ? 'Drafts' : 'Bozze', icon: FilePenLine },
    { href: '/admin/media', label: 'Media', icon: ImageIcon },
    { href: '/admin/positions', label: en ? 'Open positions' : 'Posizioni aperte', icon: FileUser },
    { href: '/admin/events', label: en ? 'Events' : 'Eventi', icon: Calendar },
  ];
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex min-h-20 items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">Sapienza Foiling Team</p>
            <p className="mt-1 text-lg font-semibold">{en ? 'Administration' : 'Amministrazione'}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden max-w-40 truncate text-sm text-gray-500 lg:block">{user?.email}</span>
            <button type="button" onClick={() => setLanguage(en ? 'it' : 'en')} className="rounded-lg border px-3 text-sm" aria-label={en ? 'Switch to Italian' : 'Passa a inglese'}>{en ? 'IT' : 'EN'}</button>
            <Link href="/" className="hidden items-center gap-1 rounded-lg border px-3 text-sm sm:flex">{en ? 'View site' : 'Vai al sito'}<ArrowUpRight size={16} /></Link>
            <button type="button" onClick={onLogout} className="flex items-center gap-2 rounded-lg border px-3 text-sm text-gray-600" aria-label={en ? 'Log out' : 'Esci'}><LogOut size={16} /><span className="hidden sm:inline">{en ? 'Log out' : 'Esci'}</span></button>
          </div>
        </div>
        <nav aria-label={en ? 'Administration navigation' : 'Navigazione amministrazione'} className="flex flex-wrap gap-1 pb-3">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? path === href : path.startsWith(href);
            return <Link key={href} href={href} onClick={() => { setViewMode('list'); setIsEditing(false); }} aria-current={active ? 'page' : undefined} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${active ? 'bg-brand/10 text-brand' : 'text-gray-600 hover:bg-gray-50'}`}><Icon size={18} />{label}</Link>;
          })}
        </nav>
      </div>
    </header>
  );
}
