// app/lib/types.ts
export type Article = {
  id: string;
  title: string;
  content: string; // Assuming content is plain text or you strip markdown for preview
  image_url: string | null; // Allow null images
  image_alt: string | null; // Allow null alt text
  created_at: string;
  content_en: string;
  title_en: string;
};

export type OpenPosition = {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
};
