import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
};
module.exports = {
  // Other configurations...
  dev: {
    allowedDevOrigins: [
      'https://<your-replit-subdomain>.replit.dev',
      'http://localhost:9002',
    ],
  },
};

export default nextConfig;
