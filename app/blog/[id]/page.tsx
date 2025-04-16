'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { blogTranslations } from '../../translations/blog';
import { Calendar, ArrowLeft } from 'lucide-react';
import { marked } from 'marked';
import { useParams } from 'next/navigation';

type Article = {
  id: string;
  title: string;
  content: string;
  image_url: string;
  image_alt: string;
  created_at: string;
};

export default function ArticlePage() {
  const params = useParams<{ id: string }>(); // Get params using the hook
  const articleId = params?.id; // Extract the id, handle potential undefined
  
  const { language } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (!articleId){
      console.error("Article ID not found in params!"); 
        setLoading(false);
        setError("Article ID missing");
     return
    };

    const fetchArticle = async () => {
      try {
        setLoading(true); // Start loading
        setError(null); // Reset error
        const response = await fetch(`/api/articles/${articleId}`);
        if (!response.ok) throw new Error('Failed to fetch article');
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  // Format date
  const formatDate = (dateString: string) => {
    if(!dateString) return ''; 
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Convert markdown to HTML
  const renderMarkdown = (content: string) => {
    if (!content) return { __html: '' }; // Add guard for null/undefined content
    return { __html: marked(content) };
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pt-24 pb-16 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative  ">
        <div className="left-4 top-0 z-50">
          <Link 
            href="/blog" 
            className="inline-flex items-center bg-gray-100/80 hover:bg-[#822433] hover:text-white p-2 rounded-xl text-[#822433] transition-colors duration-200 mt-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {blogTranslations[language].backToList}
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#822433]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        ) : article ? (
          <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden mt-5">
            <div className="px-6 py-8">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-[#822433] leading-tight">{article.title}</h1>
              
              <div className="flex items-center text-gray-600 text-sm mb-10 border-b border-gray-100 pb-6">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{blogTranslations[language].publishedOn} {formatDate(article.created_at)}</span>
              </div>

              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-[#822433] prose-headings:font-bold
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-[#822433] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900
                  prose-blockquote:border-l-[#822433] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4
                  prose-code:text-[#822433] prose-code:bg-gray-50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-gray-900 prose-pre:text-gray-100
                  prose-img:rounded-lg prose-img:shadow-md
                  prose-ul:marker:text-[#822433]"
                dangerouslySetInnerHTML={renderMarkdown(article.content)}
              />
            </div>
          </article>
        ) : (
          <div className="text-center py-16 text-gray-500">
            {blogTranslations[language].admin.error}
          </div>
        )}
      </div>
    </main>
  );
}