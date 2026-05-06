export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            env('CF_PUBLIC_ACCESS_URL'), // For Cloudflare R2
            env('MINIO_ENDPOINT'),       // For MinIO
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            env('CF_PUBLIC_ACCESS_URL'), // For Cloudflare R2
            env('MINIO_ENDPOINT'),       // For MinIO
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        env('CLIENT_URL', 'http://localhost:3000'),
        'http://localhost:1337', // Strapi's own dashboard
      ],
      // ... rest of your CORS settings are fine
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
