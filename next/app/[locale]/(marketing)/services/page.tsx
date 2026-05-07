import type { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { StructuredData } from '@/components/seo/structured-data';
import { ServiceCard } from '@/components/services/service-card';
import { i18n } from '@/i18n.config';
import { localePath } from '@/lib/locale-path';
import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchSeoSettings } from '@/lib/seo/settings';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType, fetchSingleType } from '@/lib/strapi';
import type { LocaleParamsProps } from '@/types/types';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

type Service = {
  id?: number;
  title: string;
  slug: string;
  short_description?: string;
  hero_image?: { url?: string };
  localizations?: Array<{ locale: string; slug: string }>;
  seo?: { structuredData?: unknown };
};

type ServicesPageData = {
  heading?: string;
  sub_heading?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    structuredData?: unknown;
  };
  localizations?: Array<{ locale: string }>;
};

function localizedPathMap(locale: string, services: Service[]) {
  return services.reduce(
    (acc: Record<string, string>, service) => {
      acc[locale] = 'services';
      service.localizations?.forEach((item) => {
        acc[item.locale] = 'services';
      });
      return acc;
    },
    { [locale]: 'services' }
  );
}

export async function generateMetadata({
  params,
}: LocaleParamsProps): Promise<Metadata> {
  const { locale } = await params;
  const [pageData, seoSettings, services] = await Promise.all([
    fetchSingleType<ServicesPageData>('services-page', { locale }),
    fetchSeoSettings(locale),
    fetchCollectionType<Service[]>('services', {
      locale,
      pagination: { pageSize: 100 },
      sort: ['order:asc', 'title:asc'],
    }),
  ]);

  return generateMetadataObject(
    pageData.seo || {
      metaTitle: pageData.heading
        ? `${pageData.heading} | MeetSwiss Transfers`
        : 'Our Services | MeetSwiss Transfers',
      metaDescription: pageData.sub_heading,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: services.map((service, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: service.title,
          url: getAbsoluteUrl(localePath(locale, `/services/${service.slug}`)),
        })),
      },
    },
    {
      locale,
      pathname: '/services',
      localizedPaths: localizedPathMap(locale, services),
      siteSettings: seoSettings,
    }
  );
}

export default async function ServicesPage({ params }: LocaleParamsProps) {
  const { locale } = await params;
  const [pageData, services] = await Promise.all([
    fetchSingleType<ServicesPageData>('services-page', { locale }),
    fetchCollectionType<Service[]>('services', {
      locale,
      pagination: { pageSize: 100 },
      sort: ['order:asc', 'title:asc'],
    }),
  ]);

  const localizedSlugs = localizedPathMap(locale, services);
  const servicesLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.title,
      url: getAbsoluteUrl(`/${locale}/services/${service.slug}`),
    })),
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] pb-24 pt-28 md:pt-40">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <StructuredData data={servicesLd} />
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
                {pageData.heading || 'Our Services'}
              </Heading>
              {pageData.sub_heading && (
                <Subheading className="mt-3 max-w-2xl text-left text-[#c8bfa8]">
                  {pageData.sub_heading}
                </Subheading>
              )}
            </div>
          </div>
        </div>

        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both grid grid-cols-1 gap-5 md:grid-cols-2">
          {services.length ? (
            services.map((service) => (
              <ServiceCard
                key={service.id || `${service.slug}-${service.title}`}
                service={service}
                locale={locale}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-primary/20 bg-[#111] p-10 text-center text-[#9c9179] md:col-span-2">
              Services will appear here once published in Strapi.
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
