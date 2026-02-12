// app/blog/page.tsx
import { createSupabaseServerClient } from '../lib/supabase-server';
import BlogClientPage from './BlogClientPage';
import { Article } from '../lib/types';

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
    // In a real app, you might want to show a specific error page.
    // Throwing an error will be caught by the nearest error.js/tsx boundary.
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
