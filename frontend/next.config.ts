import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://98.130.44.82:5000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://98.130.44.82:5000/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
