
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
  dev: {
    allowedDevOrigins: [
      'https://2e01e1e9-6a13-44c7-86f1-5856751d48bc-00-3qd7scyhu3dnq.sisko.replit.dev',
      'http://localhost:9002',
    ],
  },
};

export default nextConfig;
