// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 开发阶段可以先用通配符，生产环境强烈建议替换为真实的图床域名，如 's3.amazonaws.com'
      },
    ],
  },
};

export default nextConfig;