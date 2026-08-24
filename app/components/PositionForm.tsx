'use client';

import React, { useState, useEffect } from 'react';
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
  const [title, setTitle] = useState(initialData?.title || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [type, setType] = useState(initialData?.type || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [requirements, setRequirements] = useState(initialData?.requirements.join('\n') || '');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setLocation(initialData.location);
      setType(initialData.type);
      setDescription(initialData.description);
      setRequirements(initialData.requirements.join('\n'));
    }
  }, [initialData]);

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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
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
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
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
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
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
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
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
        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Requirements (one per line)</label>
        <textarea
          id="requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={7}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand text-white p-3 rounded-md hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Save Position'}
      </button>
    </form>
  );
};

export default PositionForm;
