import 'server-only';

import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { Event } from '@/app/lib/types';

export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*');

  if (error) throw new Error(error.message);
  return data;
}

export async function getEventById(id: string): Promise<Event> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createEvent(payload: Omit<Event, 'id' | 'created_at'>): Promise<Event> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateEvent(id: string, payload: Partial<Event>): Promise<Event> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
