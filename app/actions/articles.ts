'use server';

import { revalidatePath } from 'next/cache';
import { articlePayload } from '@/app/lib/article-validation';
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
  return await dbGetArticles(true);
}

export async function createArticle(articleData: Partial<Article>) {
  const user = await requireAuth();

  const payload = articlePayload(articleData);
  const data = await dbCreateArticle({
    ...payload,
    slug: generateSlug(payload.title),
    author_id: user.id,
  });

  revalidatePath('/blog');
  revalidatePath('/admin');
  revalidatePath('/admin/drafts');
  revalidatePath('/sitemap.xml');
  return data;
}

export async function updateArticleAction(id: string, articleData: Partial<Article>) {
  await requireAuth();

  const data = await dbUpdateArticle(id, articlePayload(articleData));

  revalidatePath('/blog');
  revalidatePath(`/blog/${id}`);
  revalidatePath('/admin');
  revalidatePath('/admin/drafts');
  revalidatePath('/sitemap.xml');
  return data;
}

export async function deleteArticleAction(id: string) {
  await requireAuth();
  await dbDeleteArticle(id);
  revalidatePath(`/blog/${id}`);
  revalidatePath('/blog');
  revalidatePath('/admin');
  revalidatePath('/admin/drafts');
  revalidatePath('/sitemap.xml');
  return { success: true };
}
