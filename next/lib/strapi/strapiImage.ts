import { API_URL } from '../utils';

/**
 * Resolves a Strapi image URL to a servable path.
 *
 * Images are always served directly from Strapi (via `NEXT_PUBLIC_API_URL`).
 * In development this is typically `http://localhost:1337`.
 * In production this is your public Strapi domain (e.g. `https://api.meetswiss.com`).
 *
 * Absolute URLs (http/https/data) are returned as-is.
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
    return API_URL + url;
  }

  return url;
}
