/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // SVG 설정
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_S3_HOSTNAME,
        port: '',
        pathname: '/**',
      },
    ],
  },

  allowedDevOrigins: ['*'],
};

module.exports = nextConfig;
