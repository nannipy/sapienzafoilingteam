// app/context/AdminContext.tsx
'use client';

import React, { createContext, useState, useContext, useMemo, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';

// Define the shape of the context data
interface AdminContextType {
  viewMode: 'list' | 'form';
  setViewMode: React.Dispatch<React.SetStateAction<'list' | 'form'>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null; // Include user if needed within the context value itself
}

// Create the context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Provider Component Props
interface AdminProviderProps {
    children: ReactNode;
    user: User | null; // User is passed down from the layout
}

// Provider Component
export function AdminProvider({ children, user }: AdminProviderProps) {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [isEditing, setIsEditing] = useState(false);

    // Reset view if user logs out (becomes null)
    React.useEffect(() => {
        if (user === null) {
            setViewMode('list');
            setIsEditing(false);
        }
    }, [user]);

    const contextValue = useMemo(() => ({
        viewMode,
        setViewMode,
        isEditing,
        setIsEditing,
        user // Make user available via context too
    }), [viewMode, isEditing, user]); // Add user to dependency array

    return (
        <AdminContext.Provider value={contextValue}>
            {children}
        </AdminContext.Provider>
    );
}

// Custom hook for easy consumption
export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};