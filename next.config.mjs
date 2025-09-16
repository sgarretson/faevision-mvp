/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  experimental: {
    serverComponentsExternalPackages: ['prisma'],
  },
};

export default nextConfig;
