import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "test-fe.mysellerpintar.com",  // domain lama
      "s3.sellerpintar.com",         
    ],
  },
};

export default nextConfig;
