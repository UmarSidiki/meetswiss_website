import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ClientSlugHandler from '../ClientSlugHandler';
import { StructuredData } from '@/components/seo/structured-data';
import { i18n } from '@/i18n.config';
import { fetchSeoSettings } from '@/lib/seo/settings';
import PageContent from '@/lib/shared/PageContent';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType } from '@/lib/strapi';
import type { LocaleSlugParamsProps } from '@/types/types';

export async function generateStaticParams() {
  const pages = await fetchCollectionType<
    Array<{ slug: string; locale: string }>
  >('pages', {
    fields: ['slug', 'locale'],
    locale: 'all',
    pagination: { pageSize: 1000 },
  });

  const params = pages
    .filter((page) => page.slug && page.slug !== 'homepage')
    .map((page) => ({
      locale: page.locale,
      slug: page.slug,
    }));

  return params.length > 0
    ? params
    : [{ locale: i18n.defaultLocale, slug: '_placeholder' }];
}

export async function generateMetadata({
  params,
}: LocaleSlugParamsProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const [[pageData], seoSettings] = await Promise.all([
    fetchCollectionType('pages', {
      filters: {
        slug: {
          $eq: slug,
        },
        locale: locale,
      },
    }),
    fetchSeoSettings(locale),
  ]);

  if (!pageData) {
    notFound();
  }

  const localizedPaths = pageData.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [locale]: slug }
  );
  const metadata = generateMetadataObject(pageData.seo, {
    locale,
    pathname: `/${slug}`,
    localizedPaths,
    siteSettings: seoSettings,
  });
  return metadata;
}

export default async function Page({ params }: LocaleSlugParamsProps) {
  const { slug, locale } = await params;
  const [pageData] = await fetchCollectionType('pages', {
    filters: {
      slug: {
        $eq: slug,
      },
      locale: locale,
    },
  });

  if (!pageData) {
    notFound();
  }

  const localizedSlugs = pageData.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [locale]: slug }
  );

  return (
    <>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <StructuredData data={pageData.seo?.structuredData} />
      <PageContent pageData={pageData} />
    </>
  );
}
