import type { MetadataRoute } from 'next';

import { i18n } from '@/i18n.config';
import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchCollectionType, fetchSingleType } from '@/lib/strapi';

type LocalizedEntity = {
  documentId?: string;
  slug?: string;
  locale: string;
  updatedAt?: string;
};

function toAlternateMap(pathByLocale: Record<string, string>) {
  return Object.entries(pathByLocale).reduce<Record<string, string>>(
    (acc, [locale, path]) => {
      const normalized = path.startsWith('/') ? path : `/${path}`;
      acc[locale] = getAbsoluteUrl(normalized);
      return acc;
    },
    {}
  );
}

function groupByDocumentId(entities: LocalizedEntity[]) {
  const byDocumentId = new Map<string, Record<string, LocalizedEntity>>();
  entities.forEach((entity) => {
    if (!entity.documentId) {
      return;
    }
    const bucket = byDocumentId.get(entity.documentId) || {};
    bucket[entity.locale] = entity;
    byDocumentId.set(entity.documentId, bucket);
  });

  return byDocumentId;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, articles, transfers, services, fleets, blogPage] =
    await Promise.all([
      fetchCollectionType<LocalizedEntity[]>('pages', {
        fields: ['documentId', 'slug', 'locale', 'updatedAt'],
        locale: 'all',
        pagination: { pageSize: 1000 },
      }),
      fetchCollectionType<LocalizedEntity[]>('articles', {
        fields: ['documentId', 'slug', 'locale', 'updatedAt'],
        locale: 'all',
        pagination: { pageSize: 1000 },
      }),
      fetchCollectionType<LocalizedEntity[]>('transfers', {
        fields: ['documentId', 'slug', 'locale', 'updatedAt'],
        locale: 'all',
        pagination: { pageSize: 1000 },
      }),
      fetchCollectionType<LocalizedEntity[]>('services', {
        fields: ['documentId', 'slug', 'locale', 'updatedAt'],
        locale: 'all',
        pagination: { pageSize: 1000 },
      }),
      fetchCollectionType<LocalizedEntity[]>('fleets', {
        fields: ['documentId', 'slug', 'locale', 'updatedAt'],
        locale: 'all',
        pagination: { pageSize: 1000 },
      }),
      fetchSingleType<{
        localizations?: Array<{ locale: string }>;
        updatedAt?: string;
      }>('blog-page', { locale: i18n.defaultLocale }),
    ]);

  const entries: MetadataRoute.Sitemap = [];

  const homepageAlternates = i18n.locales.reduce<Record<string, string>>(
    (acc, locale) => {
      acc[locale] = `/${locale}`;
      return acc;
    },
    {}
  );

  entries.push({
    url: getAbsoluteUrl(`/${i18n.defaultLocale}`),
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
    alternates: {
      languages: toAlternateMap(homepageAlternates),
    },
  });

  const servicesAlternates = i18n.locales.reduce<Record<string, string>>(
    (acc, locale) => {
      acc[locale] = `/${locale}/services`;
      return acc;
    },
    {}
  );

  entries.push({
    url: getAbsoluteUrl(`/${i18n.defaultLocale}/services`),
    changeFrequency: 'daily',
    priority: 0.85,
    alternates: {
      languages: toAlternateMap(servicesAlternates),
    },
  });

  const fleetAlternates = i18n.locales.reduce<Record<string, string>>(
    (acc, locale) => {
      acc[locale] = `/${locale}/fleet`;
      return acc;
    },
    {}
  );

  entries.push({
    url: getAbsoluteUrl(`/${i18n.defaultLocale}/fleet`),
    changeFrequency: 'daily',
    priority: 0.8,
    alternates: {
      languages: toAlternateMap(fleetAlternates),
    },
  });

  const transfersAlternates = i18n.locales.reduce<Record<string, string>>(
    (acc, locale) => {
      acc[locale] = `/${locale}/transfers`;
      return acc;
    },
    {}
  );

  entries.push({
    url: getAbsoluteUrl(`/${i18n.defaultLocale}/transfers`),
    changeFrequency: 'daily',
    priority: 0.82,
    alternates: {
      languages: toAlternateMap(transfersAlternates),
    },
  });

  const pageByDocumentId = groupByDocumentId(pages);
  pageByDocumentId.forEach((localized) => {
    const alternates = Object.entries(localized).reduce<Record<string, string>>(
      (acc, [locale, page]) => {
        if (!page.slug || page.slug === 'homepage') {
          return acc;
        }
        acc[locale] = `/${locale}/${page.slug}`;
        return acc;
      },
      {}
    );
    const defaultPage =
      localized[i18n.defaultLocale] || Object.values(localized)[0];
    if (!defaultPage?.slug || defaultPage.slug === 'homepage') {
      return;
    }
    entries.push({
      url: getAbsoluteUrl(`/${defaultPage.locale}/${defaultPage.slug}`),
      lastModified: defaultPage.updatedAt
        ? new Date(defaultPage.updatedAt)
        : undefined,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: toAlternateMap(alternates),
      },
    });
  });

  const articleByDocumentId = groupByDocumentId(articles);
  articleByDocumentId.forEach((localized) => {
    const alternates = Object.entries(localized).reduce<Record<string, string>>(
      (acc, [locale, article]) => {
        acc[locale] = `/${locale}/blog/${article.slug}`;
        return acc;
      },
      {}
    );
    const defaultArticle =
      localized[i18n.defaultLocale] || Object.values(localized)[0];
    if (!defaultArticle?.slug) {
      return;
    }
    entries.push({
      url: getAbsoluteUrl(
        `/${defaultArticle.locale}/blog/${defaultArticle.slug}`
      ),
      lastModified: defaultArticle.updatedAt
        ? new Date(defaultArticle.updatedAt)
        : undefined,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: toAlternateMap(alternates),
      },
    });
  });

  const serviceByDocumentId = groupByDocumentId(services);
  serviceByDocumentId.forEach((localized) => {
    const alternates = Object.entries(localized).reduce<Record<string, string>>(
      (acc, [locale, service]) => {
        acc[locale] = `/${locale}/services/${service.slug}`;
        return acc;
      },
      {}
    );
    const defaultService =
      localized[i18n.defaultLocale] || Object.values(localized)[0];
    if (!defaultService?.slug) {
      return;
    }
    entries.push({
      url: getAbsoluteUrl(
        `/${defaultService.locale}/services/${defaultService.slug}`
      ),
      lastModified: defaultService.updatedAt
        ? new Date(defaultService.updatedAt)
        : undefined,
      changeFrequency: 'weekly',
      priority: 0.75,
      alternates: {
        languages: toAlternateMap(alternates),
      },
    });
  });

  const transferByDocumentId = groupByDocumentId(transfers);
  transferByDocumentId.forEach((localized) => {
    const alternates = Object.entries(localized).reduce<Record<string, string>>(
      (acc, [locale, transfer]) => {
        acc[locale] = `/${locale}/transfers/${transfer.slug}`;
        return acc;
      },
      {}
    );
    const defaultTransfer =
      localized[i18n.defaultLocale] || Object.values(localized)[0];
    if (!defaultTransfer?.slug) {
      return;
    }
    entries.push({
      url: getAbsoluteUrl(
        `/${defaultTransfer.locale}/transfers/${defaultTransfer.slug}`
      ),
      lastModified: defaultTransfer.updatedAt
        ? new Date(defaultTransfer.updatedAt)
        : undefined,
      changeFrequency: 'weekly',
      priority: 0.72,
      alternates: {
        languages: toAlternateMap(alternates),
      },
    });
  });

  const fleetByDocumentId = groupByDocumentId(fleets);
  fleetByDocumentId.forEach((localized) => {
    const alternates = Object.entries(localized).reduce<Record<string, string>>(
      (acc, [locale, fleet]) => {
        acc[locale] = `/${locale}/fleet/${fleet.slug}`;
        return acc;
      },
      {}
    );
    const defaultFleet =
      localized[i18n.defaultLocale] || Object.values(localized)[0];
    if (!defaultFleet?.slug) {
      return;
    }
    entries.push({
      url: getAbsoluteUrl(`/${defaultFleet.locale}/fleet/${defaultFleet.slug}`),
      lastModified: defaultFleet.updatedAt
        ? new Date(defaultFleet.updatedAt)
        : undefined,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: toAlternateMap(alternates),
      },
    });
  });

  const blogAlternates = i18n.locales.reduce<Record<string, string>>(
    (acc, locale) => {
      acc[locale] = `/${locale}/blog`;
      return acc;
    },
    {}
  );

  entries.push({
    url: getAbsoluteUrl(`/${i18n.defaultLocale}/blog`),
    lastModified: blogPage?.updatedAt
      ? new Date(blogPage.updatedAt)
      : undefined,
    changeFrequency: 'daily',
    priority: 0.8,
    alternates: {
      languages: toAlternateMap(blogAlternates),
    },
  });

  return entries;
}
