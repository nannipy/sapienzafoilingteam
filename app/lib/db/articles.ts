import 'server-only';
import { cache } from 'react';
import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { Article } from '@/app/lib/types';

export const getArticles = cache(async (): Promise<Article[]> => {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error.message);
    throw new Error('Failed to fetch articles');
  }

  return data || [];
});

export const getArticle = cache(async (id: string): Promise<Article | null> => {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
});

export async function createArticle(payload: Omit<Article, 'id' | 'created_at'>): Promise<Article> {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateArticle(id: string, payload: Partial<Article>): Promise<Article> {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
