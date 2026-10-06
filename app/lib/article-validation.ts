import type { Article } from './types';

export function articlePayload(article: Partial<Article>) {
  const status = article.status ?? 'draft';
  if (status !== 'draft' && status !== 'published') throw new Error('Stato articolo non valido');
  const title = article.title?.trim() || '';
  const title_en = article.title_en?.trim() || '';
  const content = article.content || '';
  const content_en = article.content_en || '';
  if (!title) throw new Error('Inserisci un titolo per salvare la bozza');
  if (status === 'published' && (!title_en || !content.trim() || !content_en.trim())) {
    throw new Error('Per pubblicare, completa titolo e contenuto in italiano e inglese');
  }
  return { title, title_en, content, content_en, status, image_url: article.image_url || null, image_alt: article.image_alt || null };
}
