'use client';

import { Link } from 'next-view-transitions';
import { useEffect, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoClose, IoMenu } from 'react-icons/io5';

import { LocaleSwitcher } from './locale-switcher';
import { i18n } from '@/i18n.config';
import { cn } from '@/lib/utils';

type NavLinkItem = {
  text?: string;
  URL?: string;
  target?: string;
};

const fallbackLeftNavbarItems: NavLinkItem[] = [
  { text: 'Services', URL: '/services' },
  { text: 'Fleet', URL: '/fleet' },
  { text: 'Transfers', URL: '/transfers' },
  { text: 'Blog', URL: '/blog' },
  { text: 'Contact', URL: '/contact' },
];

const fallbackRightNavbarItems: NavLinkItem[] = [
  { text: 'Book Now', URL: '#booking' },
];

const EXTERNAL_URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;
const SPECIAL_PROTOCOL_PATTERN = /^(mailto:|tel:|sms:)/i;

function normalizeLocalizedHref(
  url: string | undefined,
  locale: string
): string {
  const trimmed = url?.trim();

  const basePath = locale === i18n.defaultLocale ? '' : `/${locale}`;

  if (!trimmed || trimmed === '/') {
    return basePath || '/';
  }

  if (trimmed.startsWith('#')) {
    return `${basePath}${trimmed}`;
  }

  if (
    EXTERNAL_URL_PATTERN.test(trimmed) ||
    SPECIAL_PROTOCOL_PATTERN.test(trimmed)
  ) {
    return trimmed;
  }

  const parsed = new URL(
    trimmed.startsWith('/')
      ? `https://meetswiss.local${trimmed}`
      : `https://meetswiss.local/${trimmed}`
  );

  const pathSegments = parsed.pathname.split('/').filter(Boolean);

  if (!pathSegments.length) {
    parsed.pathname = basePath || '/';
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  }

  if (i18n.locales.includes(pathSegments[0] as (typeof i18n.locales)[number])) {
    const activeLocale = pathSegments[0];
    if (activeLocale !== locale) {
      pathSegments[0] = locale;
    }
  } else {
    pathSegments.unshift(locale);
  }

  // Omit default locale from pathname for cleaner URLs
  if (pathSegments[0] === i18n.defaultLocale) {
    pathSegments.shift();
  }

  parsed.pathname = `/${pathSegments.join('/')}`;

  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

function getNavItems(data: any): {
  leftNavbarItems: NavLinkItem[];
  rightNavbarItems: NavLinkItem[];
} {
  const leftNavbarItems: NavLinkItem[] = (data?.left_navbar_items || [])
    .map((item: NavLinkItem) => ({
      text: item?.text?.trim(),
      URL: item?.URL?.trim(),
      target: item?.target,
    }))
    .filter((item: NavLinkItem) => Boolean(item.text || item.URL));

  const rightNavbarItems: NavLinkItem[] = (data?.right_navbar_items || [])
    .map((item: NavLinkItem) => ({
      text: item?.text?.trim(),
      URL: item?.URL?.trim(),
      target: item?.target,
    }))
    .filter((item: NavLinkItem) => Boolean(item.text || item.URL));

  return {
    leftNavbarItems: leftNavbarItems.length
      ? leftNavbarItems
      : fallbackLeftNavbarItems,
    rightNavbarItems: rightNavbarItems.length
      ? rightNavbarItems
      : fallbackRightNavbarItems,
  };
}

function getLinkRel(target?: string) {
  return target === '_blank' ? 'noopener noreferrer' : undefined;
}

function LeafMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 4C12.5 4 5.9 8.2 4 14.5C3.1 17.6 3.5 20.3 3.5 20.3C3.5 20.3 6.2 20.7 9.3 19.8C15.7 17.9 20 11.5 20 4Z"
        stroke="currentColor"
        strokeWidth="1.45"
      />
      <path
        d="M8 16.5C10.4 13.8 13 11.7 16.6 9.4"
        stroke="currentColor"
        strokeWidth="1.45"
      />
    </svg>
  );
}

