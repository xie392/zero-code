import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // 允许 https://picsum.photos/600/300 链接的图片
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  }
}

export default nextConfig
