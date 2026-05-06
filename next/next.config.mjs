/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_OUTPUT || undefined,
  // Enable Next.js 16 cache components
  cacheComponents: true,
  turbopack: {
    root: process.cwd().replace('/next', ''),
  },
  images: {
    // Disable image optimization for localhost in development
    ...(process.env.NODE_ENV === 'development' ? { unoptimized: true } : {}),
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    // Images are always served from Strapi (remote).
    // IMAGE_HOSTNAME must be set in production (e.g. api.meetswiss.com).
    remotePatterns: [
      // Development: local Strapi
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // Production: Strapi on VPS
      ...(process.env.IMAGE_HOSTNAME
        ? [
            {
              protocol: 'https',
              hostname: process.env.IMAGE_HOSTNAME,
              pathname: '/uploads/**',
            },
          ]
        : []),
      // Strapi Cloud (if ever used)
      {
        protocol: 'https',
        hostname: '*.strapiapp.com',
      },
      // External asset host (e.g. s3.itupdown.com/meetswiss/...)
      {
        protocol: 'https',
        hostname: 's3.itupdown.com',
        pathname: '/meetswiss/**',
      },
    ],
  },
  pageExtensions: ['ts', 'tsx'],
  async redirects() {
    if (process.env.NEXT_PUBLIC_API_URL === undefined) {
      console.warn(
        '[next.config] NEXT_PUBLIC_API_URL is not defined. Skipping redirect generation.'
      );
      return [];
    }

    let redirections = [];
    try {
      const headers = {};
      if (process.env.STRAPI_API_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/redirections`,
        { headers }
      );
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      
      if (!result.data) {
        console.warn('[next.config] No data returned for redirects from Strapi.');
        return [];
      }

      const redirectItems = result.data.map(({ source, destination }) => {
        return {
          source: `/:locale${source}`,
          destination: `/:locale${destination}`,
          permanent: false,
        };
      });

      redirections = redirections.concat(redirectItems);

      return redirections;
    } catch (error) {
      // Log warning but don't fail build - redirects are optional
      console.warn(
        '[next.config] Failed to fetch redirects from Strapi:',
        error instanceof Error ? error.message : error
      );
      return [];
    }
  },
};

export default nextConfig;
