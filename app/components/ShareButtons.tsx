'use client';

import React from 'react';
import { Facebook, Linkedin, Instagram } from 'lucide-react';
import posthog from 'posthog-js';

interface ShareButtonsProps {
  articleId: string;
  articleTitle: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ articleId, articleTitle }) => {
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
    <div className="flex items-center gap-4 mt-8">
      <p className="font-semibold">Share this post:</p>
      <button onClick={() => handleShare('facebook')} className="text-gray-600 hover:text-blue-600">
        <Facebook />
      </button>
      <button onClick={() => handleShare('linkedin')} className="text-gray-600 hover:text-blue-700">
        <Linkedin />
      </button>
      <button onClick={() => handleShare('instagram')} className="text-gray-600 hover:text-pink-500">
        <Instagram />
      </button>
    </div>
  );
};

export default ShareButtons;
