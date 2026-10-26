import type { Event, OpenPositionParsed } from './types';

export function boundedText(value: unknown, max: number, required = false): string {
  if (typeof value !== 'string' || value.length > max || /[\u0000\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value) || (required && !value.trim())) throw new Error('Testo non valido');
  return value;
}

export function mediaUrl(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  const text = boundedText(value, 2048);
  if (text.startsWith('/') && !text.startsWith('//') && !/[\\\s]/.test(text)) return text;
  const url = new URL(text);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('URL non valido');
  return text;
}

export function eventPayload(value: unknown, partial = false): Omit<Event, 'id' | 'created_at'> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Evento non valido');
  const d = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of ['title', 'title_en', 'location']) if (!partial || key in d) out[key] = boundedText(d[key], 300, true).trim();
  if (!partial || 'date' in d) {
    if (typeof d.date !== 'string' || d.date.length > 40 || !Number.isFinite(Date.parse(d.date))) throw new Error('Data non valida');
    out.date = new Date(d.date).toISOString();
  }
  if (!partial || 'image_url' in d) out.image_url = mediaUrl(d.image_url);
  if (!partial || 'image_alt' in d) out.image_alt = d.image_alt == null ? null : boundedText(d.image_alt, 500);
  return out as Omit<Event, 'id' | 'created_at'>;
}

export function positionPayload(value: unknown, partial = false): Omit<OpenPositionParsed, 'id' | 'created_at'> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Posizione non valida');
  const d = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of ['title', 'location', 'type', 'description']) if (!partial || key in d) out[key] = boundedText(d[key], key === 'description' ? 20000 : 300, true).trim();
  if (!partial || 'requirements' in d) {
    if (!Array.isArray(d.requirements) || d.requirements.length > 50) throw new Error('Requisiti non validi');
    out.requirements = d.requirements.map(r => boundedText(r, 1000, true));
  }
  if (!partial || 'order_index' in d) {
    if (!Number.isSafeInteger(d.order_index) || Math.abs(d.order_index as number) > 10000) throw new Error('Ordine non valido');
    out.order_index = d.order_index;
  }
  return out as Omit<OpenPositionParsed, 'id' | 'created_at'>;
}
