import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(), payment=()' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Content-Security-Policy', value: "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'" },
    ] }];
  },
  distDir: process.env.SFT_LOCAL_PREVIEW === '1' ? '.next-local-preview' : '.next',
  transpilePackages: ['@sft/design-system'],
  outputFileTracingRoot: __dirname,
  outputFileTracingIncludes: {
    '/sft-day': ['./app/fonts/*.woff', './node_modules/@sft/design-system/public/brand/fonts/Armasen - Kelson-ExtraBold.otf', './public/brand/logos/sft-white.svg', './public/brand/patterns/team-flow.svg'],
    '/sft-day/tickets/*/pdf': ['./app/fonts/*.woff', './node_modules/@sft/design-system/public/brand/fonts/Armasen - Kelson-ExtraBold.otf', './public/brand/logos/sft-white.svg', './public/brand/patterns/team-flow.svg'],
    '/admin/sft-day': ['./app/fonts/*.woff', './node_modules/@sft/design-system/public/brand/fonts/Armasen - Kelson-ExtraBold.otf', './public/brand/logos/sft-white.svg', './public/brand/patterns/team-flow.svg'],
    '/api/sft-day/emails': ['./app/fonts/*.woff', './node_modules/@sft/design-system/public/brand/fonts/Armasen - Kelson-ExtraBold.otf', './public/brand/logos/sft-white.svg', './public/brand/patterns/team-flow.svg'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'caldljublqwsgsafcxun.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: '5mb' },
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async redirects() {
    return [
      {
        source: '/team-day',
        destination: '/sft-day',
        permanent: false,
      },
      {
        source: '/admin/team-day',
        destination: '/admin/sft-day',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;