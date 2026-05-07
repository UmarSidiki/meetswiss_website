import { Link } from 'next-view-transitions';
import React from 'react';
import type { IconType } from 'react-icons';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

import { i18n } from '@/i18n.config';
import { isExternalUrl } from '@/lib/locale-path';

const SOCIAL_ICONS: Record<string, IconType> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaTwitter,
  x: FaTwitter,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  tiktok: SiTiktok,
};

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

type FooterLink = { text?: string; URL?: string; target?: string };
type FooterColumn = { heading?: string; links?: FooterLink[] };

type FooterData = {
  tagline?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_whatsapp?: string;
  footer_columns?: FooterColumn[];
  social_media_links?: FooterLink[];
  copyright?: string;
};

export const Footer = async ({
  data,
  locale,
  logo,
}: {
  data: FooterData | null | undefined;
  locale: string;
  logo?: { url: string };
}) => {
  const basePath = locale === i18n.defaultLocale ? '' : `/${locale}`;
  const columns = data?.footer_columns ?? [];
  const socialLinks = data?.social_media_links ?? [];
  const year = 2026;
  const copyright = data?.copyright ?? `© ${year} Meetswiss Transfers`;

  return (
    <footer id="contact" className="bg-[#080808] text-[#f5efe0]">
      <div className="h-1 w-full bg-gradient-to-r from-[#5d4316] via-[#d4a843] to-[#987431]" />

      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_2fr]">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 text-primary">
            {logo ? (
              <img
                src={logo.url}
                alt="Meetswiss Transfers"
                className="h-10 w-auto max-w-[180px] object-contain"
              />
            ) : (
              <>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/25">
                  <LeafMark className="h-5 w-5 text-primary" />
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f5efe0]">
                  meetswiss transfers
                </span>
              </>
            )}
          </div>

          {data?.tagline && (
            <p className="max-w-xs text-sm leading-[1.7] text-[#c3b89f]">
              {data.tagline}
            </p>
          )}

          {(data?.contact_phone ||
            data?.contact_email ||
            data?.contact_whatsapp) && (
            <div className="flex flex-col gap-3 border-t border-primary/20 pt-5">
              {data.contact_phone && (
                <a
                  href={`tel:${data.contact_phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2.5 text-sm text-[#d9d1c1] transition-colors hover:text-primary"
                >
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-primary"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M14.5 11.5c0 .3-.1.6-.2.9-.1.3-.3.5-.5.7-.4.4-.8.6-1.3.6-.3 0-.7-.1-1-.2a10.4 10.4 0 0 1-4.8-3.2A10.4 10.4 0 0 1 3.5 5.5c-.1-.3-.2-.6-.2-1 0-.5.2-.9.6-1.3.2-.2.4-.4.7-.5.3-.1.5-.2.8-.2.1 0 .2 0 .3.1L7.2 4c.1.1.2.3.2.5 0 .2-.1.4-.2.6l-.7.8c.5 1 1.1 1.9 1.9 2.7.8.8 1.7 1.4 2.7 1.9l.8-.7c.2-.1.4-.2.6-.2.2 0 .4.1.5.2l1.5 1.5c.1.1.1.2.1.3z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {data.contact_phone}
                </a>
              )}

              {data.contact_email && (
                <a
                  href={`mailto:${data.contact_email}`}
                  className="inline-flex items-center gap-2.5 text-sm text-[#d9d1c1] transition-colors hover:text-primary"
                >
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-primary"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="1.5"
                      y="3.5"
                      width="13"
                      height="9"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="m2 4.5 6 4.5 6-4.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {data.contact_email}
                </a>
              )}

              {data.contact_whatsapp && (
                <a
                  href={`https://wa.me/${data.contact_whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-[#d9d1c1] transition-colors hover:text-primary"
                >
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-primary"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 1.5A6.5 6.5 0 0 0 2.2 11L1.5 14.5l3.6-.7A6.5 6.5 0 1 0 8 1.5z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 6.5c.1.6.5 1.2 1 1.7.5.5 1.1.9 1.7 1 .5 0 .8-.4 1-.7.1-.2 0-.4-.2-.5l-.7-.4c-.2-.1-.4 0-.5.1l-.2.3a3 3 0 0 1-1.5-1.5l.3-.2c.1-.1.2-.3.1-.5l-.4-.7c-.1-.2-.3-.3-.5-.2-.3.2-.7.5-.7 1z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  WhatsApp
                </a>
              )}
            </div>
          )}
        </div>

        {columns.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column, i) => (
              <div
                key={`${column.heading}-${i}`}
                className="flex flex-col gap-2"
              >
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                  {column.heading}
                </h3>
                {(column.links ?? []).map((link, j) => {
                  const href = isExternalUrl(link.URL)
                    ? link.URL
                    : `${basePath}${link.URL ?? ''}`;
                  return (
                    <Link
                      key={`${link.text}-${j}`}
                      className="text-sm text-[#d9d1c1] transition-colors hover:text-primary"
                      href={href}
                      target={link.target}
                      rel={
                        link.target === '_blank'
                          ? 'noopener noreferrer'
                          : undefined
                      }
                    >
                      {link.text}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="border-t border-primary/25">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col items-start justify-between gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-8">
          <p className="text-sm text-[#c6baa1]">{copyright}</p>

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social, i) => {
                const key = (social.text ?? '')
                  .toLowerCase()
                  .replace(/\s+/g, '');
                const Icon = SOCIAL_ICONS[key];
                if (!Icon) return null;

                return (
                  <Link
                    key={`${social.text}-${i}`}
                    href={social.URL ?? basePath}
                    target={social.target ?? '_blank'}
                    rel="noopener noreferrer"
                    aria-label={social.text ?? key}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 text-sm text-[#f5efe0] transition-colors hover:border-primary hover:bg-primary hover:text-[#17120a]"
                  >
                    <Icon />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
