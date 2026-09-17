import type { Metadata } from 'next';
import { getArticle, getArticles } from '@/app/lib/db/articles';
import { Article } from '../../lib/types';
import ArticleClientPage from './ArticleClientPage';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const articles = await getArticles();
    return articles.map((article) => ({ id: article.id }));
  } catch (error) {
    console.error('Error generating static params for articles:', error);
    return [];
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return {
      title: 'Articolo non trovato',
    };
  }

  const title = article.title || 'Articolo';
  const description = article.title_en || (article.content ? article.content.slice(0, 160).replace(/[#*`_]/g, '').trim() : 'Articolo dal blog del Sapienza Foiling Team.');
  const canonicalUrl = `https://sapienzafoilingteam.com/blog/${id}`;

  return {
    title: `${title} | Sapienza Foiling Team`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Sapienza Foiling Team`,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.created_at,
      images: article.image_url ? [{ url: article.image_url, alt: title }] : [{ url: '/images/hero-01.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Sapienza Foiling Team`,
      description,
      images: article.image_url ? [article.image_url] : ['/images/hero-01.jpg'],
    },
  };
}

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const article = await getArticle(id);
  
  if (!article) {
    notFound();
  }

  // Render markdown to HTML and sanitize safely on the server
  const rawHtml = await marked(article.content || '');
  const rawHtmlEn = await marked(article.content_en || '');

  const sanitizedContent = DOMPurify.sanitize(rawHtml);
  const sanitizedContentEn = DOMPurify.sanitize(rawHtmlEn);

  const calculateReadingTime = (html: string) => {
    if (!html) return 0;
    const text = html.replace(/<[^>]*>/g, ' ').trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return Math.ceil(wordCount / 200);
  };

  const readingTime = calculateReadingTime(sanitizedContent);
  const readingTimeEn = calculateReadingTime(sanitizedContentEn);

  const articleWithHtml: Article = {
    ...article,
    content: sanitizedContent,
    content_en: sanitizedContentEn,
  };

  return (
    <ArticleClientPage
      article={articleWithHtml}
      readingTime={readingTime}
      readingTimeEn={readingTimeEn}
    />
  );
}