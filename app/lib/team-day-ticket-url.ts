import 'server-only';
export function ticketOrigin() {
  const url = new URL(process.env.SFT_PUBLIC_URL || 'https://sapienzafoilingteam.com');
  if (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && ['localhost','127.0.0.1'].includes(url.hostname))) throw new Error('Invalid ticket origin');
  return url.origin;
}
