export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  image_alt: string | null;
  created_at: string;
  content_en: string;
  title_en: string;
  author_id?: string;
};

// requirements è serializzato come stringa JSON nel DB (colonna text)
export interface OpenPosition {
  id: string;
  created_at: string;
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  order_index: number;
}

// Versione con requirements già parsata, usata in UI e server actions
export interface OpenPositionParsed extends Omit<OpenPosition, 'requirements'> {
  requirements: string[];
}

export function parseOpenPosition(pos: OpenPosition): OpenPositionParsed {
  return {
    ...pos,
    requirements: JSON.parse(pos.requirements || '[]'),
  };
}

export interface Event {
  id: string;
  created_at: string;
  title: string;
  title_en: string;
  date: string;
  location: string;
  image_url: string | null;
  image_alt: string | null;
}