export function Navbar({
  data,
  locale,
  hasBanner,
  logo,
}: {
  data: any;
  locale: string;
  hasBanner?: boolean;
  logo?: { url: string };
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 22);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  const basePath = `/${locale}`;
  const { leftNavbarItems, rightNavbarItems } = getNavItems(data);
  const primaryAction =
    rightNavbarItems[rightNavbarItems.length - 1] ||
    fallbackRightNavbarItems[0];
  const secondaryActions = rightNavbarItems.slice(0, -1);

  return (
    <nav
      className={cn(
        'fixed inset-x-0 z-50',
        hasBanner ? 'top-[4.25rem]' : 'top-0'
      )}
    >
      <div className="mx-auto w-full max-w-[1240px] px-3 pb-2 pt-3 sm:px-5">
        <div
          className={cn(
            'rounded-full border px-4 py-3 transition-all duration-300',
            isScrolled
              ? 'border-amber-400/18 bg-[#0a0a0a] shadow-[0_8px_32px_rgba(0,0,0,0.55),0_0_0_1px_rgba(212,165,67,0.06)]'
              : 'border-transparent bg-black/50 backdrop-blur-xl'
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <Link
              href={basePath}
              className="flex items-center gap-2 text-white"
            >
              {logo ? (
                <img
                  src={logo.url}
                  alt="Meetswiss Transfers"
                  className="h-8 w-auto max-w-[160px] object-contain"
                />
              ) : (
                <>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/25">
                    <LeafMark className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.26em] sm:text-sm">
                    meetswiss transfers
                  </span>
                </>
              )}
            </Link>

            <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
              {leftNavbarItems.map((item, index) => (
                <Link
                  key={`${item.text || item.URL || 'left-link'}-${index}`}
                  href={normalizeLocalizedHref(item.URL, locale)}
                  target={item.target}
                  rel={getLinkRel(item.target)}
                  className="text-sm text-white/85 transition-colors duration-200 hover:text-primary"
                >
                  {item.text || item.URL}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              {secondaryActions.map((item, index) => (
                <Link
                  key={`${item.text || item.URL || 'right-link'}-${index}`}
                  href={normalizeLocalizedHref(item.URL, locale)}
                  target={item.target}
                  rel={getLinkRel(item.target)}
                  className="inline-flex items-center gap-2 text-sm text-white/90 transition-colors hover:text-primary"
                >
                  {item.text || item.URL}
                </Link>
              ))}

              {data?.phone && (
                <a
                  className="inline-flex items-center gap-2 text-sm text-white/90 transition-colors hover:text-primary"
                  href={`tel:${data.phone.replace(/\s/g, '')}`}
                >
                  <FaPhoneAlt className="text-primary" />
                  {data.phone}
                </a>
              )}

              <LocaleSwitcher locale={locale} />

              <Link
                href={normalizeLocalizedHref(primaryAction.URL, locale)}
                target={primaryAction.target}
                rel={getLinkRel(primaryAction.target)}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-[#1c160b] transition duration-200 hover:shadow-[0_0_0_1px_rgba(212,168,67,0.65),0_12px_28px_rgba(212,168,67,0.28)]"
              >
                {primaryAction.text || 'Book Now'}
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <LocaleSwitcher locale={locale} />
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/45 text-primary"
                onClick={() => setMobileOpen((current) => !current)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-drawer"
              >
                {mobileOpen ? (
                  <IoClose className="h-5 w-5" />
                ) : (
                  <IoMenu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-[55] bg-black/65 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden',
          mobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className="h-full w-full"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
        />
      </div>

      <aside
        id="mobile-nav-drawer"
        className={cn(
          'fixed inset-y-0 right-0 z-[60] flex w-[min(88vw,23rem)] flex-col border-l border-amber-400/[0.07] bg-[linear-gradient(180deg,rgba(16,13,8,0.99)_0%,rgba(10,10,10,0.99)_100%)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] transition-shadow duration-300 ease-out-quint lg:hidden',
          'transition-transform duration-300 ease-out-quint',
          mobileOpen
            ? 'translate-x-0 pointer-events-auto shadow-[-24px_0_54px_rgba(0,0,0,0.6)]'
            : 'translate-x-full pointer-events-none shadow-none'
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
              Navigation
            </span>
            <p className="mt-2 text-sm text-white/85">
              Choose a section and jump there
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/[0.04] text-primary transition-colors hover:border-amber-400/60 hover:bg-primary/10"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        <Link
          href={basePath}
          className="mt-4 flex items-center gap-2.5 rounded-2xl bg-[#111] px-3 py-2.5"
          onClick={() => setMobileOpen(false)}
        >
          {logo ? (
            <img
              src={logo.url}
              alt="Meetswiss Transfers"
              className="h-7 w-auto max-w-[140px] object-contain"
            />
          ) : (
            <>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/25">
                <LeafMark className="h-3.5 w-3.5 text-primary" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                meetswiss transfers
              </span>
            </>
          )}
        </Link>

        <div className="mt-5 grid gap-2.5">
          {leftNavbarItems.map((item, index) => (
            <Link
              key={`${item.text || item.URL || 'mobile-left-link'}-${index}`}
              href={normalizeLocalizedHref(item.URL, locale)}
              target={item.target}
              rel={getLinkRel(item.target)}
              className="group flex min-h-11 items-center justify-between rounded-xl bg-[#111] px-3.5 py-3 text-[15px] font-medium text-[#c8bfa8] transition-all duration-200 hover:bg-amber-400/8 hover:text-amber-400"
              onClick={() => setMobileOpen(false)}
            >
              <span>{item.text || item.URL}</span>
              <span
                aria-hidden="true"
                className="text-amber-400/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-amber-400"
              >
                {'>'}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-auto border-t border-amber-400/[0.08] pt-4">
          {secondaryActions.map((item, index) => (
            <Link
              key={`${item.text || item.URL || 'mobile-right-link'}-${index}`}
              href={normalizeLocalizedHref(item.URL, locale)}
              target={item.target}
              rel={getLinkRel(item.target)}
              className="mb-2 inline-flex h-11 w-full items-center justify-center rounded-xl border border-amber-400/15 bg-transparent text-sm font-medium text-[#c8bfa8] transition-colors hover:border-amber-400/40 hover:text-amber-400"
              onClick={() => setMobileOpen(false)}
            >
              {item.text || item.URL}
            </Link>
          ))}

          {data?.phone && (
            <a
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber-400/15 bg-transparent text-sm font-medium text-[#c8bfa8] transition-colors hover:border-amber-400/40 hover:text-amber-400"
              href={`tel:${data.phone.replace(/\s/g, '')}`}
            >
              <FaPhoneAlt className="text-primary" /> {data.phone}
            </a>
          )}

          <Link
            href={normalizeLocalizedHref(primaryAction.URL, locale)}
            target={primaryAction.target}
            rel={getLinkRel(primaryAction.target)}
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-[#1c160b] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(212,168,67,0.28)]"
            onClick={() => setMobileOpen(false)}
          >
            {primaryAction.text || 'Book Now'}
          </Link>

          {data?.tagline && (
            <p className="mt-3 text-xs text-white/50">{data.tagline}</p>
          )}
        </div>
      </aside>
    </nav>
  );
}
