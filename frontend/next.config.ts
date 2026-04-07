import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // API 프록시: /api/* → Django 백엔드
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
