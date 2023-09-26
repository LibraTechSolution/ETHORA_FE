import withBundleAnalyzer from '@next/bundle-analyzer';
import withPlugins from 'next-compose-plugins';

/** @type {import('next').NextConfig} */
const { hostname } = new URL(process.env.NEXT_PUBLIC_CDN_URL);
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = withPlugins([[withBundleAnalyzer({ enabled: Boolean(process.env.ANALYZE) })]], {
  basePath,
  assetPrefix: basePath || undefined,
  output: 'standalone',
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        // port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: hostname,
        // port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  // experimental: { instrumentationHook: true },
  // rewrites() {
  //   return [
  //     { source: "/healthz", destination: "/api/health" },
  //     { source: "/api/healthz", destination: "/api/health" },
  //     { source: "/health", destination: "/api/health" },
  //     { source: "/ping", destination: "/api/health" },
  //   ]
  // },
});

export default nextConfig;
