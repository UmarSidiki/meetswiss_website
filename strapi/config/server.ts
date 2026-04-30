export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Public-facing URL — used to generate absolute URLs for uploaded media.
  // Set this to your Strapi domain in production (e.g. https://api.meetswiss.com)
  url: env('PUBLIC_URL', undefined),
  app: {
    keys: env.array('APP_KEYS') || ['tobemodified1', 'tobemodified2'],
  },
});
