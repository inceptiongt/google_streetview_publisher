import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'
import { ProxyAgent } from 'undici';

// Only enable proxy wrapping in development mode
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  // Ensure server-side fetch (undici) uses the same proxy when available
  const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
  if (proxyUrl) {
    try {
      const proxyAgent = new ProxyAgent({ uri: proxyUrl });
      const originalFetch = globalThis.fetch;
      if (originalFetch) {
        globalThis.fetch = (input, init = {}) => {
          const opts = { ...init };
          // @ts-ignore
          if (!opts.dispatcher) opts.dispatcher = proxyAgent;
          return originalFetch(input, opts);
        };
        console.log('undici fetch wrapped to use proxy:', proxyUrl);
      }
    } catch (err) {
      console.warn('Failed to wrap undici fetch with ProxyAgent:', err);
    }
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true
    },

  },
  serverExternalPackages: ['exiftool-vendored'],
  // allowedDevOrigins: true,
}

const _withBundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default _withBundleAnalyzer(nextConfig);
