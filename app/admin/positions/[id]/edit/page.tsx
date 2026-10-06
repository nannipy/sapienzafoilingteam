'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import PositionForm from '@/app/components/PositionForm';
import { useLanguage } from '@/app/context/LanguageContext';
import { OpenPositionParsed } from '@/app/lib/types';
import { updatePositionAction, getPositionAction } from '@/app/actions/positions';

export default function EditPositionPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [position, setPosition] = useState<OpenPositionParsed | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPositionAction(id);
        if (!data) throw new Error('Posizione non trovata');
        setPosition(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore caricamento');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(data: Omit<OpenPositionParsed, 'id'>) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await updatePositionAction(id, data);
      router.push('/admin/positions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore salvataggio');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-4xl mx-auto w-full">
    <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">{language === 'en' ? 'Edit position' : 'Modifica posizione'}</h1>
      {loading ? <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand" /> : position ? <PositionForm initialData={position} onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} /> : <p role="alert" className="text-red-600">{error}</p>}
    </div>
  </main>;
}
