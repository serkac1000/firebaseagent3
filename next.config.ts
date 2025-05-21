
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://0.0.0.0:9002/api/:path*',
      },
    ];
  },
  allowedDevOrigins: [
    'https://*.replit.dev',
    'http://*.replit.dev',
    'http://0.0.0.0:9002',
    'http://localhost:9002',
  ]
};

export default nextConfig;
