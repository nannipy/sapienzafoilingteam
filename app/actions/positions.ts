'use server';

import { revalidatePath } from 'next/cache';
import { OpenPositionParsed } from '@/app/lib/types';
import { requireAuth } from '@/app/lib/supabase-server';
import {
  getOpenPositions,
  getOpenPositionById,
  createOpenPosition,
  updateOpenPosition,
  deleteOpenPosition,
} from '@/app/lib/db/positions';

export async function getPositions() {
  await requireAuth();
  return await getOpenPositions();
}

export async function getPositionAction(id: string) {
  await requireAuth();
  return await getOpenPositionById(id);
}

export async function createPositionAction(positionData: Omit<OpenPositionParsed, 'id' | 'created_at'>) {
  await requireAuth();
  const data = await createOpenPosition(positionData);
  revalidatePath('/career');
  revalidatePath('/admin/positions');
  return data;
}

export async function updatePositionAction(id: string, positionData: Partial<Omit<OpenPositionParsed, 'id' | 'created_at'>>) {
  await requireAuth();
  const data = await updateOpenPosition(id, positionData);
  revalidatePath('/career');
  revalidatePath('/admin/positions');
  return data;
}

export async function deletePositionAction(id: string) {
  await requireAuth();
  await deleteOpenPosition(id);
  revalidatePath('/career');
  revalidatePath('/admin/positions');
  return { success: true };
}
