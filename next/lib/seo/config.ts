import { i18n } from '@/i18n.config';

const fallbackSiteUrl = 'http://localhost:3000';

const websiteUrl =
  process.env.WEBSITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  fallbackSiteUrl;

export const siteUrl = websiteUrl.replace(/\/+$/, '');
export const siteName =
  process.env.NEXT_PUBLIC_SITE_NAME || 'MeetSwiss Transfers';
export const defaultLocale = i18n.defaultLocale;

export const localeAlternates = i18n.locales.reduce<Record<string, string>>(
  (acc, locale) => {
    acc[locale] = `/${locale}`;
    return acc;
  },
  {}
);

export function getAbsoluteUrl(pathname: string = ''): string {
  if (!pathname) {
    return siteUrl;
  }

  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${siteUrl}${normalizedPath}`;
}
