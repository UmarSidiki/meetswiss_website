import {
  type BlocksContent,
  BlocksRenderer,
} from '@strapi/blocks-react-renderer';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ClientSlugHandler from '../../ClientSlugHandler';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { StructuredData } from '@/components/seo/structured-data';
import { TransferBookingFormEmbed } from '@/components/transfers/transfer-booking-form-embed';
import { StrapiImage } from '@/components/ui/strapi-image';
import { i18n } from '@/i18n.config';
import { localePath } from '@/lib/locale-path';
import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchSeoSettings } from '@/lib/seo/settings';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionAllLocales, fetchCollectionType } from '@/lib/strapi';
import type { LocaleSlugParamsProps } from '@/types/types';

type Transfer = {
  title: string;
  slug: string;
  short_description?: string;
  mini_hero_title?: string;
  booking_form_embed_html?: string;
  hero_image?: { url?: string };
  content?: BlocksContent;
  localizations?: Array<{ locale: string; slug: string }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    structuredData?: unknown;
  };
};

export async function generateStaticParams() {
  const transfers = await fetchCollectionAllLocales<
    Array<{ slug: string; locale: string }>
  >('transfers', {
    fields: ['slug', 'locale'],
    pagination: { pageSize: 1000 },
  });

  const params = transfers
    .filter((transfer) => transfer.slug)
    .map((transfer) => ({
      locale: transfer.locale,
      slug: transfer.slug,
    }));

  return params.length > 0
    ? params
    : [{ locale: i18n.defaultLocale, slug: '_placeholder' }];
}

function buildLocalizedSlugs(
  locale: string,
  slug: string,
  transfer: Transfer
): Record<string, string> {
  const localizedSlugs: Record<string, string> = {
    [locale]: slug,
  };

  for (const item of transfer.localizations ?? []) {
    localizedSlugs[item.locale] = item.slug;
  }

  return localizedSlugs;
}

function buildLocalizedPaths(
  locale: string,
  slug: string,
  transfer: Transfer
): Record<string, string> {
  const localizedPaths: Record<string, string> = {
    [locale]: `transfers/${slug}`,
  };

  for (const item of transfer.localizations ?? []) {
    localizedPaths[item.locale] = `transfers/${item.slug}`;
  }

  return localizedPaths;
}

export async function generateMetadata({
  params,
}: LocaleSlugParamsProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const [[transfer], seoSettings] = await Promise.all([
    fetchCollectionType<Transfer[]>('transfers', {
      locale,
      filters: { slug: { $eq: slug } },
    }),
    fetchSeoSettings(locale),
  ]);

  if (!transfer) {
    return generateMetadataObject(null, {
      locale,
      pathname: '/transfers',
      siteSettings: seoSettings,
    });
  }

  return generateMetadataObject(
    transfer.seo || {
      metaTitle: `${transfer.title} Private Transfer | MeetSwiss Transfers`,
      metaDescription:
        transfer.short_description ||
        `Book a private luxury transfer to ${transfer.title} with MeetSwiss. Instant pricing, professional chauffeurs.`,
    },
    {
      locale,
      pathname: `/transfers/${slug}`,
      localizedPaths: buildLocalizedPaths(locale, slug, transfer),
      siteSettings: seoSettings,
    }
  );
}

export default async function TransferDetailPage({
  params,
}: LocaleSlugParamsProps) {
  const { locale, slug } = await params;
  const [transfer] = await fetchCollectionType<Transfer[]>('transfers', {
    locale,
    filters: { slug: { $eq: slug } },
  });

  if (!transfer) {
    notFound();
  }

  const localizedSlugs = buildLocalizedSlugs(locale, slug, transfer);
  const transferLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: transfer.title,
    description: transfer.short_description,
    url: getAbsoluteUrl(localePath(locale, `/transfers/${slug}`)),
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] pb-24 pt-20 md:pt-28">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <StructuredData data={[transfer.seo?.structuredData, transferLd]} />
      <AmbientColor />

      <section className="relative overflow-hidden border-b border-primary/20">
        {transfer.hero_image?.url ? (
          <StrapiImage
            src={transfer.hero_image.url}
            alt={transfer.title}
            width={1800}
            height={900}
            className="h-[22rem] w-full object-cover md:h-[30rem]"
          />
        ) : (
          <div className="h-[22rem] w-full bg-gradient-to-br from-[#1c1a14] to-[#0a0a0a] md:h-[26rem]" />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0.25)_0%,rgba(10,10,10,0.55)_50%,rgba(10,10,10,0.98)_100%)]" />

        <Container className="absolute inset-x-0 bottom-0 pb-10 md:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Transfer Destination
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif] md:text-5xl">
            {transfer.mini_hero_title || transfer.title}
          </h1>
          {transfer.short_description && (
            <p className="mt-4 max-w-2xl text-base leading-[1.7] text-[#d4cabc]">
              {transfer.short_description}
            </p>
          )}
        </Container>
      </section>

      <Container className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <aside className="rounded-2xl border border-primary/25 bg-[#111] p-6 lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-xl font-semibold text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
            Book Your Transfer
          </h2>
          <p className="mt-2 text-sm leading-[1.65] text-[#c8bfa8]">
            Check routes, prices, and availability in minutes.
          </p>
          <div className="mt-5 overflow-hidden rounded-xl border border-primary/20 bg-[#0a0a0a] p-3">
            <TransferBookingFormEmbed
              embedHtml={transfer.booking_form_embed_html}
            />
          </div>
        </aside>

        <article className="prose prose-invert max-w-none lg:col-span-3 prose-headings:font-display prose-headings:text-[#f5f1e8] prose-p:text-[#d4cabc] prose-p:leading-[1.78] prose-a:text-primary hover:prose-a:text-amber-300 prose-strong:text-[#f5f1e8] prose-hr:border-primary/20 prose-li:text-[#d4cabc]">
          {transfer.content ? (
            <BlocksRenderer content={transfer.content} />
          ) : (
            <p className="text-[#9c9179]">
              Full transfer destination guide will appear here after adding it
              in Strapi.
            </p>
          )}
        </article>
      </Container>
    </div>
  );
}
