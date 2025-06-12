/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config.js');

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com', 'pbs.twimg.com', 'images.unsplash.com', 'replicate.com', 'replicate.delivery', 'api.dicebear.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `script-src 'self' ${
              isDev ? "'unsafe-eval' 'unsafe-inline'" : ''
            } https://*.google.com https://js-agent.newrelic.com https://bam.nr-data.net;`,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 