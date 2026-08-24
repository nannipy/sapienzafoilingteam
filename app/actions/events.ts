'use server';

import { revalidatePath } from 'next/cache';
import { Event } from '@/app/lib/types';
import { requireAuth } from '@/app/lib/supabase-server';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/app/lib/db/events';

export async function getEventsAction() {
  await requireAuth();
  return await getEvents();
}

export async function getEventAction(id: string) {
  await requireAuth();
  return await getEventById(id);
}

export async function createEventAction(eventData: Omit<Event, 'id' | 'created_at'>) {
  await requireAuth();
  const data = await createEvent(eventData);
  revalidatePath('/admin/events');
  revalidatePath('/');
  return data;
}

export async function updateEventAction(id: string, eventData: Partial<Event>) {
  await requireAuth();
  const data = await updateEvent(id, eventData);
  revalidatePath('/admin/events');
  revalidatePath('/');
  return data;
}

export async function deleteEventAction(id: string) {
  await requireAuth();
  await deleteEvent(id);
  revalidatePath('/admin/events');
  revalidatePath('/');
  return { success: true };
}
