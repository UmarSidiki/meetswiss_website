import type { Metadata, Viewport } from 'next';
import { Geist_Mono, EB_Garamond, Lato } from 'next/font/google';

import { getAbsoluteUrl } from '@/lib/seo/config';

import './globals.css';

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
        {children}
      </body>
    </html>
  );
}
