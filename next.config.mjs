/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh5.googleusercontent.com',
          port: '',
          pathname: '/p/**',
        },
        {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/a/**',
          },
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
  }

export default nextConfig;
