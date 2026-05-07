import type { MetadataRoute } from 'next';

import { i18n } from '@/i18n.config';
import { localePath as buildLocalePath } from '@/lib/locale-path';
import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchCollectionAllLocales } from '@/lib/strapi';

/** Pick up new Strapi URLs periodically (webhooks also revalidate this path). */
/** Sitemap is automatically revalidated via ISR cache tags in Strapi client */

type LocalizedEntity = {
  documentId?: string | null;
  slug?: string | null;
  locale?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
  seo?: { metaRobots?: string | null } | null;
};

function isIndexable(entity: LocalizedEntity): boolean {
  if (!entity.publishedAt) return false;
  const robots = entity.seo?.metaRobots?.toLowerCase() ?? '';
  return !robots.includes('noindex');
}

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

const localePath = buildLocalePath;

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
        lastModified: entity.updatedAt
          ? new Date(entity.updatedAt).toISOString().split('.')[0] + 'Z'
          : undefined,
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
      fields: ['slug', 'locale', 'updatedAt', 'publishedAt', 'documentId'],
      populate: { seo: { fields: ['metaRobots'] } },
      pagination: { pageSize: 1000 },
    }),
    fetchCollectionAllLocales<LocalizedEntity[]>('articles', {
      fields: ['slug', 'locale', 'updatedAt', 'publishedAt', 'documentId'],
      populate: { seo: { fields: ['metaRobots'] } },
      pagination: { pageSize: 1000 },
    }),
    fetchCollectionAllLocales<LocalizedEntity[]>('transfers', {
      fields: ['slug', 'locale', 'updatedAt', 'publishedAt', 'documentId'],
      populate: { seo: { fields: ['metaRobots'] } },
      pagination: { pageSize: 1000 },
    }),
    fetchCollectionAllLocales<LocalizedEntity[]>('services', {
      fields: ['slug', 'locale', 'updatedAt', 'publishedAt', 'documentId'],
      populate: { seo: { fields: ['metaRobots'] } },
      pagination: { pageSize: 1000 },
    }),
    fetchCollectionAllLocales<LocalizedEntity[]>('fleets', {
      fields: ['slug', 'locale', 'updatedAt', 'publishedAt', 'documentId'],
      populate: { seo: { fields: ['metaRobots'] } },
      pagination: { pageSize: 1000 },
    }),
  ]);

  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();
  const nowStr = now.toISOString().split('.')[0] + 'Z';

  for (const locale of i18n.locales) {
    const prefix = locale === i18n.defaultLocale ? '' : `/${locale}`;
    entries.push({
      url: getAbsoluteUrl(prefix || '/'),
      lastModified: nowStr,
      changeFrequency: 'daily',
      priority: 1,
    });
    entries.push({
      url: getAbsoluteUrl(`${prefix}/services`),
      changeFrequency: 'daily',
      priority: 0.85,
    });
    entries.push({
      url: getAbsoluteUrl(`${prefix}/fleet`),
      changeFrequency: 'daily',
      priority: 0.8,
    });
    entries.push({
      url: getAbsoluteUrl(`${prefix}/transfers`),
      changeFrequency: 'daily',
      priority: 0.82,
    });
    entries.push({
      url: getAbsoluteUrl(`${prefix}/blog`),
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  const filteredPages = pages.filter(
    (page) => page.slug && page.slug !== 'homepage' && isIndexable(page)
  );
  entries.push(
    ...entriesFromLocalizedGroups(filteredPages, (locale, slug) => localePath(locale, `/${slug}`), {
      priority: 0.8,
      changeFrequency: 'weekly',
    })
  );

  entries.push(
    ...entriesFromLocalizedGroups(articles.filter(isIndexable), (locale, slug) => localePath(locale, `/blog/${slug}`), {
      priority: 0.7,
      changeFrequency: 'weekly',
    })
  );

  entries.push(
    ...entriesFromLocalizedGroups(services.filter(isIndexable), (locale, slug) => localePath(locale, `/services/${slug}`), {
      priority: 0.75,
      changeFrequency: 'weekly',
    })
  );

  entries.push(
    ...entriesFromLocalizedGroups(transfers.filter(isIndexable), (locale, slug) => localePath(locale, `/transfers/${slug}`), {
      priority: 0.72,
      changeFrequency: 'weekly',
    })
  );

  entries.push(
    ...entriesFromLocalizedGroups(fleets.filter(isIndexable), (locale, slug) => localePath(locale, `/fleet/${slug}`), {
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
