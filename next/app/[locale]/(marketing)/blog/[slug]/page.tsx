import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import ClientSlugHandler from '../../ClientSlugHandler';
import { BlogLayout } from '@/components/blog-layout';
import { StructuredData } from '@/components/seo/structured-data';
import { i18n } from '@/i18n.config';
import { fetchSeoSettings } from '@/lib/seo/settings';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionAllLocales, fetchCollectionType } from '@/lib/strapi';
import { strapiImage } from '@/lib/strapi/strapiImage';
import type { Article, LocaleSlugParamsProps } from '@/types/types';

export async function generateStaticParams() {
  const articles = await fetchCollectionAllLocales<
    Array<{ slug: string; locale: string }>
  >('articles', {
    fields: ['slug', 'locale'],
    pagination: { pageSize: 1000 },
  });

  const params = articles
    .filter((article) => article.slug)
    .map((article) => ({
      locale: article.locale,
      slug: article.slug,
    }));

  return params.length > 0
    ? params
    : [{ locale: i18n.defaultLocale, slug: '_placeholder' }];
}

function buildArticleStructuredData({
  locale,
  slug,
  article,
}: {
  locale: string;
  slug: string;
  article: Article;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description || '',
    image: article.image?.url ? [strapiImage(article.image.url)] : [],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: `/${locale}/blog/${slug}`,
  };
}

export async function generateMetadata({
  params,
}: LocaleSlugParamsProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const [[article], seoSettings] = await Promise.all([
    fetchCollectionType<Article[]>('articles', {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      locale,
    }),
    fetchSeoSettings(locale),
  ]);

  if (!article) {
    return generateMetadataObject(null, {
      locale,
      pathname: '/blog',
      siteSettings: seoSettings,
    });
  }

  const localizedPaths = article.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = `blog/${localization.slug}`;
      return acc;
    },
    { [locale]: `blog/${slug}` }
  );

  const metadata = generateMetadataObject(article.seo || article, {
    locale,
    pathname: `/blog/${slug}`,
    localizedPaths,
    siteSettings: seoSettings,
    openGraphType: 'article',
  });

  metadata.openGraph = {
    ...(metadata.openGraph || {}),
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  };

  return metadata;
}

export default async function SingleArticlePage({
  params,
}: LocaleSlugParamsProps) {
  const { slug, locale } = await params;
  const [article] = await fetchCollectionType<Article[]>('articles', {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    locale,
  });

  if (!article) {
    notFound();
  }

  const localizedSlugs = article.localizations.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [locale]: slug }
  );

  return (
    <BlogLayout article={article} locale={locale}>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <StructuredData
        data={[
          article.seo?.structuredData,
          buildArticleStructuredData({ locale, slug, article }),
        ]}
      />
      <BlocksRenderer content={article.content} />
    </BlogLayout>
  );
}
