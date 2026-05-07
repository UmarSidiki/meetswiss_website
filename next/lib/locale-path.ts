import { i18n } from '@/i18n.config';

// Patterns to detect external/absolute URLs
const EXTERNAL_URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;
const SPECIAL_PROTOCOL_PATTERN = /^(mailto:|tel:|sms:)/i;

/**
 * Checks if a URL is external/absolute (not a relative internal link)
 */
export function isExternalUrl(url: string | undefined): boolean {
  if (!url) return false;
  return (
    EXTERNAL_URL_PATTERN.test(url) ||
    SPECIAL_PROTOCOL_PATTERN.test(url)
  );
}

/**
 * Builds an internal href that respects the default-locale stripping rule.
 * For the default locale (en) the locale prefix is omitted because
 * proxy.ts redirects /en/* → /*, which would create avoidable 3XX hops.
 * Does NOT prepend locale to external/absolute URLs.
 */
export function localePath(locale: string, path: string = '/'): string {
  // Don't modify external/absolute URLs
  if (isExternalUrl(path)) {
    return path;
  }

  const prefix = locale === i18n.defaultLocale ? '' : `/${locale}`;

  if (!path || path === '/') {
    return prefix || '/';
  }

  if (path.startsWith('#') || path.startsWith('?')) {
    return `${prefix}${path}`;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${normalizedPath}`;
}
