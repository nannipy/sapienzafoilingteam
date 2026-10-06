'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';
import { useAdminContext } from '@/app/context/AdminContext';
import { Event } from '@/app/lib/types';
import { eventTranslations } from '@/app/translations/event';
import { getEventsAction, deleteEventAction } from '@/app/actions/events';
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
        // Auth check is handled inside getEventsAction too, 
        // but explicit user check here is fine for UI state.
        const data = await getEventsAction();
        setEvents(data || []);
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
    if (!window.confirm(language === 'en' ? 'Delete this event permanently?' : 'Eliminare definitivamente questo evento?')) return;

    setError(null); setSuccess(null);
    try {
      await deleteEventAction(id);
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
          <Link href="/admin/events/new" className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm">
            <PlusCircle size={18} />
            {language === 'en' ? 'New event' : 'Nuovo evento'}
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-brand" />
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
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Title' : 'Titolo'}</th>
                      <th scope="col" className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Date' : 'Data'}</th>
                      <th scope="col" className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Location' : 'Luogo'}</th>
                      <th scope="col" className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Image' : 'Immagine'}</th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Actions' : 'Azioni'}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => {
                      const date = new Date(event.date);
                      const formattedDate = date.toLocaleDateString(language === 'en' ? 'en-US' : 'it-IT', { year: 'numeric', month: 'short', day: 'numeric' });
                      return (
                        <tr key={event.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 md:px-6 py-4"><div className="text-sm font-medium text-gray-900 break-words">{language === 'en' ? event.title_en : event.title}</div></td>
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
                              <Link href={`/admin/events/${event.id}/edit`} className="p-1 text-indigo-600 hover:text-indigo-800 flex items-center gap-1" title={language === 'en' ? 'Edit' : 'Modifica'}>
                                <Edit size={16} className="md:size-18" />
                                <span className="hidden md:inline">{language === 'en' ? 'Edit' : 'Modifica'}</span>
                              </Link>
                              <button onClick={() => handleDelete(event.id)} className="p-1 text-red-600 hover:text-red-800 flex items-center gap-1" title={language === 'en' ? 'Delete' : 'Elimina'}>
                                <Trash size={16} className="md:size-18" />
                                <span className="hidden md:inline">{language === 'en' ? 'Delete' : 'Elimina'}</span>
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