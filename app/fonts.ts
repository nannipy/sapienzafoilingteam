import localFont from 'next/font/local';

export const geist = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist',
  display: 'swap',
});

export const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  display: 'swap',
});

export const kelson = localFont({
  src: [
    {
      path: './fonts/kelson/Armasen - Kelson-Thin.woff',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/kelson/Armasen - Kelson-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/kelson/Armasen - Kelson.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/kelson/Armasen - Kelson-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/kelson/Armasen - Kelson-Bold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/kelson/Armasen - Kelson-ExtraBold.woff',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-kelson',
  display: 'swap',
});