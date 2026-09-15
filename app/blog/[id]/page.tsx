import type { Metadata } from 'next';
import { supabase } from '../../lib/supabase';
import { Article } from '../../lib/types';
import ArticleClientPage from './ArticleClientPage';
import { notFound } from 'next/navigation';
import { marked } from 'marked';

async function getArticle(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
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
  // Await the params Promise to get the actual parameters
  const { id } = await params;
  
  const article = await getArticle(id);
  
  if (!article) {
    notFound(); // Triggers the not-found page
  }

  // Render markdown to HTML on the server
  const contentHtml = await marked(article.content || '');
  const contentEnHtml = await marked(article.content_en || '');

  const articleWithHtml = {
      ...article,
      content: contentHtml,
      content_en: contentEnHtml
  }

  return <ArticleClientPage article={articleWithHtml} />;
}