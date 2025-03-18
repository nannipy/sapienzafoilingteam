import localFont from 'next/font/local';

export const geist = localFont({
  src: [
    {
      path: './fonts/GeistVF.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-geist',
});

export const geistMono = localFont({
  src: [
    {
      path: './fonts/GeistMonoVF.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
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