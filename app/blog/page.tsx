import type { Metadata } from 'next';
import { createSupabaseServerClient } from '../lib/supabase-server';
import BlogClientPage from './BlogClientPage';
import { Article } from '../lib/types';

export const metadata: Metadata = {
  title: 'Blog & Notizie',
  description: 'Articoli, resoconti di regata della SuMoth Challenge, aggiornamenti tecnici e storie dal cantiere del Sapienza Foiling Team.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog & Notizie | Sapienza Foiling Team',
    description: 'Articoli e aggiornamenti sul progetto foiling di Sapienza Università di Roma.',
    url: 'https://sapienzafoilingteam.com/blog',
  },
};

// Revalidate the page every hour to keep content fresh without a full rebuild
export const revalidate = 3600;


async function getArticles(): Promise<Article[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error.message);
    throw new Error('Failed to fetch articles');
  }

  return data || [];
}

export default async function BlogPage() {
  // Fetch articles on the server
  const articles = await getArticles();

  // Render the client component with the fetched data
  return <BlogClientPage articles={articles} />;
}
