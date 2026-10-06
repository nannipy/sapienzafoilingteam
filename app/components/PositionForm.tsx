'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import React, { useState } from 'react';
import { OpenPositionParsed } from '../lib/types';

interface PositionFormProps {
  initialData?: OpenPositionParsed | null;
  onSubmit: (data: Omit<OpenPositionParsed, 'id'>) => void;
  isSubmitting: boolean;
  error: string | null;
}

const PositionForm: React.FC<PositionFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const { language } = useLanguage();
  const en = language === 'en';
  const [title, setTitle] = useState(initialData?.title || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [type, setType] = useState(initialData?.type || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [requirements, setRequirements] = useState(initialData?.requirements.join('\n') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      location,
      type,
      description,
      requirements: requirements.split('\n').filter((r) => r.trim() !== ''),
      created_at: initialData?.created_at || new Date().toISOString(),
      order_index: initialData?.order_index || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">{en ? 'Title' : 'Titolo'}</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">{en ? 'Location' : 'Luogo'}</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">{en ? 'Type' : 'Tipo'}</label>
        <input
          type="text"
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">{en ? 'Description' : 'Descrizione'}</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">{en ? 'Requirements (one per line)' : 'Requisiti (uno per riga)'}</label>
        <textarea
          id="requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={7}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      {error && <p role="alert" className="text-red-500 text-sm">{error}</p>}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
      <Link href="/admin/positions" className="flex items-center justify-center rounded-lg border px-4 py-2 text-sm">{en ? "Back to list" : "Torna alla lista"}</Link>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 bg-brand text-white p-3 rounded-md hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (en ? 'Saving…' : 'Salvataggio…') : (en ? 'Save position' : 'Salva posizione')}
      </button>
      </div>
    </form>
  );
};

export default PositionForm;
