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
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://10.0.0.0:3000',
    'http://10.0.0.1:3000',
    'http://10.10.10.156:3000',
    'http://192.168.0.0:3000',
    'http://192.168.0.1:3000',
    'http://192.168.1.1:3000',
    'http://192.168.0.5:3000',
  ],
};

module.exports = nextConfig;
