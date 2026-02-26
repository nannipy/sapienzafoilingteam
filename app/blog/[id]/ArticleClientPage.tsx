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
import DOMPurify from 'isomorphic-dompurify';

const calculateReadingTime = (content: string) => {
  if (!content) return 0;
  const wordsPerMinute = 200;
  // Use isomorphic-dompurify to strip HTML tags safely
  const text = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const contentToRender = language === 'en' ? article.content_en : article.content;
  // Sanitize the HTML content before rendering to prevent XSS attacks.
  // DOMPurify is used on the client-side just before rendering the content.
  const sanitizedContent = DOMPurify.sanitize(contentToRender);

  return (
    <main className="min-h-screen bg-[#fffcfd] text-[#1a1718] pt-32 pb-24 ">
      <div className="container mx-auto px-6 lg:px-8 relative ">
        <div className="mb-12 max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-bold tracking-widest uppercase text-brand hover:text-brand-dark transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            {blogTranslations[language].backToList}
          </Link>
        </div>

        <article className="max-w-3xl mx-auto mt-8">
          <header className="mb-16">
            <h1 className="text-4xl md:text-6xl font-syne font-black mb-8 text-brand-dark leading-[1.1] tracking-tighter break-words overflow-wrap-anywhere">
              {language === 'en' ? article.title_en : article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <Calendar className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-brand" />
                <span>{formatDate(article.created_at)}</span>
              </div>
            </div>
          </header>

          <div
            className="prose prose-xl max-w-none
              prose-headings:font-syne prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-brand-dark
              prose-p:text-gray-800 prose-p:leading-relaxed prose-p:mb-8
              prose-a:text-brand prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-black prose-strong:font-black
              prose-blockquote:border-l-4 prose-blockquote:border-brand prose-blockquote:bg-brand/5 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-xl
              prose-code:text-brand prose-code:bg-brand/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:font-bold
              prose-pre:bg-void prose-pre:text-gray-100 prose-pre:rounded-2xl prose-pre:p-6
              prose-img:rounded-3xl prose-img:shadow-2xl
              prose-ul:marker:text-brand prose-ul:marker:font-bold"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
          <div className="mt-20 pt-10 border-t border-gray-100">
            <ShareButtons articleId={article.id} articleTitle={article.title} />
          </div>
        </article>
      </div>
    </main>
  );
}
