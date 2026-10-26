'use server';

import { eventPayload } from '@/app/lib/admin-validation';
import { revalidatePath } from 'next/cache';
import { Event } from '@/app/lib/types';
import { requireAdmin } from '@/app/lib/supabase-server';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/app/lib/db/events';

export async function getEventsAction() {
  await requireAdmin();
  return await getEvents();
}

export async function getEventAction(id: string) {
  await requireAdmin();
  return await getEventById(id);
}

export async function createEventAction(eventData: Omit<Event, 'id' | 'created_at'>) {
  await requireAdmin();
  const data = await createEvent(eventPayload(eventData));
  revalidatePath('/admin/events');
  revalidatePath('/');
  return data;
}

export async function updateEventAction(id: string, eventData: Partial<Event>) {
  await requireAdmin();
  const data = await updateEvent(id, eventPayload(eventData, true));
  revalidatePath('/admin/events');
  revalidatePath('/');
  return data;
}

export async function deleteEventAction(id: string) {
  await requireAdmin();
  await deleteEvent(id);
  revalidatePath('/admin/events');
  revalidatePath('/');
  return { success: true };
}
