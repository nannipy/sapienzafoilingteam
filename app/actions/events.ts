'use server';

import { supabaseAdmin, updateEvents, deleteEvent, getEvents } from '@/app/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { Event } from '@/app/lib/types';
import { requireAuth } from '@/app/lib/supabase-server';

export async function getEventsAction() {
    await requireAuth();
    return await getEvents();
}

export async function getEventAction(id: string) {
    await requireAuth();
    const { data, error } = await supabaseAdmin!.from('events').select('*').eq('id', id).single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function createEvent(eventData: Omit<Event, 'id' | 'created_at'>) {
    await requireAuth();

    if (!supabaseAdmin) throw new Error('Server configuration error');

    const { data, error } = await supabaseAdmin
        .from('events')
        .insert([eventData])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/events');
    revalidatePath('/'); // Home page uses events
    return data;
}

export async function updateEventAction(id: string, eventData: Partial<Event>) {
    await requireAuth();

    try {
        const data = await updateEvents(id, eventData);
        revalidatePath('/admin/events');
        revalidatePath('/');
        return data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));

    }
}

export async function deleteEventAction(id: string) {
    await requireAuth();

    const data = await deleteEvent(id);
    if (!data && !supabaseAdmin) throw new Error('Failed to delete');

    revalidatePath('/admin/events');
    revalidatePath('/');
    return { success: true };
}
