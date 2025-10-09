'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { Edit, Trash, PlusCircle, Loader2 } from 'lucide-react';
import { OpenPosition } from '../../lib/types';

export default function PositionsAdminPage() {
  const [positions, setPositions] = useState<OpenPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/positions');
        if (!response.ok) throw new Error('Failed to fetch positions');
        const data = await response.json();
        setPositions(data);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load positions';
        console.error('Error fetching positions:', error);
        setError(message);
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this position?')) {
      try {
        const session = (await supabase.auth.getSession()).data.session;
        if (!session) throw new Error('User session not found.');

        const response = await fetch(`/api/positions/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });

        if (!response.ok) throw new Error('Failed to delete position');

        setPositions(positions.filter(p => p.id !== id));
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        console.error('Error deleting position:', error);
        setError(message);
      }
    }
  };

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-md border border-gray-200 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
          <h1 className="text-2xl font-semibold text-gray-800">Open Positions</h1>
          <Link href="/admin/positions/new">
            <button className="px-4 py-2 bg-[#822433] text-white rounded-lg hover:bg-[#6d1f2b] transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm">
              <PlusCircle size={18} />
              Create New
            </button>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-[#822433]" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-12">{error}</p>
        ) : positions.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No open positions found.</p>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th scope="col" className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th scope="col" className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {positions.map((position) => (
                      <tr key={position.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 md:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] md:max-w-none">{position.title}</div>
                        </td>
                        <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{position.location}</div>
                        </td>
                        <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{position.type}</div>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end items-center gap-2">
                            <Link href={`/admin/positions/${position.id}/edit`} className="p-1 text-indigo-600 hover:text-indigo-800 flex items-center gap-1" title="Edit">
                              <Edit size={16} className="md:size-18" />
                              <span className="hidden md:inline">Edit</span>
                            </Link>
                            <button onClick={() => handleDelete(position.id)} className="p-1 text-red-600 hover:text-red-800 flex items-center gap-1" title="Delete">
                              <Trash size={16} className="md:size-18" />
                              <span className="hidden md:inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
