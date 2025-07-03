/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "test-fe.mysellerpintar.com",
      "s3.sellerpintar.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
