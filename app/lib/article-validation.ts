import { boundedText, mediaUrl } from './admin-validation';
import type { Article } from './types';

export function articlePayload(article: Partial<Article>) {
  if (!article || typeof article !== 'object' || Array.isArray(article)) throw new Error('Articolo non valido');
  const status = article.status ?? 'draft';
  if (status !== 'draft' && status !== 'published') throw new Error('Stato articolo non valido');
  const title = boundedText(article.title ?? '', 300).trim();
  const title_en = boundedText(article.title_en ?? '', 300).trim();
  const content = boundedText(article.content ?? '', 100000);
  const content_en = boundedText(article.content_en ?? '', 100000);
  if (!title) throw new Error('Inserisci un titolo per salvare la bozza');
  if (status === 'published' && (!title_en || !content.trim() || !content_en.trim())) {
    throw new Error('Per pubblicare, completa titolo e contenuto in italiano e inglese');
  }
  return { title, title_en, content, content_en, status, image_url: mediaUrl(article.image_url), image_alt: article.image_alt == null ? null : boundedText(article.image_alt, 500) };
}
