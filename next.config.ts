import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
      'avatar.iran.liara.run',
      'images.pexels.com',
      'oq7nempxaa.ufs.sh',
      'drive.google.com',
      'i.pravatar.cc',
      'ik.imagekit.io',
      'lh3.googleusercontent.com',
    ],
  },
  // Enable compression for better performance
  compress: true,
  // Optimize production builds
  poweredByHeader: false,
  // Generate static pages where possible
  reactStrictMode: true,
};

export default nextConfig;
