// app/blog/[id]/page.tsx

import { supabase } from '../../lib/supabase';
import { Article } from '../../lib/types';
import ArticleClientPage from './ArticleClientPage';
import { notFound } from 'next/navigation';
import { marked } from 'marked';

type Props = {
  params: { id: string };
};

// This will pre-build all blog posts at build time
export async function generateStaticParams() {
  const { data: posts } = await supabase.from('posts').select('id');
  return posts?.map(post => ({
    id: post.id.toString(),
  })) || [];
}

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

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.id);

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
