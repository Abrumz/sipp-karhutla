/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // experimental: {
  //   appDir: true,
  // },
  // output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
 
  async rewrites() {
    return [
      {
        source: '/api/:path*', 
        destination: 'https://fwd.agricodex.id/:path*',  
      },
    ];
  }, 
};

module.exports = nextConfig;