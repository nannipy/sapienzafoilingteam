import 'server-only';

import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { OpenPositionParsed, parseOpenPosition } from '@/app/lib/types';

export async function getOpenPositions(): Promise<OpenPositionParsed[]> {
  const { data, error } = await supabaseAdmin
    .from('open_positions')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw new Error(error.message);
  return data.map(parseOpenPosition);
}

export async function getOpenPositionById(id: string): Promise<OpenPositionParsed> {
  const { data, error } = await supabaseAdmin
    .from('open_positions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return parseOpenPosition(data);
}

export async function createOpenPosition(
  position: Omit<OpenPositionParsed, 'id' | 'created_at'>
): Promise<OpenPositionParsed> {
  const { data, error } = await supabaseAdmin
    .from('open_positions')
    .insert([{ ...position, requirements: JSON.stringify(position.requirements) }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return parseOpenPosition(data);
}

export async function updateOpenPosition(
  id: string,
  position: Partial<Omit<OpenPositionParsed, 'id' | 'created_at'>>
): Promise<OpenPositionParsed> {
  const payload: Record<string, unknown> = { ...position };
  if (Array.isArray(payload.requirements)) {
    payload.requirements = JSON.stringify(payload.requirements);
  }

  const { data, error } = await supabaseAdmin
    .from('open_positions')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return parseOpenPosition(data);
}

export async function deleteOpenPosition(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('open_positions')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
