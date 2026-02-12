'use server';

import { supabaseAdmin, updateOpenPosition, deleteOpenPosition, createOpenPosition as createOpenPositionDb, getOpenPositions } from '@/app/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { OpenPosition } from '@/app/lib/types';
import { requireAuth } from '@/app/lib/supabase-server';

export async function getPositions() {
    // Admin page usually requires auth, but listing positions might be public?
    // The admin page /admin/positions implies secure access.
    // However, the previous API route probably checked auth.
    // Let's add auth check for safety since it is under /admin
    await requireAuth();
    return await getOpenPositions();
}

export async function getPositionAction(id: string) {
    await requireAuth();
    const { data, error } = await supabaseAdmin!.from('open_positions').select('*').eq('id', id).single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function createPosition(positionData: Omit<OpenPosition, 'id'>) {
    await requireAuth();

    const data = await createOpenPositionDb(positionData);
    if (!data) throw new Error('Failed to create position');

    revalidatePath('/career');
    revalidatePath('/admin/positions');
    return data;
}

export async function updatePositionAction(id: string, positionData: Partial<OpenPosition>) {
    await requireAuth();

    const data = await updateOpenPosition(id, positionData);
    if (!data) throw new Error('Failed to update position');

    revalidatePath('/career');
    revalidatePath('/admin/positions');
    return data;
}

export async function deletePositionAction(id: string) {
    await requireAuth();

    const data = await deleteOpenPosition(id);
    if (!data && !supabaseAdmin) throw new Error('Failed to delete');

    revalidatePath('/career');
    revalidatePath('/admin/positions');
    return { success: true };
}
