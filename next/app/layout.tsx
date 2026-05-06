import type { Metadata, Viewport } from 'next';
import { Geist_Mono } from 'next/font/google';
import { EB_Garamond, Lato } from 'next/font/google';
import { Suspense } from 'react';

import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchSingleType } from '@/lib/strapi';

import './globals.css';

import { SlugProvider } from '@/app/context/SlugContext';
import { Preview } from '@/components/preview';

// Luxury serif display font
const displayFont = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

// Refined sans-serif body font
const bodyFont = Lato({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '700', '900'],
  display: 'swap',
});

const monoFont = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MeetSwiss Transfers';

export const metadata: Metadata = {
  metadataBase: new URL(getAbsoluteUrl('/')),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || undefined,
  applicationName: siteName,
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#06b6d4' },
    { media: '(prefers-color-scheme: dark)', color: '#06b6d4' },
  ],
};

function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
    </div>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global settings for header tags
  let globalSettings: any = {};
  try {
    globalSettings = await fetchSingleType('global', { locale: 'en' });
  } catch (error) {
    // Silently fail if global settings cannot be fetched
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <head>
        {/* Dynamically injected header tags from Strapi */}
        {globalSettings.headerTags && (
          <>{/* @ts-ignore */}<div dangerouslySetInnerHTML={{ __html: globalSettings.headerTags }} /></>
        )}
      </head>
      <body suppressHydrationWarning>
        <Preview />
        <SlugProvider>
          <Suspense fallback={<RootLoading />}>{children}</Suspense>
        </SlugProvider>
        {/* Dynamically injected footer tags from Strapi */}
        {globalSettings.footerTags && (
          <>{/* @ts-ignore */}<div dangerouslySetInnerHTML={{ __html: globalSettings.footerTags }} /></>
        )}
      </body>
    </html>
  );
}
