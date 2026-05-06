import type { Metadata } from 'next';

import {
  defaultLocale,
  siteName as fallbackSiteName,
  getAbsoluteUrl,
  localeAlternates,
} from './config';
import { strapiImage } from '@/lib/strapi/strapiImage';

const fallbackTitle = fallbackSiteName;
const fallbackDescription =
  'MeetSwiss Transfers delivers premium chauffeur experiences across Switzerland.';

function normalizeKeywords(keywords?: string | string[]): string[] | undefined {
  if (!keywords) {
    return undefined;
  }

  if (Array.isArray(keywords)) {
    return keywords.filter(Boolean);
  }

  return keywords
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveRobots(robotsInput?: string): Metadata['robots'] | undefined {
  if (!robotsInput) {
    return { index: true, follow: true };
  }

  const directives = robotsInput
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (!directives.length) {
    return { index: true, follow: true };
  }

  const robots: NonNullable<Metadata['robots']> = {
    index: !directives.includes('noindex'),
    follow: !directives.includes('nofollow'),
  };

  if (directives.includes('noarchive')) {
    robots.noarchive = true;
  }
  if (directives.includes('nosnippet')) {
    robots.nosnippet = true;
  }
  if (directives.includes('noimageindex')) {
    robots.noimageindex = true;
  }
  if (directives.includes('notranslate')) {
    robots.notranslate = true;
  }
  if (directives.includes('max-image-preview:large')) {
    robots.maxImagePreview = 'large';
  }
  if (directives.includes('max-image-preview:standard')) {
    robots.maxImagePreview = 'standard';
  }
  if (directives.includes('max-image-preview:none')) {
    robots.maxImagePreview = 'none';
  }

  return robots;
}

function resolveMetadataImage(seo: any): string | undefined {
  if (seo?.metaImage?.url) {
    return strapiImage(seo.metaImage.url);
  }

  if (seo?.twitterImage?.url) {
    return strapiImage(seo.twitterImage.url);
  }

  if (typeof seo?.twitterImage === 'string') {
    return seo.twitterImage;
  }

  return undefined;
}

function resolveDefaultImage(siteSettings?: any): string | undefined {
  const imageUrl = siteSettings?.defaultSocialImage?.url;
  return imageUrl ? strapiImage(imageUrl) : undefined;
}

function resolveCanonicalPath({
  locale,
  pathname,
}: {
  locale: string;
  pathname?: string;
}): string {
  const cleanPath = pathname && pathname !== '/' ? pathname : '';
  if (locale === defaultLocale) {
    return getAbsoluteUrl(cleanPath);
  }
  const localePath = cleanPath
    ? `/${locale}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`
    : `/${locale}`;
  return getAbsoluteUrl(localePath);
}

function buildLanguageAlternates(pathname: string = '') {
  const alternates = Object.entries(localeAlternates).reduce<
    Record<string, string>
  >((acc, [locale, localeBasePath]) => {
    const suffix = pathname && pathname !== '/' ? pathname : '';
    acc[locale] = getAbsoluteUrl(`${localeBasePath}${suffix}`);
    return acc;
  }, {});

  const canonicalEnglish = alternates[defaultLocale] ?? getAbsoluteUrl('/');
  alternates['x-default'] = canonicalEnglish;
  return alternates;
}

export function generateMetadataObject(
  seo: any,
  options: {
    locale: string;
    pathname?: string;
    localizedPaths?: Record<string, string>;
    siteSettings?: any;
    openGraphType?: 'website' | 'article';
  } = { locale: defaultLocale }
): Metadata {
  const locale = options.locale || defaultLocale;
  const pathname = options.pathname || '';
  const title =
    seo?.metaTitle || options.siteSettings?.siteName || fallbackTitle;
  const siteDisplayName = options.siteSettings?.siteName || fallbackTitle;
  const description =
    seo?.metaDescription ||
    options.siteSettings?.siteDescription ||
    fallbackDescription;
  const openGraphTitle = seo?.ogTitle || title;
  const openGraphDescription = seo?.ogDescription || description;
  const twitterTitle = seo?.twitterTitle || title;
  const twitterDescription = seo?.twitterDescription || description;
  const canonical = resolveCanonicalPath({ locale, pathname });
  const metadataImage =
    resolveMetadataImage(seo) || resolveDefaultImage(options.siteSettings);
  const languageAlternates = options.localizedPaths
    ? Object.entries(options.localizedPaths).reduce<Record<string, string>>(
        (acc, [language, value]) => {
          const localizedPath =
            value && value !== '/'
              ? value.startsWith('/')
                ? value
                : `/${value}`
              : '';
          acc[language] =
            language === defaultLocale
              ? getAbsoluteUrl(localizedPath)
              : getAbsoluteUrl(`/${language}${localizedPath}`);
          return acc;
        },
        {}
      )
    : buildLanguageAlternates(pathname);

  if (!languageAlternates['x-default']) {
    languageAlternates['x-default'] =
      languageAlternates[defaultLocale] || getAbsoluteUrl('/');
  }

  return {
    title,
    description,
    metadataBase: new URL(getAbsoluteUrl('/')),
    alternates: {
      canonical,
      languages: languageAlternates,
    },
    keywords: normalizeKeywords(
      seo?.keywords || options.siteSettings?.siteKeywords
    ),
    robots: resolveRobots(
      seo?.metaRobots || options.siteSettings?.defaultRobots
    ),
    openGraph: {
      type: options.openGraphType || 'website',
      title: openGraphTitle,
      description: openGraphDescription,
      url: canonical,
      siteName: siteDisplayName,
      locale,
      images: metadataImage ? [{ url: metadataImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: metadataImage ? [metadataImage] : [],
      creator: options.siteSettings?.xHandle,
      site: options.siteSettings?.xHandle,
    },
  };
}
