import type { Metadata, Viewport } from 'next';
import { Geist_Mono } from 'next/font/google';
import { EB_Garamond, Lato } from 'next/font/google';
import { Suspense } from 'react';

import { getAbsoluteUrl } from '@/lib/seo/config';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <body suppressHydrationWarning>
        <Preview />
        <SlugProvider>
          <Suspense fallback={<RootLoading />}>{children}</Suspense>
        </SlugProvider>
      </body>
    </html>
  );
}
