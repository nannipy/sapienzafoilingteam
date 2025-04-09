import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep any other configurations you might already have
  reactStrictMode: true, // Example existing config

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'caldljublqwsgsafcxun.supabase.co', // <-- Paste your specific Supabase hostname here
        port: '', // Keep empty for default ports (80/443)
        pathname: '/storage/v1/object/public/**', // Specific path for Supabase storage public objects
      },
      // You can add other patterns here if needed for other image sources
    ],
  },
};

module.exports = nextConfig;