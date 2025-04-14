'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';
import AdminPanel from '../../components/AdminPanel';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.push('/auth');
          return;
        }
        setUser(data.session.user);
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (!user && loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <Loader2 className="animate-spin h-12 w-12 text-[#822433]" />
      </div>
    );
  }
  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth'); // Redirect to login page after logout
  };

  return (
    <AdminPanel
      user={user}
      viewMode="list"
      isEditing={false}
      onViewModeChange={() => {}}
      onLogout={handleLogout}
    >
      {children}
    </AdminPanel>
  );
}