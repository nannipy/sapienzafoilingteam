import './globals.css';
import { requireAuth } from '../lib/supabase-server';
import AdminShell from '../components/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();
  return <AdminShell initialUser={user}>{children}</AdminShell>;
}
