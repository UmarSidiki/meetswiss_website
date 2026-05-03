import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ClientSlugHandler from '../../ClientSlugHandler';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { StructuredData } from '@/components/seo/structured-data';
import { FleetCard } from '@/components/services/fleet-card';
import { StrapiImage } from '@/components/ui/strapi-image';
import { i18n } from '@/i18n.config';
import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchSeoSettings } from '@/lib/seo/settings';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionAllLocales, fetchCollectionType } from '@/lib/strapi';
import type { LocaleSlugParamsProps } from '@/types/types';

export async function generateStaticParams() {
  const services = await fetchCollectionAllLocales<
    Array<{ slug: string; locale: string }>
  >('services', {
    fields: ['slug', 'locale'],
    pagination: { pageSize: 1000 },
  });

  const params = services
    .filter((s) => s.slug)
    .map((s) => ({
      locale: s.locale,
      slug: s.slug,
    }));

  return params.length > 0
    ? params
    : [{ locale: i18n.defaultLocale, slug: '_placeholder' }];
}

type Fleet = {
  name: string;
  slug?: string;
  description?: string;
  capacity?: number;
  luggage_capacity?: number;
  image?: { url?: string };
  amenities?: Array<{ text?: string }>;
};

type Service = {
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  hero_image?: { url?: string };
  service_points?: Array<{ title?: string; description?: string }>;
  fleets?: Fleet[];
  localizations?: Array<{ locale: string; slug: string }>;
  seo?: {
    structuredData?: unknown;
  };
  updatedAt?: string;
};

function buildLocalizedSlugs(
  locale: string,
  slug: string,
  service: Service
): Record<string, string> {
  const localizedSlugs: Record<string, string> = {
    [locale]: slug,
  };

  for (const item of service.localizations ?? []) {
    localizedSlugs[item.locale] = item.slug;
  }

  return localizedSlugs;
}

function buildLocalizedPaths(
  locale: string,
  slug: string,
  service: Service
): Record<string, string> {
  const localizedPaths: Record<string, string> = {
    [locale]: `services/${slug}`,
  };

  for (const item of service.localizations ?? []) {
    localizedPaths[item.locale] = `services/${item.slug}`;
  }

  return localizedPaths;
}

export async function generateMetadata({
  params,
}: LocaleSlugParamsProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const [[service], seoSettings] = await Promise.all([
    fetchCollectionType<Service[]>('services', {
      locale,
      filters: { slug: { $eq: slug } },
    }),
    fetchSeoSettings(locale),
  ]);

  if (!service) {
    return generateMetadataObject(null, {
      locale,
      pathname: '/services',
      siteSettings: seoSettings,
    });
  }

  return generateMetadataObject(
    service.seo || {
      metaTitle: `${service.title} | MeetSwiss Transfers`,
      metaDescription:
        service.short_description ||
        'Premium chauffeur transfer service by MeetSwiss Transfers.',
    },
    {
      locale,
      pathname: `/services/${slug}`,
      localizedPaths: buildLocalizedPaths(locale, slug, service),
      siteSettings: seoSettings,
    }
  );
}

export default async function ServiceDetailPage({
  params,
}: LocaleSlugParamsProps) {
  const { locale, slug } = await params;
  const [service] = await fetchCollectionType<Service[]>('services', {
    locale,
    filters: { slug: { $eq: slug } },
  });

  if (!service) {
    notFound();
  }

  const localizedSlugs = buildLocalizedSlugs(locale, slug, service);
  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description || service.short_description,
    url: getAbsoluteUrl(`/${locale}/services/${slug}`),
    areaServed: 'Switzerland',
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] pb-24 pt-28 md:pt-40">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <StructuredData data={[service.seo?.structuredData, serviceLd]} />
      <AmbientColor />
      <Container>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Our Services
          </p>
          <Heading as="h1" size="xl" className="mt-3">
            {service.title}
          </Heading>
          {(service.short_description || service.description) && (
            <Subheading className="mx-auto mt-4 max-w-2xl text-[#c8bfa8]">
              {service.short_description || service.description}
            </Subheading>
          )}
        </div>

        {service.hero_image?.url ? (
          <div className="mt-10 overflow-hidden rounded-2xl border border-primary/20">
            <StrapiImage
              src={service.hero_image.url}
              alt={service.title}
              width={1600}
              height={900}
              className="h-[22rem] w-full object-cover md:h-[32rem]"
            />
          </div>
        ) : null}

        {service.description && service.short_description ? (
          <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-[1.78] text-[#d4cabc]">
            {service.description}
          </p>
        ) : null}

        {service.service_points?.length ? (
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            {service.service_points.map((point, index) => (
              <article
                key={`${service.slug}-point-${index}`}
                className="rounded-2xl border border-primary/25 bg-[#111] px-6 py-6"
              >
                <h3 className="text-lg font-medium text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
                  {point.title || `Detail ${index + 1}`}
                </h3>
                {point.description ? (
                  <p className="mt-2 text-sm leading-[1.7] text-[#c8bfa8]">
                    {point.description}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        {service.fleets?.length ? (
          <section className="mt-16">
            <Heading as="h2" size="md">
              Vehicles for this service
            </Heading>
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {service.fleets.map((fleet, index) => (
                <FleetCard
                  key={`${service.slug}-fleet-${index}`}
                  fleet={fleet}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </div>
  );
}
