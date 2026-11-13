/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      '@/*': './src/*',
    },
  },
};

export default nextConfig;