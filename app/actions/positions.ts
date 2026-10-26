'use server';

import { positionPayload } from '@/app/lib/admin-validation';
import { revalidatePath } from 'next/cache';
import { OpenPositionParsed } from '@/app/lib/types';
import { requireAdmin } from '@/app/lib/supabase-server';
import {
  getOpenPositions,
  getOpenPositionById,
  createOpenPosition,
  updateOpenPosition,
  deleteOpenPosition,
} from '@/app/lib/db/positions';

export async function getPositions() {
  await requireAdmin();
  return await getOpenPositions();
}

export async function getPositionAction(id: string) {
  await requireAdmin();
  return await getOpenPositionById(id);
}

export async function createPositionAction(positionData: Omit<OpenPositionParsed, 'id' | 'created_at'>) {
  await requireAdmin();
  const data = await createOpenPosition(positionPayload(positionData));
  revalidatePath('/career');
  revalidatePath('/admin/positions');
  return data;
}

export async function updatePositionAction(id: string, positionData: Partial<Omit<OpenPositionParsed, 'id' | 'created_at'>>) {
  await requireAdmin();
  const data = await updateOpenPosition(id, positionPayload(positionData, true));
  revalidatePath('/career');
  revalidatePath('/admin/positions');
  return data;
}

export async function deletePositionAction(id: string) {
  await requireAdmin();
  await deleteOpenPosition(id);
  revalidatePath('/career');
  revalidatePath('/admin/positions');
  return { success: true };
}
