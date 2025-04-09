import localFont from 'next/font/local';

export const geist = localFont({
  src: './fonts/GeistVF.woff2',
  variable: '--font-geist',
  display: 'swap',
});

export const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff2',
  variable: '--font-geist-mono',
  display: 'swap',
});

export const kelson = localFont({
  src: [
    {
      path: './fonts/kelson/Armasen - Kelson.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/kelson/Armasen - Kelson-Bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-kelson',
});