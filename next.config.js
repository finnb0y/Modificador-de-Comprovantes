/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    unoptimized: true
  },
  // Configurações para deploy no Vercel
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  }
}

module.exports = nextConfig
