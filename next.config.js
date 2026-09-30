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
      bodySizeLimit: '50mb',
      allowedOrigins: ['100.116.209.29:30080'],
    },
  },

  images: {
    remotePatterns: [
      ...(process.env.NEXT_S3_HOSTNAME
        ? [
            {
              protocol: 'https',
              hostname: process.env.NEXT_S3_HOSTNAME,
              port: '',
              pathname: '/**',
            },
          ]
        : []),
      {
        protocol: 'https',
        hostname: 'media.bunjang.co.kr',
        port: '',
        pathname: '/**',
      },
    ],
  },

  allowedDevOrigins: ['*'],
};

module.exports = nextConfig;
