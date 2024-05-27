/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  transpilePackages: ['crypto-js'],
};

const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA(nextConfig);
