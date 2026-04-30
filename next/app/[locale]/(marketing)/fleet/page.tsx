import type { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { StructuredData } from '@/components/seo/structured-data';
import { FleetCard } from '@/components/services/fleet-card';
import { i18n } from '@/i18n.config';
import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchSeoSettings } from '@/lib/seo/settings';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType, fetchSingleType } from '@/lib/strapi';
import type { LocaleParamsProps } from '@/types/types';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

type Fleet = {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  capacity?: number;
  luggage_capacity?: number;
  image?: { url?: string };
  amenities?: Array<{ text?: string }>;
  localizations?: Array<{ locale: string; slug: string }>;
};

type FleetPageData = {
  heading?: string;
  sub_heading?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    structuredData?: unknown;
  };
  localizations?: Array<{ locale: string }>;
};

function localizedPathMap(locale: string, fleets: Fleet[]) {
  return fleets.reduce(
    (acc: Record<string, string>, fleet) => {
      acc[locale] = 'fleet';
      fleet.localizations?.forEach((item) => {
        acc[item.locale] = 'fleet';
      });
      return acc;
    },
    { [locale]: 'fleet' }
  );
}

export async function generateMetadata({
  params,
}: LocaleParamsProps): Promise<Metadata> {
  const { locale } = await params;
  const [pageData, seoSettings, fleets] = await Promise.all([
    fetchSingleType<FleetPageData>('fleet-page', { locale }),
    fetchSeoSettings(locale),
    fetchCollectionType<Fleet[]>('fleets', {
      locale,
      pagination: { pageSize: 100 },
      sort: ['order:asc', 'name:asc'],
    }),
  ]);

  return generateMetadataObject(
    pageData.seo || {
      metaTitle: pageData.heading
        ? `${pageData.heading} | MeetSwiss Transfers`
        : 'Our Fleet | MeetSwiss Transfers',
      metaDescription: pageData.sub_heading,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: fleets.map((fleet, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: fleet.name,
          url: getAbsoluteUrl(`/${locale}/fleet/${fleet.slug}`),
        })),
      },
    },
    {
      locale,
      pathname: '/fleet',
      localizedPaths: localizedPathMap(locale, fleets),
      siteSettings: seoSettings,
    }
  );
}

export default async function FleetPage({ params }: LocaleParamsProps) {
  const { locale } = await params;
  const [pageData, fleets] = await Promise.all([
    fetchSingleType<FleetPageData>('fleet-page', { locale }),
    fetchCollectionType<Fleet[]>('fleets', {
      locale,
      pagination: { pageSize: 100 },
      sort: ['order:asc', 'name:asc'],
    }),
  ]);

  const localizedSlugs = localizedPathMap(locale, fleets);
  const fleetLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: fleets.map((fleet, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: fleet.name,
      url: getAbsoluteUrl(`/${locale}/fleet/${fleet.slug}`),
    })),
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] pb-24 pt-28 md:pt-40">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <StructuredData data={fleetLd} />
      <AmbientColor />
      <Container>
        <div className="mb-14 animate-in fade-in-0 slide-in-from-bottom-3 duration-500 fill-mode-both border-b border-primary/20 pb-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-0">
            <div className="shrink-0 md:w-44 md:pb-1">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-primary/80">
                Meetswiss
                <br className="hidden md:block" /> Transfers
              </p>
            </div>
            <div className="flex-1 md:border-l md:border-primary/25 md:pl-12">
              <Heading as="h1" size="xl" className="mx-0 text-left">
                {pageData.heading || 'Our Fleet'}
              </Heading>
              {pageData.sub_heading && (
                <Subheading className="mt-3 max-w-2xl text-left text-[#c8bfa8]">
                  {pageData.sub_heading}
                </Subheading>
              )}
            </div>
          </div>
        </div>
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {fleets.length ? (
            fleets.map((fleet, index) => (
              <FleetCard
                key={fleet.id || `${fleet.slug}-${index}`}
                fleet={fleet}
                locale={locale}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-primary/20 bg-[#111] p-10 text-center text-[#9c9179] md:col-span-2 lg:col-span-3">
              Fleet entries will appear here once published in Strapi.
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
