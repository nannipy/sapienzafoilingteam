import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { OpenPosition } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// This is a server-only module.
// It is safe to use the service role key here.
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Only create the admin client on the server side
const createAdminClient = () => {
  if (supabaseServiceRoleKey) {
    return createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  // In a real app, you might want to throw an error here
  // if the service role key is not available.
  // For this example, we return null.
  return null;
};

export const supabaseAdmin = createAdminClient();

export async function getOpenPositions() {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin.from('open_positions').select('*').order('order_index', { ascending: true });
  if (error) {
    console.error('Error fetching open positions:', error);
    return [];
  }
  return data;
}

export async function getOpenPosition(id: string) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.from('open_positions').select('*').eq('id', id).single();
  if (error) {
    console.error(`Error fetching open position with id ${id}:`, error);
    return null;
  }
  return data;
}

export async function createOpenPosition(position: Omit<OpenPosition, 'id'>) {
  if (!supabaseAdmin) return null;
  const { requirements, ...rest } = position;
  const { data, error } = await supabaseAdmin.from('open_positions').insert([{ ...rest, requirements: JSON.stringify(requirements) }]).single();
  if (error) {
    console.error('Error creating open position:', error);
    return null;
  }
  return data;
}

export async function updateOpenPosition(id: string, position: Partial<OpenPosition>) {
  if (!supabaseAdmin) return null;
  // Usa Partial<OpenPosition> direttamente invece di Record<string, any>
  const updatePayload: Partial<OpenPosition> = { ...position };
  
  // Gestisci la conversione delle requirements
  if ('requirements' in updatePayload && Array.isArray(updatePayload.requirements)) {
    updatePayload.requirements = JSON.stringify(updatePayload.requirements) as unknown as string[];
  }
  
  const { data, error } = await supabaseAdmin.from('open_positions').update(updatePayload).eq('id', id).single();
  if (error) {
    console.error(`Error updating open position with id ${id}:`, error);
    return null;
  }
  return data;
}

export async function deleteOpenPosition(id: string) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.from('open_positions').delete().eq('id', id);
  if (error) {
    console.error(`Error deleting open position with id ${id}:`, error);
    return null;
  }
  return data;
}
