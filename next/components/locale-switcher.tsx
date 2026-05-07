'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { useSlugContext } from '@/app/context/SlugContext';
import { i18n } from '@/i18n.config';
import { localePath } from '@/lib/locale-path';
import { cn } from '@/lib/utils';

export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const { state } = useSlugContext();
  const { localizedSlugs } = state;

  const pathname = usePathname() ?? '/';

  // Strip leading locale (if any) to get the bare path the user is on.
  const stripLeadingLocale = (raw: string): string => {
    const segs = raw.split('/').filter(Boolean);
    if (segs.length && (i18n.locales as readonly string[]).includes(segs[0])) {
      segs.shift();
    }
    return segs.length ? `/${segs.join('/')}` : '/';
  };

  const generateLocalizedPath = (locale: string): string => {
    const barePath = stripLeadingLocale(pathname);

    // Replace last segment with localized slug if Strapi provided one
    if (localizedSlugs[locale] && barePath !== '/') {
      const segs = barePath.split('/').filter(Boolean);
      segs[segs.length - 1] = localizedSlugs[locale];
      return localePath(locale, `/${segs.join('/')}`);
    }

    return localePath(locale, barePath);
  };

  return (
    <div className="flex gap-2 p-1 rounded-md">
      {Object.keys(localizedSlugs).map((locale) => (
        <Link key={locale} href={generateLocalizedPath(locale)}>
          <div
            className={cn(
              'flex cursor-pointer items-center justify-center text-sm leading-[110%] w-8 py-1 rounded-md hover:bg-neutral-800 hover:text-white/80 text-white hover:shadow-[0px_1px_0px_0px_var(--neutral-600)_inset] transition duration-200',
              locale === currentLocale
                ? 'bg-neutral-800 text-white shadow-[0px_1px_0px_0px_var(--neutral-600)_inset]'
                : ''
            )}
          >
            {locale}
          </div>
        </Link>
      ))}
    </div>
  );
}
