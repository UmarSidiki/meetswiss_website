import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import ClientSlugHandler from '../ClientSlugHandler';
import { BlogCard } from '@/components/blog-card';
import { BlogPostRows } from '@/components/blog-post-rows';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { StructuredData } from '@/components/seo/structured-data';
import { i18n } from '@/i18n.config';
import { fetchSeoSettings } from '@/lib/seo/settings';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType, fetchSingleType } from '@/lib/strapi';
import type { Article, LocaleParamsProps } from '@/types/types';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleParamsProps): Promise<Metadata> {
  const { locale } = await params;
  const [pageData, seoSettings] = await Promise.all([
    fetchSingleType('blog-page', { locale }),
    fetchSeoSettings(locale),
  ]);

  const localizedPaths = (pageData.localizations ?? []).reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = 'blog';
      return acc;
    },
    { [locale]: 'blog' }
  );
  const metadata = generateMetadataObject(pageData.seo, {
    locale,
    pathname: '/blog',
    localizedPaths,
    siteSettings: seoSettings,
  });
  return metadata;
}

export default async function Blog({ params }: LocaleParamsProps) {
  const { locale } = await params;
  const pageData = await fetchSingleType('blog-page', {
    locale: locale,
  });
  const [firstArticle, ...articles] = await fetchCollectionType<Article[]>(
    'articles',
    {
      filters: { locale: { $eq: locale } },
    }
  );

  if (!firstArticle) {
    notFound();
  }

  const localizedSlugs = (pageData.localizations ?? []).reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = 'blog';
      return acc;
    },
    { [locale]: 'blog' }
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] pb-20 pt-28 md:pt-40">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <StructuredData data={pageData.seo?.structuredData} />
      <AmbientColor />
      <Container className="flex flex-col items-center justify-between">
        {/* Editorial header: label left, heading right */}
        <div className="mb-14 w-full animate-in fade-in-0 slide-in-from-bottom-3 duration-500 fill-mode-both border-b border-primary/20 pb-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-0">
            <div className="shrink-0 md:w-44 md:pb-1">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-primary/80">
                Meetswiss
                <br className="hidden md:block" /> Transfers
              </p>
            </div>
            <div className="flex-1 md:border-l md:border-primary/25 md:pl-12">
              <Heading as="h1" size="xl" className="mx-0 text-left">
                {pageData.heading}
              </Heading>
              <Subheading className="mt-3 max-w-2xl text-left text-[#c8bfa8]">
                {pageData.sub_heading}
              </Subheading>
            </div>
          </div>
        </div>

        <div className="w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
          <BlogCard
            article={firstArticle}
            locale={locale}
            key={firstArticle.title}
          />
        </div>

        <div className="w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
          <BlogPostRows articles={articles} locale={locale} />
        </div>
      </Container>
    </div>
  );
}
