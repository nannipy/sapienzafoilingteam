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

export interface OpenPosition {
  id: string;
  created_at: string;
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  order_index: number;
}

export interface Event {
  id: string;
  created_at: string;
  title: string;
  title_en: string;
  date: string; // ISO date string
  location: string;
  image_url: string | null;
  image_alt: string | null;
}
