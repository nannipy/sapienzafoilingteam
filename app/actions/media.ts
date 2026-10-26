'use server';

import { requireAdmin } from '@/app/lib/supabase-server';
import { supabaseAdmin } from '@/app/lib/supabase-admin';

export async function getMediaItems(path: string) {
  await requireAdmin();
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

function validMediaPath(path: unknown): asserts path is string {
  if (typeof path !== 'string' || !path || path.length > 500 || path.startsWith('/') || /[\\\u0000-\u001f]/.test(path) || path.split('/').some(p => !p || p === '.' || p === '..')) throw new Error('Percorso media non valido');
}

export async function uploadMedia(form: FormData) {
  await requireAdmin();
  const path = form.get('path');
  validMediaPath(path);
  const file = form.get('file');
  if (!(file instanceof File) || file.size < 1 || file.size > 4 * 1024 * 1024) throw new Error('File non valido (massimo 4 MB)');
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf'].includes(file.type)) throw new Error('Tipo media non supportato');
  if (file.type === 'application/pdf') {
    if (bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error('PDF non valido');
  } else {
    const sharp = (await import('sharp')).default;
    const metadata = await sharp(bytes, { limitInputPixels: 40000000 }).metadata();
    const expected = { 'image/png': 'png', 'image/jpeg': 'jpeg', 'image/gif': 'gif', 'image/webp': 'webp' }[file.type];
    if (!expected || metadata.format !== expected) throw new Error('Contenuto immagine non valido');
  }
  const { data, error } = await supabaseAdmin.storage.from('images').upload(path, bytes, { contentType: file.type, upsert: false });
  return { data, error: error ? { message: 'Caricamento media non riuscito' } : null };
}

export async function createMediaFolder(path: string) {
  await requireAdmin();
  validMediaPath(path);
  if (!path.endsWith('/.emptyFolderPlaceholder')) throw new Error('Cartella non valida');
  const { data, error } = await supabaseAdmin.storage.from('images').upload(path, new Uint8Array(), { contentType: 'text/plain', upsert: false });
  return { data, error: error ? { message: 'Creazione cartella non riuscita' } : null };
}

export async function moveMedia(from: string, to: string) {
  await requireAdmin();
  validMediaPath(from); validMediaPath(to);
  const { data, error } = await supabaseAdmin.storage.from('images').move(from, to);
  return { data, error: error ? { message: 'Spostamento media non riuscito' } : null };
}

export async function removeMedia(paths: string[]) {
  await requireAdmin();
  if (!Array.isArray(paths) || paths.length > 1000) throw new Error('Elenco media non valido');
  paths.forEach(validMediaPath);
  const { data, error } = await supabaseAdmin.storage.from('images').remove(paths);
  return { data, error: error ? { message: 'Eliminazione media non riuscita' } : null };
}
