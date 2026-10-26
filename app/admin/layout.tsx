import './globals.css';
import { requireAdmin } from '../lib/supabase-server';
import AdminShell from '../components/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return <AdminShell initialUser={user}>{children}</AdminShell>;
}
