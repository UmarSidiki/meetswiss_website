'use client';

import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';

import { useSlugContext } from '@/app/context/SlugContext';
import { i18n } from '@/i18n.config';
import { cn } from '@/lib/utils';

const LOCALE_META: Record<string, { code: string; name: string }> = {
  en: { code: 'EN', name: 'English' },
  fr: { code: 'FR', name: 'Français' },
  es: { code: 'ES', name: 'Español' },
  it: { code: 'IT', name: 'Italiano' },
  de: { code: 'DE', name: 'Deutsch' },
  nl: { code: 'NL', name: 'Nederlands' },
  ru: { code: 'RU', name: 'Русский' },
};

function buildLocalizedHref(
  pathname: string,
  currentLocale: string,
  targetLocale: string,
  localizedSlugs: Record<string, string>
): string {
  const defaultLocale = i18n.defaultLocale;

  // Strip current locale prefix from pathname
  let strippedPath: string;
  if (currentLocale === defaultLocale) {
    strippedPath = pathname;
  } else {
    strippedPath = pathname.startsWith(`/${currentLocale}`)
      ? pathname.slice(`/${currentLocale}`.length) || '/'
      : pathname;
  }

  const segments = strippedPath.split('/').filter(Boolean);

  // Last segment is the content slug — get the localized version
  const currentSlug = segments[segments.length - 1] ?? '';
  const targetSlug = localizedSlugs[targetLocale] ?? currentSlug;

  // Prefix = all path segments except the last (content slug)
  const prefixSegments = segments.length > 1 ? segments.slice(0, -1) : [];

  let contentPath: string;
  if (prefixSegments.length > 0) {
    contentPath = `/${prefixSegments.join('/')}/${targetSlug}`;
  } else if (targetSlug) {
    contentPath = `/${targetSlug}`;
  } else {
    contentPath = '/';
  }

  if (targetLocale === defaultLocale) {
    return contentPath;
  }

  return `/${targetLocale}${contentPath === '/' ? '' : contentPath}`;
}

export function LocaleSwitcher({
  locale,
  variant = 'desktop',
}: {
  locale: string;
  variant?: 'desktop' | 'mobile';
}) {
  const pathname = usePathname();
  const { state } = useSlugContext();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = LOCALE_META[locale] ?? {
    code: locale.toUpperCase(),
    name: locale,
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (variant === 'mobile') {
    return (
      <div ref={containerRef} className="mt-1">
        <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-400/60">
          Language
        </p>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className="flex h-11 w-full items-center justify-between rounded-xl bg-[#111] px-4 text-sm transition-colors hover:bg-amber-400/8"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[0.65rem] font-semibold text-[#7a7268]">
              {current.code}
            </span>
            <span className="text-[#f5f1e8]">{current.name}</span>
          </div>
          <IoChevronDown
            className={cn(
              'h-4 w-4 text-amber-400/60 transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </button>

        {open && (
          <div
            role="listbox"
            aria-label="Select language"
            className="mt-1 overflow-hidden rounded-xl border border-amber-400/15 bg-[#0f0f0f] py-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          >
            {i18n.locales.map((loc) => {
              const meta = LOCALE_META[loc] ?? {
                code: loc.toUpperCase(),
                name: loc,
              };
              const href = buildLocalizedHref(
                pathname,
                locale,
                loc,
                state.localizedSlugs
              );
              const isActive = loc === locale;
              return (
                <Link
                  key={loc}
                  href={href}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-amber-400/8',
                    isActive
                      ? 'text-amber-400'
                      : 'text-[#c8bfa8] hover:text-[#f5f1e8]'
                  )}
                >
                  <span className="w-6 text-[0.65rem] font-semibold text-[#7a7268]">
                    {meta.code}
                  </span>
                  <span>{meta.name}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-sm text-white/70 transition-colors hover:text-amber-400"
      >
        <span className="font-semibold tracking-wide">{current.code}</span>
        <IoChevronDown
          className={cn(
            'h-3 w-3 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-amber-400/15 bg-[#0f0f0f] py-1 shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
        >
          {i18n.locales.map((loc) => {
            const meta = LOCALE_META[loc] ?? {
              code: loc.toUpperCase(),
              name: loc,
            };
            const href = buildLocalizedHref(
              pathname,
              locale,
              loc,
              state.localizedSlugs
            );
            const isActive = loc === locale;
            return (
              <Link
                key={loc}
                href={href}
                role="option"
                aria-selected={isActive}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors hover:bg-amber-400/8',
                  isActive
                    ? 'text-amber-400'
                    : 'text-[#c8bfa8] hover:text-[#f5f1e8]'
                )}
              >
                <span className="w-6 text-[0.65rem] font-semibold text-[#7a7268]">
                  {meta.code}
                </span>
                <span>{meta.name}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
