import { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { Bodoni_Moda, Manrope } from 'next/font/google';
import { draftMode } from 'next/headers';
import type { PropsWithChildren } from 'react';
import React, { Suspense } from 'react';

import { Banner } from '@/components/banner';
import { DraftModeBanner } from '@/components/draft-mode-banner';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { StructuredData } from '@/components/seo/structured-data';
import { AIToast } from '@/components/toast';
import { SlugProvider } from '@/app/context/SlugContext';
import { localePath } from '@/lib/locale-path';
import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchSeoSettings } from '@/lib/seo/settings';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchSingleType } from '@/lib/strapi';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { cn } from '@/lib/utils';
import type { LocaleParamsProps } from '@/types/types';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
});

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '700'],
  variable: '--font-luxury',
});

// Default Global SEO for pages without them
export async function generateMetadata({
  params,
}: PropsWithChildren<LocaleParamsProps>): Promise<Metadata> {
  const { locale } = await params;
  const [_pageData, seoSettings] = await Promise.all([
    fetchSingleType('global', { locale }),
    fetchSeoSettings(locale),
  ]);
  const pageData = _pageData || {};

  const metadata = generateMetadataObject(pageData?.seo, {
    locale,
    pathname: '/',
    siteSettings: seoSettings,
  });

  metadata.applicationName = seoSettings.siteName;
  metadata.authors = seoSettings.organizationName
    ? [{ name: seoSettings.organizationName, url: seoSettings.organizationUrl }]
    : undefined;
  metadata.creator = seoSettings.organizationName;
  metadata.publisher = seoSettings.organizationName;
  metadata.verification = {
    google: seoSettings.googleSiteVerification,
    yandex: seoSettings.yandexVerification,
    other: seoSettings.bingSiteVerification
      ? { 'msvalidate.01': seoSettings.bingSiteVerification }
      : undefined,
  };
  metadata.other = {
    ...(seoSettings.contactEmail
      ? {
          'contact:email': seoSettings.contactEmail,
        }
      : {}),
    ...(seoSettings.facebookDomainVerification
      ? {
          'facebook-domain-verification':
            seoSettings.facebookDomainVerification,
        }
      : {}),
  };

  // Add favicon from Strapi global if present
  const faviconUrl = pageData.favicon?.url
    ? strapiImage(pageData.favicon.url)
    : undefined;
  if (faviconUrl) {
    metadata.icons = [
      { rel: 'icon', url: faviconUrl, type: 'image/png' },
      { rel: 'shortcut icon', url: faviconUrl, type: 'image/png' },
      { rel: 'apple-touch-icon', url: faviconUrl, type: 'image/png' },
    ];
  }

  return metadata;
}

/**
 * Loading skeleton shown while the dynamic layout shell streams in.
 * Displayed briefly during static prerender of /_not-found.
 */
function LayoutSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <SlugProvider>
      <div
        className={cn(
          manrope.className,
          bodoni.variable,
          'bg-charcoal antialiased h-full w-full'
        )}
      >
        {children}
      </div>
    </SlugProvider>
  );
}

/**
 * Inner async component that performs all dynamic data fetching.
 * Wrapped in <Suspense> so that /_not-found can be statically prerendered.
 */
async function DynamicLocaleShell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  const [_pageData, seoSettings] = await Promise.all([
    fetchSingleType('global', { locale }),
    fetchSeoSettings(locale),
  ]);
  const pageData = _pageData || {};
  const isDemo = process.env.NEXT_IS_DEMO === 'true';
  const orgLogo = seoSettings.organizationLogo?.url;
  const orgLogoAbsolute = orgLogo ? strapiImage(orgLogo) : undefined;
  const logoData = orgLogoAbsolute ? { url: orgLogoAbsolute } : undefined;
  const organizationLd = seoSettings.organizationName
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: seoSettings.organizationName,
        url: seoSettings.organizationUrl || getAbsoluteUrl(localePath(locale)),
        logo: orgLogoAbsolute,
        email: seoSettings.contactEmail,
        sameAs: [
          ...(pageData.footer?.social_media_links || [])
            .map((link: { URL?: string }) => link.URL)
            .filter(Boolean),
        ],
      }
    : null;

  return (
    <SlugProvider>
      <ViewTransitions>
        <StructuredData data={[pageData?.seo?.structuredData, organizationLd]} />
        <div
          className={cn(
            manrope.className,
            bodoni.variable,
            'bg-charcoal antialiased h-full w-full'
          )}
        >
          {isDemo && <Banner />}
          <Navbar
            data={pageData?.navbar}
            locale={locale}
            hasBanner={isDemo}
            logo={logoData}
          />
          {children}
          <Footer data={pageData?.footer} locale={locale} logo={logoData} />
          <AIToast />
          {isDraftMode && <DraftModeBanner />}
        </div>
      </ViewTransitions>
    </SlugProvider>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: PropsWithChildren<LocaleParamsProps>) {
  const { locale } = await params;

  return (
    <Suspense fallback={<LayoutSkeleton>{children}</LayoutSkeleton>}>
      <DynamicLocaleShell locale={locale}>{children}</DynamicLocaleShell>
    </Suspense>
  );
}
