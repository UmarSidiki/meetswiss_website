import type { MetadataRoute } from 'next';

import { i18n } from '@/i18n.config';
import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchCollectionAllLocales } from '@/lib/strapi';

/** Pick up new Strapi URLs periodically (webhooks also revalidate this path). */
export const revalidate = 3600;

type LocalizedEntity = {
  documentId?: string | null;
  slug?: string | null;
  locale?: string | null;
  updatedAt?: string | null;
};

type GroupedEntity = {
  [locale: string]: LocalizedEntity;
};

type SitemapEntryOptions = {
  priority: number;
  changeFrequency: 'daily' | 'weekly';
};

function isSupportedLocale(locale?: string | null): locale is string {
  return !!locale && i18n.locales.includes(locale as (typeof i18n.locales)[number]);
}

function groupByIdentity(entities: LocalizedEntity[]) {
  const grouped = new Map<string, GroupedEntity>();

  entities.forEach((entity) => {
    if (!entity.slug) {
      return;
    }

    const groupKey = entity.documentId || `slug:${entity.slug}`;
    const locale = isSupportedLocale(entity.locale) ? entity.locale : i18n.defaultLocale;

    const bucket = grouped.get(groupKey) || {};
    bucket[locale] = entity;
    grouped.set(groupKey, bucket);
  });

  return grouped;
}

/** One `<url>` per localized path — avoids `xhtml:link` / `alternates` in generated XML. */
function entriesFromLocalizedGroups(
  entities: LocalizedEntity[],
  getPath: (locale: string, slug: string) => string,
  options: SitemapEntryOptions
): MetadataRoute.Sitemap {
  const grouped = groupByIdentity(entities);
  const out: MetadataRoute.Sitemap = [];

  grouped.forEach((localized) => {
    for (const [locale, entity] of Object.entries(localized)) {
      if (!entity.slug || !isSupportedLocale(locale)) {
        continue;
      }

      out.push({
        url: getAbsoluteUrl(getPath(locale, entity.slug)),
        lastModified: entity.updatedAt ? new Date(entity.updatedAt) : undefined,
        changeFrequency: options.changeFrequency,
        priority: options.priority,
      });
    }
  });

  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, articles, transfers, services, fleets] = await Promise.all([
    fetchCollectionAllLocales<LocalizedEntity[]>('pages', {
      fields: ['slug', 'locale', 'updatedAt', 'documentId'],
      pagination: { pageSize: 1000 },
    }),
    fetchCollectionAllLocales<LocalizedEntity[]>('articles', {
      fields: ['slug', 'locale', 'updatedAt', 'documentId'],
      pagination: { pageSize: 1000 },
    }),
    fetchCollectionAllLocales<LocalizedEntity[]>('transfers', {
      fields: ['slug', 'locale', 'updatedAt', 'documentId'],
      pagination: { pageSize: 1000 },
    }),
    fetchCollectionAllLocales<LocalizedEntity[]>('services', {
      fields: ['slug', 'locale', 'updatedAt', 'documentId'],
      pagination: { pageSize: 1000 },
    }),
    fetchCollectionAllLocales<LocalizedEntity[]>('fleets', {
      fields: ['slug', 'locale', 'updatedAt', 'documentId'],
      pagination: { pageSize: 1000 },
    }),
  ]);

  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of i18n.locales) {
    entries.push({
      url: getAbsoluteUrl(`/${locale}`),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    });
    entries.push({
      url: getAbsoluteUrl(`/${locale}/services`),
      changeFrequency: 'daily',
      priority: 0.85,
    });
    entries.push({
      url: getAbsoluteUrl(`/${locale}/fleet`),
      changeFrequency: 'daily',
      priority: 0.8,
    });
    entries.push({
      url: getAbsoluteUrl(`/${locale}/transfers`),
      changeFrequency: 'daily',
      priority: 0.82,
    });
    entries.push({
      url: getAbsoluteUrl(`/${locale}/blog`),
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  const filteredPages = pages.filter((page) => page.slug && page.slug !== 'homepage');
  entries.push(
    ...entriesFromLocalizedGroups(filteredPages, (locale, slug) => `/${locale}/${slug}`, {
      priority: 0.8,
      changeFrequency: 'weekly',
    })
  );

  entries.push(
    ...entriesFromLocalizedGroups(articles, (locale, slug) => `/${locale}/blog/${slug}`, {
      priority: 0.7,
      changeFrequency: 'weekly',
    })
  );

  entries.push(
    ...entriesFromLocalizedGroups(services, (locale, slug) => `/${locale}/services/${slug}`, {
      priority: 0.75,
      changeFrequency: 'weekly',
    })
  );

  entries.push(
    ...entriesFromLocalizedGroups(transfers, (locale, slug) => `/${locale}/transfers/${slug}`, {
      priority: 0.72,
      changeFrequency: 'weekly',
    })
  );

  entries.push(
    ...entriesFromLocalizedGroups(fleets, (locale, slug) => `/${locale}/fleet/${slug}`, {
      priority: 0.7,
      changeFrequency: 'weekly',
    })
  );

  const deduped = new Map<string, MetadataRoute.Sitemap[number]>();
  entries.forEach((entry) => {
    deduped.set(entry.url, entry);
  });

  return Array.from(deduped.values());
}
