'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PositionForm from '../../../components/PositionForm';
import { OpenPosition } from '../../../lib/types';
import { supabase } from '../../../lib/supabase';

export default function CreatePositionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: Omit<OpenPosition, 'id'>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error('User session not found.');

      const response = await fetch('/api/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create position');
      }

      router.push('/admin/positions');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-4xl mx-auto w-full">
      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-md border border-gray-200 animate-fade-in">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create New Open Position</h1>
        <PositionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} />
      </div>
    </main>
  );
}