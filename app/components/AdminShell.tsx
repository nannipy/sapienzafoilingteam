'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import AdminHeader from '../components/AdminHeader';
import { AdminProvider } from '../context/AdminContext';

export default function AdminShell({ children, initialUser }: { children: React.ReactNode; initialUser: User }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        router.replace('/login');
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => authListener?.subscription.unsubscribe();
  }, [router]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/login');
  }, [router]);

  if (!user) return null;

  return (
    <AdminProvider user={user}>
      <div className="admin-shell min-h-screen bg-gray-100 text-gray-900">
        <AdminHeader onLogout={handleLogout} />
        <div className="min-w-0">{children}</div>
      </div>
    </AdminProvider>
  );
}