import 'server-only';
import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import { headers } from 'next/headers';
import { supabaseAdmin } from './supabase-admin';

export async function publicSourceHash() {
  const h = await headers();
  // Vercel overwrites this header. Never fall back to client-supplied XFF.
  const raw = process.env.VERCEL === '1' ? h.get('x-vercel-forwarded-for') : null;
  const ip = raw?.trim();
  if (process.env.VERCEL === '1' && (!ip || !isIP(ip))) throw new Error('Missing trusted client IP');
  return privateHash(ip || 'local-development');
}

function privateHash(value: string) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Missing rate limit secret');
  return createHmac('sha256', key).update(value).digest('hex');
}

export async function consumePublicLimit(scope: string, key: string, limit: number, seconds = 3600) {
  const { data, error } = await supabaseAdmin.rpc('consume_public_action_limit', {
    p_key: `${scope}:${privateHash(key)}`, p_limit: limit, p_seconds: seconds,
  });
  // Fail closed when the migration/service is unavailable.
  return !error && data === true;
}

export function contactInput(value: unknown, presentation = false) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const d = value as Record<string, unknown>;
  for (const [field, max] of [['name', 160], ['email', 254], ['payment', 40], ...(presentation ? [['dietary', 80]] : [])] as [string, number][]) {
    if (typeof d[field] !== 'string' || !(d[field] as string).trim() || (d[field] as string).length > max || /[\u0000-\u001f\u007f]/.test(d[field] as string)) return null;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email as string)) return null;
  if (!(presentation ? ['paypal', 'revolut', 'iban', 'cash'] : ['paypal', 'revolut', 'cash']).includes(d.payment as string)) return null;
  if (presentation && !['none', 'vegetarian', 'vegan', 'celiac', 'other'].includes(d.dietary as string)) return null;
  if (d.dietaryOther !== undefined && (typeof d.dietaryOther !== 'string' || d.dietaryOther.length > 500 || /[\u0000-\u001f\u007f]/.test(d.dietaryOther))) return null;
  return d as { name: string; email: string; payment: string; dietary?: string; dietaryOther?: string };
}

export async function sendStaffNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error('Missing notification configuration');
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, link_preview_options: { is_disabled: true } }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok || (await response.json()).ok !== true) throw new Error('Notification failed');
}
