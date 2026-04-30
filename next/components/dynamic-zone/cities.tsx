'use client';

import { motion } from 'framer-motion';
import { Link } from 'next-view-transitions';
import React from 'react';

import { Container } from '../container';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { StrapiImage } from '@/components/ui/strapi-image';
import { i18n } from '@/i18n.config';
import { fadeUp, staggerCards, viewport } from '@/lib/motion';

const FALLBACK_GRADIENT =
  'bg-[radial-gradient(circle_at_20%_20%,rgba(212,168,67,0.2),rgba(8,8,8,0.95)_60%)]';

type City = {
  title?: string;
  slug?: string;
  short_description?: string;
  hero_image?: { url?: string; alternativeText?: string };
};

export const Cities = ({
  heading,
  sub_heading,
  cities,
  locale,
}: {
  heading?: string;
  sub_heading?: string;
  cities?: City[];
  locale: string;
}) => {
  const items = (cities || []).filter((city) => city?.title && city?.slug);
  const basePath = locale === i18n.defaultLocale ? '' : `/${locale}`;
  const paragraphs = sub_heading
    ? sub_heading
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];

  if (!heading && !paragraphs.length && items.length === 0) return null;

  return (
    <section className="bg-[#0b0b0b] py-16">
      <Container>
        <motion.div
          className="flex items-center justify-between gap-4 flex-wrap"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
        >
          {heading && <Heading>{heading}</Heading>}
          {items.length > 0 && (
            <Link
              href={`${basePath}/transfers`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 no-underline hover:underline hover:decoration-1 hover:underline-offset-[0.26rem]"
            >
              View all destinations
            </Link>
          )}
        </motion.div>

        {paragraphs.length > 0 && (
          <motion.div
            className="mt-3 grid max-w-3xl gap-3 text-[#c8bfa8]"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            {paragraphs.map((paragraph, index) => (
              <Subheading
                key={`${paragraph.slice(0, 16)}-${index}`}
                as="p"
                className="m-0 text-left text-sm md:text-base"
              >
                {paragraph}
              </Subheading>
            ))}
          </motion.div>
        )}

        {items.length > 0 && (
          <motion.div
            className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerCards}
          >
            {items.slice(0, 6).map((city) => (
              <motion.div key={city.slug} variants={fadeUp}>
                <Link
                  href={`${basePath}/transfers/${city.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-amber-400/25 bg-[#111] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/55 hover:shadow-[0_18px_36px_rgba(0,0,0,0.4)]"
                >
                  <div className="relative h-48 overflow-hidden">
                    {city.hero_image?.url ? (
                      <StrapiImage
                        src={city.hero_image.url}
                        alt={
                          city.hero_image.alternativeText ||
                          city.title ||
                          'City'
                        }
                        width={1200}
                        height={720}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className={`h-48 w-full ${FALLBACK_GRADIENT}`} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
                      {city.title}
                    </h3>
                    {city.short_description && (
                      <p className="mt-2 text-sm leading-[1.65] text-[#c8bfa8]">
                        {city.short_description}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
};
