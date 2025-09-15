// app/blog/[id]/page.tsx
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