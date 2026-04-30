import { API_URL } from '../utils';

const isDev = process.env.ENVIRONMENT === 'development';

/**
 * Resolves a Strapi image URL to a servable path.
 *
 * - **Development**: proxies through Strapi (`NEXT_PUBLIC_API_URL + url`)
 * - **Production**: serves from local build-time cache (`/strapi-images/...`)
 *
 * Images are downloaded to `public/strapi-images/` during `next build`
 * via `scripts/download-strapi-images.mjs`.
 */
export function strapiImage(url: string): string {
  if (!url) return '';

  // Already absolute — return as-is
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('//') ||
    url.startsWith('data:')
  ) {
    return url;
  }

  // Relative Strapi path (e.g. /uploads/car_abc123.jpg)
  if (url.startsWith('/')) {
    if (isDev) {
      return API_URL + url;
    }
    return `/strapi-images${url}`;
  }

  return url;
}
