import type { Metadata } from 'next';
import { Link } from 'next-view-transitions';

import ClientSlugHandler from '../ClientSlugHandler';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { StructuredData } from '@/components/seo/structured-data';
import { StrapiImage } from '@/components/ui/strapi-image';
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

type Transfer = {
  id?: number;
  title: string;
  slug: string;
  short_description?: string;
  hero_image?: { url?: string };
  localizations?: Array<{ locale: string; slug: string }>;
};

type TransfersPageData = {
  heading?: string;
  sub_heading?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    structuredData?: unknown;
  };
  localizations?: Array<{ locale: string }>;
};

function localizedPathMap(locale: string, transfers: Transfer[]) {
  return transfers.reduce(
    (acc: Record<string, string>, transfer) => {
      acc[locale] = 'transfers';
      transfer.localizations?.forEach((item) => {
        acc[item.locale] = 'transfers';
      });
      return acc;
    },
    { [locale]: 'transfers' }
  );
}

export async function generateMetadata({
  params,
}: LocaleParamsProps): Promise<Metadata> {
  const { locale } = await params;
  const [pageData, seoSettings, transfers] = await Promise.all([
    fetchSingleType<TransfersPageData>('transfers-page', { locale }),
    fetchSeoSettings(locale),
    fetchCollectionType<Transfer[]>('transfers', {
      locale,
      pagination: { pageSize: 200 },
      sort: ['order:asc', 'title:asc'],
    }),
  ]);

  return generateMetadataObject(
    pageData.seo || {
      metaTitle: pageData.heading
        ? `${pageData.heading} | MeetSwiss Transfers`
        : 'Transfer Destinations | MeetSwiss Transfers',
      metaDescription: pageData.sub_heading,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: transfers.map((transfer, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: transfer.title,
          url: getAbsoluteUrl(localePath(locale, `/transfers/${transfer.slug}`)),
        })),
      },
    },
    {
      locale,
      pathname: '/transfers',
      localizedPaths: localizedPathMap(locale, transfers),
      siteSettings: seoSettings,
    }
  );
}

export default async function TransfersPage({ params }: LocaleParamsProps) {
  const { locale } = await params;
  const [pageData, transfers] = await Promise.all([
    fetchSingleType<TransfersPageData>('transfers-page', { locale }),
    fetchCollectionType<Transfer[]>('transfers', {
      locale,
      pagination: { pageSize: 200 },
      sort: ['order:asc', 'title:asc'],
    }),
  ]);

  const localizedSlugs = localizedPathMap(locale, transfers);
  const transfersLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: transfers.map((transfer, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: transfer.title,
      url: getAbsoluteUrl(localePath(locale, `/transfers/${transfer.slug}`)),
    })),
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] pb-24 pt-28 md:pt-40">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <StructuredData data={transfersLd} />
      <AmbientColor />
      <Container>
        <div className="mb-14 border-b border-primary/20 pb-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-0">
            <div className="shrink-0 md:w-44 md:pb-1">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-primary/80">
                Meetswiss
                <br className="hidden md:block" /> Transfers
              </p>
            </div>
            <div className="flex-1 md:border-l md:border-primary/25 md:pl-12">
              <Heading as="h1" size="xl" className="mx-0 text-left">
                {pageData.heading || 'Transfer Destinations'}
              </Heading>
              {pageData.sub_heading && (
                <Subheading className="mt-3 max-w-2xl text-left text-[#c8bfa8]">
                  {pageData.sub_heading}
                </Subheading>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {transfers.length ? (
            transfers.map((transfer, index) => (
              <Link
                key={transfer.id || `${transfer.slug}-${index}`}
                href={localePath(locale, `/transfers/${transfer.slug}`)}
                className="group overflow-hidden rounded-2xl border border-primary/25 bg-[#111] transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_18px_36px_rgba(0,0,0,0.4)]"
              >
                <div className="relative overflow-hidden">
                  {transfer.hero_image?.url ? (
                    <StrapiImage
                      src={transfer.hero_image.url}
                      alt={transfer.title}
                      width={1200}
                      height={720}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gradient-to-br from-[#1c1a14] to-[#0a0a0a]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-medium text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
                    {transfer.title}
                  </h2>
                  {transfer.short_description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-[1.65] text-[#c8bfa8]">
                      {transfer.short_description}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary transition-colors duration-200 group-hover:text-amber-300">
                    View transfers
                    <svg
                      className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2.5 6h7M6.5 3l3 3-3 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-primary/20 bg-[#111] p-10 text-center text-[#9c9179] md:col-span-2 lg:col-span-3">
              Transfer destinations will appear here once published in Strapi.
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
