// app/blog/[id]/ArticleClientPage.tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { blogTranslations } from '../../translations/blog';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Article } from '../../lib/types'; // Using the shared type
import posthog from 'posthog-js';
import ShareButtons from '../../components/ShareButtons';

const calculateReadingTime = (content: string) => {
  if (!content) return 0;
  const wordsPerMinute = 200;
  // The content is now HTML, so this logic is still needed to strip tags for word count.
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};

export default function ArticleClientPage({ article }: { article: Article }) {
  const { language } = useLanguage();

  useEffect(() => {
    if (article) {
      // The content passed to calculateReadingTime should be the HTML content,
      // as the function strips HTML tags.
      const readingTime = calculateReadingTime(language === 'en' ? article.content_en : article.content);
      posthog.capture('blog_post_viewed', {
        post_id: article.id,
        post_title: article.title,
        reading_time: readingTime
      });
    }
  }, [article, language]);

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

  const contentToRender = language === 'en' ? article.content_en : article.content;

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
              dangerouslySetInnerHTML={{ __html: contentToRender }}
            />
            <ShareButtons articleId={article.id} articleTitle={article.title} />
          </div>
        </article>
      </div>
    </main>
  );
}
