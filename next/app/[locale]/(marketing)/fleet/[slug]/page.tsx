import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ClientSlugHandler from '../../ClientSlugHandler';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { StructuredData } from '@/components/seo/structured-data';
import { ServiceCard } from '@/components/services/service-card';
import { StrapiImage } from '@/components/ui/strapi-image';
import { i18n } from '@/i18n.config';
import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchSeoSettings } from '@/lib/seo/settings';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType } from '@/lib/strapi';
import type { LocaleSlugParamsProps } from '@/types/types';

export async function generateStaticParams() {
  const fleets = await fetchCollectionType<
    Array<{ slug: string; locale: string }>
  >('fleets', {
    fields: ['slug', 'locale'],
    locale: 'all',
    pagination: { pageSize: 1000 },
  });

  const params = fleets
    .filter((f) => f.slug)
    .map((f) => ({
      locale: f.locale,
      slug: f.slug,
    }));

  return params.length > 0
    ? params
    : [{ locale: i18n.defaultLocale, slug: '_placeholder' }];
}

type Service = {
  title: string;
  slug: string;
  short_description?: string;
  hero_image?: { url?: string };
};

type Fleet = {
  name: string;
  slug: string;
  description?: string;
  capacity?: number;
  luggage_capacity?: number;
  image?: { url?: string };
  amenities?: Array<{ text?: string }>;
  services?: Service[];
  localizations?: Array<{ locale: string; slug: string }>;
};

function buildLocalizedSlugs(
  locale: string,
  slug: string,
  fleet: Fleet
): Record<string, string> {
  const localizedSlugs: Record<string, string> = {
    [locale]: slug,
  };

  for (const item of fleet.localizations ?? []) {
    localizedSlugs[item.locale] = item.slug;
  }

  return localizedSlugs;
}

function buildLocalizedPaths(
  locale: string,
  slug: string,
  fleet: Fleet
): Record<string, string> {
  const localizedPaths: Record<string, string> = {
    [locale]: `fleet/${slug}`,
  };

  for (const item of fleet.localizations ?? []) {
    localizedPaths[item.locale] = `fleet/${item.slug}`;
  }

  return localizedPaths;
}

export async function generateMetadata({
  params,
}: LocaleSlugParamsProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const [[fleet], seoSettings] = await Promise.all([
    fetchCollectionType<Fleet[]>('fleets', {
      locale,
      filters: { slug: { $eq: slug } },
    }),
    fetchSeoSettings(locale),
  ]);

  if (!fleet) {
    return generateMetadataObject(null, {
      locale,
      pathname: '/fleet',
      siteSettings: seoSettings,
    });
  }

  return generateMetadataObject(
    {
      metaTitle: `${fleet.name} | MeetSwiss Transfers Fleet`,
      metaDescription:
        fleet.description ||
        'Explore this premium Meetswiss Transfers vehicle with private chauffeur service.',
    },
    {
      locale,
      pathname: `/fleet/${slug}`,
      localizedPaths: buildLocalizedPaths(locale, slug, fleet),
      siteSettings: seoSettings,
    }
  );
}

export default async function FleetDetailPage({
  params,
}: LocaleSlugParamsProps) {
  const { locale, slug } = await params;
  const [fleet] = await fetchCollectionType<Fleet[]>('fleets', {
    locale,
    filters: { slug: { $eq: slug } },
  });

  if (!fleet) {
    notFound();
  }

  const localizedSlugs = buildLocalizedSlugs(locale, slug, fleet);
  const fleetLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: fleet.name,
    description: fleet.description,
    url: getAbsoluteUrl(`/${locale}/fleet/${slug}`),
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] pb-24 pt-28 md:pt-40">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <StructuredData data={fleetLd} />
      <AmbientColor />
      <Container>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Our Fleet
          </p>
          <Heading as="h1" size="xl" className="mt-3">
            {fleet.name}
          </Heading>
          {fleet.description && (
            <Subheading className="mx-auto mt-4 max-w-2xl text-[#c8bfa8]">
              {fleet.description}
            </Subheading>
          )}
        </div>

        {fleet.image?.url ? (
          <div className="mt-10 overflow-hidden rounded-2xl border border-primary/20">
            <StrapiImage
              src={fleet.image.url}
              alt={fleet.name}
              width={1600}
              height={900}
              className="h-[22rem] w-full object-cover md:h-[32rem]"
            />
          </div>
        ) : null}

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-primary/25 bg-[#111] px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Passengers
            </p>
            <p className="mt-2 text-3xl font-medium text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
              Up to {fleet.capacity || 4}
            </p>
            <p className="mt-1 text-sm text-[#c8bfa8]">
              Comfortable seating for your party
            </p>
          </article>

          <article className="rounded-2xl border border-primary/25 bg-[#111] px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Luggage
            </p>
            <p className="mt-2 text-3xl font-medium text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
              {fleet.luggage_capacity || 3} items
            </p>
            <p className="mt-1 text-sm text-[#c8bfa8]">
              Standard checked luggage
            </p>
          </article>
        </div>

        {fleet.amenities?.filter((a) => a?.text).length ? (
          <section className="mx-auto mt-12 max-w-4xl">
            <Heading as="h2" size="md" className="text-left mx-0">
              On-board amenities
            </Heading>
            <div className="mt-5 flex flex-wrap gap-2">
              {fleet.amenities
                .filter((amenity) => amenity?.text)
                .map((amenity, index) => (
                  <span
                    key={`${fleet.slug}-amenity-${index}`}
                    className="rounded-full border border-primary/35 bg-[#111] px-4 py-2 text-sm text-primary"
                  >
                    {amenity.text}
                  </span>
                ))}
            </div>
          </section>
        ) : null}

        {fleet.services?.length ? (
          <section className="mt-16">
            <Heading as="h2" size="md">
              Available for these services
            </Heading>
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              {fleet.services.map((service, index) => (
                <ServiceCard
                  key={`${fleet.slug}-service-${index}`}
                  service={service}
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
