// /app/blog/BlogClientPage.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { blogTranslations } from '../translations/blog';
import { Calendar, ArrowRight, ImageOff, Newspaper, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Article } from '../lib/types'; // Import from the new types file
import PageLayout from '../components/PageLayout';

type BlogClientPageProps = {
  articles: Article[];
};

// Format date helper hoisted outside
const formatDate = (dateString: string, language: 'en' | 'it') => {
  const date = new Date(dateString);
  return date.toLocaleDateString(language === 'en' ? 'en-US' : 'it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getTitleByLanguage = (title: string, title_en: string, language: 'en' | 'it') => {
  if (language === 'en') {
    return title_en;
  }
  return title;
};

export default function BlogClientPage({ articles }: BlogClientPageProps) {
  const { language } = useLanguage();

  return (
    <PageLayout>
      <div className="px-6 md:px-12 py-16">
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 max-w-4xl mx-auto">
            <Newspaper className="mx-auto h-20 w-20 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{blogTranslations[language].noArticles}</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              {blogTranslations[language].noArticlesDescription}
            </p>

            <div className="space-y-6">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {blogTranslations[language].followSocial}
              </p>
              <div className="flex justify-center gap-6">
                <a href="https://instagram.com/sapienzafoilingteam" target="_blank" rel="noopener noreferrer"
                  className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-[#E1306C] hover:scale-110">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://linkedin.com/company/sapienza-foiling-team" target="_blank" rel="noopener noreferrer"
                  className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-[#0077B5] hover:scale-110">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="https://facebook.com/sapienzafoilingteam" target="_blank" rel="noopener noreferrer"
                  className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-[#1877F2] hover:scale-110">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group relative flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {article.image_url ? (
                    <Image
                      src={article.image_url}
                      alt={article.image_alt || article.title || 'Blog post image'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                  ) : (
                    // Placeholder for missing image
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                      <ImageOff className="w-12 h-12 text-gray-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-8">
                  <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                    <Calendar className="w-3 h-3 mr-2 text-brand" />
                    {formatDate(article.created_at, language)}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-syne font-black mb-6 text-gray-900 group-hover:text-brand transition-colors duration-300 line-clamp-2 tracking-tight leading-tight">
                    <Link href={`/blog/${article.id}`} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {getTitleByLanguage(article.title, article.title_en, language)}
                    </Link>
                  </h2>

                  {/* Footer: Read More */}
                  <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                    <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-brand group-hover:underline">
                      {blogTranslations[language].readMore}
                      <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}