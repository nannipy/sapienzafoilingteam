// admin/layout.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react'; // Removed unused imports
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';
import AdminHeader from '../../components/AdminHeader';
// Import the Provider and hook from the new context file
import { AdminProvider } from '../../context/AdminContext';

// REMOVE Context definition and useAdminContext export from here

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // REMOVE useState for viewMode and isEditing here
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        // Check for an existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error("Error fetching session:", sessionError.message);
            // Potentially redirect or show error, but often just means no session
        }

        if (session) {
             // Verify the session server-side or check expiry if needed
             // For simplicity, we assume getSession() gives a valid one if present
             setUser(session.user);
        } else {
            // No session, redirect to login
            router.push('/auth');
            return; // Stop further execution in this effect run
        }

      } catch (error) {
        console.error('Error in auth check logic:', error);
        router.push('/auth'); // Redirect on unexpected errors
      } finally {
        setLoading(false);
      }
    };
    checkAuth();

    // Listen for auth changes (login/logout elsewhere)
    const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
            setUser(session?.user ?? null);
            if (!session) {
                // If user logs out, ensure redirect happens if not already on auth page
                // Check current route if needed before pushing
                // router.push('/auth');
            }
            // No need to setLoading here, it's for initial load
        }
    );

    // Cleanup listener on unmount
    return () => {
        authListener?.subscription.unsubscribe();
    };

  }, [router]); // Only depends on router

  const handleLogout = useCallback(async () => {
    setLoading(true); // Optional: show loading during logout
    await supabase.auth.signOut();
    // setUser(null); // Auth listener should handle this
    // Context provider will reset viewMode/isEditing based on user becoming null
    router.push('/auth');
    // setLoading(false); // Handled by redirect/unmount
  }, [router]); // Added useCallback

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <Loader2 className="animate-spin h-12 w-12 text-[#822433]" />
      </div>
    );
  }

  // If loading finished but still no user (redirect should have happened, but belts & suspenders)
  if (!user) {
     return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
             <p>Redirecting to login...</p>
             {/* Or a proper "Not Authorized" component */}
        </div>
     );
   }

  // Wrap the content with AdminProvider, passing the user
  return (
    <AdminProvider user={user}>
      <div className="min-h-screen bg-gray-100 pt-32">
        {/* Pass user explicitly if Header needs it directly, or let it use context */}
        <AdminHeader onLogout={handleLogout} />
        <div className=""> {/* Padding top matching header height */}
             {children}
        </div>
      </div>
    </AdminProvider>
  );
}