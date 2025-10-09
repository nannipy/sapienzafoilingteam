'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function EditPositionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosition = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/positions/${id}`);
        if (!response.ok) throw new Error('Failed to fetch position');
        const data = await response.json();
        const parsedRequirements = typeof data.requirements === 'string' ? JSON.parse(data.requirements) : data.requirements;
        setTitle(data.title);
        setLocation(data.location);
        setType(data.type);
        setDescription(data.description);
        setRequirements(Array.isArray(parsedRequirements) ? parsedRequirements.join('\n') : '');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        console.error('Error fetching position:', error);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosition();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error('User session not found.');

      const response = await fetch(`/api/positions/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            title,
            location,
            type,
            description,
            requirements: requirements.split('\n'),
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update position');

      router.push('/admin/positions');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      console.error('Error updating position:', error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-4xl mx-auto w-full">
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-[#822433]" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-4xl mx-auto w-full">
        <p className="text-center text-red-500 py-12">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-4xl mx-auto w-full">
      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-md border border-gray-200 text-black">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Position</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <input
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Requirements (one per line)</label>
            <textarea
              id="requirements"
              rows={6}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#822433] text-white rounded-lg hover:bg-[#6d1f2b] transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              Update Position
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
