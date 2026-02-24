// /app/blog/BlogClientPage.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { blogTranslations } from '../translations/blog';
import { Calendar, ArrowRight, MessageSquare, ImageOff, Newspaper } from 'lucide-react';
import { Article } from '../lib/types'; // Import from the new types file
import PageHero from '../components/PageHero';

type BlogClientPageProps = {
  articles: Article[];
};

export default function BlogClientPage({ articles }: BlogClientPageProps) {
  const { language } = useLanguage();

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const titlelanguage = (title: string, title_en: string) => {
    if (language === 'en') {
      return title_en;
    }
    return title;
  };

  return (
    <main className="min-h-screen bg-brand-dark">
      {/* Hero Section */}
      <PageHero
        title={blogTranslations[language].title}
        Icon={Newspaper}
      />

      <div className="relative -mt-20 z-10 mx-4">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[600px] pb-10">

          {/* Main Content */}
          <div className="px-6 md:px-12 py-16">
            {articles.length === 0 ? (
              <div className="text-center py-16">
                <Newspaper className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-xl font-semibold text-gray-700 mb-2">{blogTranslations[language].noArticles}</p>

              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="group relative flex flex-col bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border border-gray-100"
                  >
                    {/* Image Section */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                      {article.image_url ? (
                        <Image
                          src={article.image_url}
                          alt={article.image_alt || article.title || 'Blog post image'}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                        />
                      ) : (
                        // Placeholder for missing image
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <ImageOff className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-grow p-5 md:p-6">
                      {/* Title */}
                      <h2 className="text-lg md:text-xl font-semibold mb-3 text-gray-800 group-hover:text-[#822433] transition-colors duration-200 line-clamp-2">
                        {/* Link wraps the title for better click target */}
                        <Link href={`/blog/${article.id}`} className="focus:outline-none">
                          <span className="absolute inset-0" aria-hidden="true" /> {/* Makes the whole card clickable */}
                          {titlelanguage(article.title, article.title_en)}
                        </Link>
                      </h2>



                      {/* Footer: Date and Read More */}
                      <div className="mt-auto flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          <span>{formatDate(article.created_at)}</span>
                        </div>
                        {/* "Read More" visually enhanced */}
                        <span className="inline-flex items-center font-medium text-[#822433] group-hover:underline">
                          {blogTranslations[language].readMore}
                          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-24" />
    </main>
  );
}