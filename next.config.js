/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Configure image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
  },

  // Server external packages that should not be bundled
  serverExternalPackages: ['@neondatabase/serverless'],
};

export default nextConfig;
