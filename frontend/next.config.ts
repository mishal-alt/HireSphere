import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://hiresphere-backend.duckdns.org/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'https://hiresphere-backend.duckdns.org/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
