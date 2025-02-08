/** @type {import('next').NextConfig} */

const nextConfig = {
  poweredByHeader: false, 
  headers: () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }, 
        { key: "x-nextjs-cache", value: "" },
      ],
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**', 
      },
      {
        protocol: 'http',
        hostname: 'svhqdts01',
        pathname: '**', 
      },
      {
        protocol: 'http',
        hostname: 'svdrtsw02',
        pathname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
};

export default nextConfig;
