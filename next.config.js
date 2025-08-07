/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['www.google.com', 'www.jina.ai', 'r.jina.ai', 'thefznkhan.vercel.app'],
  },
};

module.exports = nextConfig;