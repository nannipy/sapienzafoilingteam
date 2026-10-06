'use server';

import { requireAuth } from '@/app/lib/supabase-server';
import { supabaseAdmin } from '@/app/lib/supabase-admin';

export async function getMediaItems(path: string) {
  await requireAuth();
  if (typeof path !== 'string' || path.split('/').some(part => part === '..' || part === '.')) {
    throw new Error('Percorso media non valido');
  }
  const items = [];
  // Storage limits each request; fetch every page so large folders stay complete.
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await supabaseAdmin.storage.from('images').list(path, {
      limit: 100, offset, sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw new Error(`Impossibile caricare i media: ${error.message}`);
    items.push(...(data || []));
    if (!data || data.length < 100) break;
  }
  return items;
}
