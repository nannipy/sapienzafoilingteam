import 'server-only';

import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { Article } from '@/app/lib/types';

export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Article[];
}

export async function getArticleById(id: string): Promise<Article> {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data as Article;
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw new Error(error.message);
  return data as Article;
}

export async function createArticle(
  payload: Omit<Article, 'id' | 'created_at'>
): Promise<Article> {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Article;
}

export async function updateArticle(
  id: string,
  payload: Partial<Omit<Article, 'id' | 'created_at'>>
): Promise<Article> {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Article;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
