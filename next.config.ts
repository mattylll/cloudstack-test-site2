import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Static export for Cloudflare Pages and Netlify
  output: 'export',

  // UK/EU edge runtime preference
  experimental: {
    // @ts-ignore - runtime option may not be in types yet
    runtime: 'edge',
  },

  // Headers for UK compliance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Data-Region',
            value: 'UK',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
