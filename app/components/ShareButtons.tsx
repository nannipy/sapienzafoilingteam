'use client';

import React from 'react';
import { Facebook, Linkedin, Instagram } from 'lucide-react';
import posthog from 'posthog-js';
import { Button } from '@sft/design-system';
import { useLanguage } from '../context/LanguageContext';

interface ShareButtonsProps {
  articleId: string;
  articleTitle: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ articleId, articleTitle }) => {
  const {language} = useLanguage();
  const it = language === 'it';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: 'facebook' | 'linkedin' | 'instagram') => {
    posthog.capture('blog_post_shared', {
      post_id: articleId,
      platform: platform
    });

    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(articleTitle)}`;
        break;
      case 'instagram':
        // Instagram does not have a direct web share link, this is a placeholder
        url = 'https://www.instagram.com';
        break;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mt-8">
      <p className="font-semibold">{it ? 'Condividi l’articolo' : 'Share this article'}</p>
      <Button variant="outline" size="icon" aria-label={it ? 'Condividi su Facebook' : 'Share on Facebook'} onClick={() => handleShare('facebook')}>
        <Facebook />
      </Button>
      <Button variant="outline" size="icon" aria-label={it ? 'Condividi su LinkedIn' : 'Share on LinkedIn'} onClick={() => handleShare('linkedin')}>
        <Linkedin />
      </Button>
      <Button variant="outline" size="icon" aria-label={it ? 'Apri Instagram' : 'Open Instagram'} onClick={() => handleShare('instagram')}>
        <Instagram />
      </Button>
    </div>
  );
};

export default ShareButtons;
