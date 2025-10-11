'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';
import { supabase } from '@/app/lib/supabase';
import { useAdminContext } from '@/app/context/AdminContext';
import { Event } from '@/app/lib/types';
import { eventTranslations } from '@/app/translations/event';
import { Edit, Trash, PlusCircle, Loader2, ImageIcon, XCircle } from 'lucide-react';

export default function EventAdminPage() {
  const { language } = useLanguage();
  const { user } = useAdminContext();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) {
        setLoading(false);
        setEvents([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const session = (await supabase.auth.getSession()).data.session;
        if (!session) {
          throw new Error('Session not found, cannot fetch events.');
        }
        const response = await fetch('/api/events', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load events';
        console.error('Error fetching events:', error);
        setError(message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user]);

  const handleDelete = async (id: string) => {
    // Custom confirmation dialog logic
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]';
    confirmDialog.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
            <p class="text-gray-600 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
            <div class="flex justify-end gap-4">
                <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg" id="cancelDelete">Cancel</button>
                <button class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg" id="confirmDelete">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmDialog);

    const dialogResult = new Promise((resolve) => {
        document.getElementById('confirmDelete')?.addEventListener('click', () => {
            if (confirmDialog.parentNode) document.body.removeChild(confirmDialog);
            resolve(true);
        });
        document.getElementById('cancelDelete')?.addEventListener('click', () => {
             if (confirmDialog.parentNode) document.body.removeChild(confirmDialog);
            resolve(false);
        });
    });

    if (!(await dialogResult)) return;

    setError(null); setSuccess(null);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error("User session not found.");

      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (!response.ok) throw new Error((await response.json()).error || 'Failed to delete event');
      
      setEvents(events.filter(a => a.id !== id));
      setSuccess(eventTranslations[language].admin.deleteSuccess);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : eventTranslations[language].admin.error;
      console.error('Error deleting event:', error);
      setError(message);
    }
  };

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="min-h-[10px] mb-4 md:mb-6">
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                    <XCircle size={16} />
                </button>
            </div>
        )}
        {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm flex items-center justify-between">
                 <span>{success}</span>
                <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
                    <XCircle size={16} />
                </button>
            </div>
        )}
      </div>

      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-md border border-gray-200 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
          <h1 className="text-2xl font-semibold text-gray-800">
            {eventTranslations[language].admin.eventsList}
          </h1>
          <Link href="/admin/events/new" className="px-4 py-2 bg-[#822433] text-white rounded-lg hover:bg-[#6d1f2b] transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm">
              <PlusCircle size={18} />
              Create New
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-[#822433]" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500 py-12">{eventTranslations[language].noEvents}</p>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th scope="col" className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th scope="col" className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => {
                      const date = new Date(event.date);
                      const formattedDate = date.toLocaleDateString(language === 'en' ? 'en-US' : 'it-IT', { year: 'numeric', month: 'short', day: 'numeric' });
                      return (
                        <tr key={event.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 md:px-6 py-4"><div className="text-sm font-medium text-gray-900 truncate max-w-[150px] md:max-w-none">{language === 'en' ? event.title_en : event.title}</div></td>
                          <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{formattedDate}</div></td>
                          <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{event.location}</div></td>
                          <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                            {event.image_url ? (
                              <NextImage src={event.image_url} alt={event.image_alt || 'Event image'} width={60} height={40} className="h-10 w-auto object-contain rounded" />
                            ) : (
                              <div className="h-10 w-15 flex items-center justify-center bg-gray-100 rounded text-gray-400"><ImageIcon size={20} /></div>
                            )}
                          </td>
                          <td className="px-4 md:px-6 py-4 text-right text-sm font-medium">
                            <div className="flex justify-end items-center gap-2">
                              <Link href={`/admin/events/${event.id}/edit`} className="p-1 text-indigo-600 hover:text-indigo-800 flex items-center gap-1" title="Edit">
                                <Edit size={16} className="md:size-18" />
                                <span className="hidden md:inline">Edit</span>
                              </Link>
                              <button onClick={() => handleDelete(event.id)} className="p-1 text-red-600 hover:text-red-800 flex items-center gap-1" title="Delete">
                                <Trash size={16} className="md:size-18" />
                                <span className="hidden md:inline">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}