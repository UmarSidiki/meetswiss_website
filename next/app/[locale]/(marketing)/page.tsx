import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ClientSlugHandler from './ClientSlugHandler';
import {
  MeetswissHomepage,
  type MeetswissHomepageContent,
} from '@/components/meetswiss/homepage';
import { i18n } from '@/i18n.config';
import { fetchSeoSettings } from '@/lib/seo/settings';
import { fetchCollectionType } from '@/lib/strapi';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { generateMetadataObject } from '@/lib/shared/metadata';
import type { LocaleParamsProps } from '@/types/types';

type HomepagePage = {
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  localizations?: Array<{ locale: string }>;
  dynamic_zone?: Array<any>;
};

type FleetEntity = {
  name: string;
  slug: string;
  description?: string;
  capacity?: number;
  luggage_capacity?: number;
  image?: { url?: string };
};

type ServiceEntity = {
  title: string;
  slug: string;
  short_description?: string;
  hero_image?: { url?: string };
};

type ArticleEntity = {
  title: string;
  slug: string;
  description?: string;
  image?: { url?: string };
};

type TransferEntity = {
  title?: string;
  slug?: string;
  short_description?: string;
  hero_image?: { url?: string };
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

function buildHomepageContent({
  pageData,
  fleets,
  services,
  articles,
  transfers,
}: {
  pageData: HomepagePage;
  fleets: FleetEntity[];
  services: ServiceEntity[];
  articles: ArticleEntity[];
  transfers: TransferEntity[];
}): MeetswissHomepageContent {
  const heroBlock = pageData.dynamic_zone?.find(
    (item) => item?.__component === 'dynamic-zone.hero'
  ) as
    | {
        eyebrow?: string;
        form_embed_html?: string;
        button?: { text?: string; URL?: string; target?: string };
        slides?: Array<{
          image?: { url?: string };
          heading?: string;
          paragraph?: string;
        }>;
      }
    | undefined;
  const howItWorksBlock = pageData.dynamic_zone?.find(
    (item) => item?.__component === 'dynamic-zone.how-it-works'
  );
  const faqBlock = pageData.dynamic_zone?.find(
    (item) => item?.__component === 'dynamic-zone.faq'
  );
  const testimonialsBlock = pageData.dynamic_zone?.find(
    (item) => item?.__component === 'dynamic-zone.testimonials'
  );
  const brandsBlock = pageData.dynamic_zone?.find(
    (item) => item?.__component === 'dynamic-zone.brands'
  );
  const whyChooseUsBlock = pageData.dynamic_zone?.find(
    (item) => item?.__component === 'dynamic-zone.why-choose-us'
  );
  const statsBlock = pageData.dynamic_zone?.find(
    (item) => item?.__component === 'dynamic-zone.stats'
  );
  const aboutBlock = pageData.dynamic_zone?.find(
    (item) => item?.__component === 'dynamic-zone.about'
  );
  const citiesBlock = pageData.dynamic_zone?.find(
    (item) => item?.__component === 'dynamic-zone.cities'
  ) as
    | {
        heading?: string;
        sub_heading?: string;
        cities?: TransferEntity[];
      }
    | undefined;
  const ctaBlock = pageData.dynamic_zone?.find(
    (item) => item?.__component === 'dynamic-zone.cta'
  ) as
    | {
        heading?: string;
        sub_heading?: string;
        CTAs?: Array<{ text?: string; URL?: string; target?: string }>;
      }
    | undefined;

  const slidesRaw = heroBlock?.slides || [];

  const heroSlides = slidesRaw
    .filter((slide) => Boolean(slide?.image?.url))
    .map((slide) => ({
      image: strapiImage(slide.image!.url!),
      heading: slide.heading || '',
      paragraph: slide.paragraph || '',
    }));

  const partnerLogos =
    brandsBlock?.logos
      ?.map((logo: any) => ({
        src: logo?.image?.url ? strapiImage(logo.image.url) : '',
        alt: logo?.image?.alternativeText || logo?.company || 'Partner logo',
      }))
      .filter((logo: { src: string }) => Boolean(logo.src)) || [];
  const partnerHeading = brandsBlock?.heading || '';
  const partnerSubheading = brandsBlock?.sub_heading || '';

  const whyChooseUs = whyChooseUsBlock
    ? {
        heading: whyChooseUsBlock.heading || '',
        subheading: whyChooseUsBlock.sub_heading || '',
        cards:
          whyChooseUsBlock.cards
            ?.filter((card: any) => Boolean(card?.title))
            .map((card: any) => ({
              icon: card.icon || 'shield',
              title: card.title || '',
              description: card.description || '',
            })) || [],
      }
    : { heading: '', subheading: '', cards: [] };

  const stats = statsBlock
    ? {
        heading: statsBlock.heading || '',
        items:
          statsBlock.items
            ?.filter((item: any) => Boolean(item?.value))
            .map((item: any) => ({
              value: item.value || '',
              label: item.label || '',
            })) || [],
      }
    : { heading: '', items: [] };

  const about = aboutBlock
    ? {
        heading: aboutBlock.heading || '',
        description: aboutBlock.description || '',
        button: aboutBlock.button?.text
          ? {
              text: aboutBlock.button.text,
              url: aboutBlock.button.URL || '#',
              target: aboutBlock.button.target,
            }
          : undefined,
        images:
          aboutBlock.images
            ?.map((img: any) => (img?.url ? strapiImage(img.url) : ''))
            .filter((src: string) => Boolean(src)) || [],
      }
    : { heading: '', description: '', images: [] as string[] };

  const citiesSource =
    citiesBlock?.cities && citiesBlock.cities.length > 0
      ? citiesBlock.cities
      : transfers;

  const cities = {
    heading: citiesBlock?.heading || '',
    subheading: citiesBlock?.sub_heading || '',
    items:
      citiesSource
        ?.filter((city) => Boolean(city?.title) && Boolean(city?.slug))
        .map((city) => ({
          title: city.title || '',
          slug: city.slug || '',
          description: city.short_description || '',
          image: city.hero_image?.url ? strapiImage(city.hero_image.url) : '',
        })) || [],
  };

  return {
    hero: {
      eyebrow: heroBlock?.eyebrow || '',
      slides: heroSlides,
      formEmbedHtml: heroBlock?.form_embed_html || '',
      button: heroBlock?.button?.text
        ? {
            text: heroBlock.button.text,
            url: heroBlock.button.URL || '#booking',
            target: heroBlock.button.target,
          }
        : undefined,
    },
    fleets: fleets
      .filter((fleet) => fleet.name && fleet.slug)
      .map((fleet) => ({
        title: fleet.name,
        subtitle: fleet.description || '',
        passengers: fleet.capacity || 0,
        luggage: fleet.luggage_capacity || 0,
        image: fleet.image?.url ? strapiImage(fleet.image.url) : '',
        slug: fleet.slug,
      })),
    services: services
      .filter((service) => service.title && service.slug)
      .map((service) => ({
        title: service.title,
        image: service.hero_image?.url
          ? strapiImage(service.hero_image.url)
          : '',
        slug: service.slug,
      })),
    news: articles
      .filter((article) => article.title && article.slug)
      .map((article) => ({
        title: article.title,
        image: article.image?.url ? strapiImage(article.image.url) : '',
        slug: article.slug,
      })),
    testimonialsHeading: testimonialsBlock?.heading || '',
    testimonialsSubheading: testimonialsBlock?.sub_heading || '',
    testimonials:
      testimonialsBlock?.testimonials
        ?.filter((item: any) => Boolean(item?.text))
        .map((item: any) => ({
          name:
            [item?.user?.firstname, item?.user?.lastname]
              .filter(Boolean)
              .join(' ') || '',
          role: item?.user?.job || '',
          review: item?.text || '',
          avatar: item?.user?.image?.url
            ? strapiImage(item.user.image.url)
            : '',
        })) || [],
    faqItems:
      faqBlock?.faqs
        ?.filter((faq: any) => Boolean(faq?.question) && Boolean(faq?.answer))
        .map((faq: any) => ({
          question: faq.question,
          answer: faq.answer,
        })) || [],
    partnerLogos,
    partnerHeading,
    partnerSubheading,
    whyChooseUs,
    stats,
    about,
    cities,
    howItWorks: {
      title: howItWorksBlock?.heading || '',
      steps:
        howItWorksBlock?.steps
          ?.map((step: any) =>
            [step?.title, step?.description].filter(Boolean).join(' — ')
          )
          .filter((step: string) => Boolean(step)) || [],
    },
    cta: {
      heading: ctaBlock?.heading || '',
      subheading: ctaBlock?.sub_heading || '',
      buttons:
        ctaBlock?.CTAs
          ?.filter((btn: any) => Boolean(btn?.text))
          .map((btn: any) => ({
            text: btn.text || '',
            url: btn.URL || '#',
            target: btn.target,
          })) || [],
    },
  };
}

export async function generateMetadata({
  params,
}: LocaleParamsProps): Promise<Metadata> {
  const { locale } = await params;

  const [pageData, seoSettings] = await Promise.all([
    fetchCollectionType<HomepagePage[]>('pages', {
      filters: { slug: { $eq: 'homepage' }, locale },
    }).then((items) => items[0]),
    fetchSeoSettings(locale),
  ]);

  if (!pageData) {
    notFound();
  }

  const localizedPaths = Object.fromEntries(i18n.locales.map((l) => [l, '']));

  return generateMetadataObject(pageData.seo, {
    locale,
    pathname: '/',
    localizedPaths,
    siteSettings: seoSettings,
  });
}

export default async function HomePage({ params }: LocaleParamsProps) {
  const { locale } = await params;

  const [pageData, fleets, services, articles, transfers] = await Promise.all([
    fetchCollectionType<HomepagePage[]>('pages', {
      filters: {
        slug: {
          $eq: 'homepage',
        },
        locale: locale,
      },
    }).then((items) => items[0]),
    fetchCollectionType<FleetEntity[]>('fleets', {
      locale,
      sort: ['order:asc', 'name:asc'],
      pagination: { pageSize: 12 },
    }),
    fetchCollectionType<ServiceEntity[]>('services', {
      locale,
      sort: ['order:asc', 'title:asc'],
      pagination: { pageSize: 12 },
    }),
    fetchCollectionType<ArticleEntity[]>('articles', {
      locale,
      sort: ['publishedAt:desc'],
      pagination: { pageSize: 6 },
    }),
    fetchCollectionType<TransferEntity[]>('transfers', {
      locale,
      sort: ['order:asc', 'title:asc'],
      pagination: { pageSize: 12 },
    }),
  ]);

  if (!pageData) {
    notFound();
  }

  const localizedSlugs =
    pageData.localizations?.reduce(
      (acc: Record<string, string>, localization: { locale: string }) => {
        acc[localization.locale] = '';
        return acc;
      },
      { [locale]: '' }
    ) ||
    (Object.fromEntries(
      i18n.locales.map((language) => [language, ''])
    ) as Record<string, string>);

  const homepageContent = buildHomepageContent({
    pageData,
    fleets,
    services,
    articles,
    transfers,
  });

  return (
    <>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <MeetswissHomepage locale={locale} content={homepageContent} />
    </>
  );
}
