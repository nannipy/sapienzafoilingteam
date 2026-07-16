'use server';

import { revalidatePath } from 'next/cache';
import { Article } from '@/app/lib/types';
import { requireAuth } from '@/app/lib/supabase-server';
import {
  getArticles as dbGetArticles,
  createArticle as dbCreateArticle,
  updateArticle as dbUpdateArticle,
  deleteArticle as dbDeleteArticle,
} from '@/app/lib/db/articles';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    + `-${Date.now()}`;
}

export async function getArticles() {
  await requireAuth();
  return await dbGetArticles();
}

export async function createArticle(articleData: Partial<Article>) {
  const user = await requireAuth();

  if (!articleData.title || !articleData.content || !articleData.title_en || !articleData.content_en) {
    throw new Error('Campi obbligatori mancanti');
  }

  const data = await dbCreateArticle({
    title: articleData.title,
    slug: generateSlug(articleData.title),
    content: articleData.content,
    title_en: articleData.title_en,
    content_en: articleData.content_en,
    image_url: articleData.image_url || null,
    image_alt: articleData.image_alt || null,
    author_id: user.id,
  } as Omit<Article, 'id' | 'created_at'>);

  revalidatePath('/blog');
  revalidatePath('/admin');
  return data;
}

export async function updateArticleAction(id: string, articleData: Partial<Article>) {
  await requireAuth();

  const data = await dbUpdateArticle(id, {
    title: articleData.title,
    content: articleData.content,
    title_en: articleData.title_en,
    content_en: articleData.content_en,
    image_url: articleData.image_url || null,
    image_alt: articleData.image_alt || null,
  });

  revalidatePath('/blog');
  revalidatePath(`/blog/${id}`);
  revalidatePath('/admin');
  return data;
}

export async function deleteArticleAction(id: string) {
  await requireAuth();
  await dbDeleteArticle(id);
  revalidatePath('/blog');
  revalidatePath('/admin');
  return { success: true };
}
