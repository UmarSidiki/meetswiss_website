'use client';

import { motion } from 'framer-motion';
import { Link } from 'next-view-transitions';
import React from 'react';

import { Container } from '../container';
import { EASE_OUT_QUART, fadeUp, viewport } from '@/lib/motion';
import { strapiImage } from '@/lib/strapi/strapiImage';

type ImageRef = { url?: string } | null | undefined;

export const About = ({
  heading,
  description,
  button,
  images,
}: {
  heading: string;
  description: string;
  button?: { text?: string; URL?: string; target?: string };
  images?: ImageRef[];
}) => {
  const imageUrls =
    images
      ?.map((img) => (img?.url ? strapiImage(img.url) : ''))
      .filter((src) => Boolean(src)) || [];

  if (!heading && !description && imageUrls.length === 0) return null;

  return (
    <section className="bg-[#d8d2c7] py-16 text-[#16120d]">
      <Container>
        <div className="grid items-center gap-8 md:grid-cols-2">
          {imageUrls.length > 0 && (
            <motion.div
              className="grid grid-cols-2 gap-2"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewport}
              transition={{ duration: 0.55, ease: EASE_OUT_QUART }}
            >
              {imageUrls.slice(0, 4).map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className={`rounded-2xl bg-cover bg-center ${
                    i === 0
                      ? 'min-h-[15.5rem]'
                      : i === 3
                        ? 'col-span-2 min-h-[11rem]'
                        : 'min-h-[10.8rem]'
                  }`}
                  style={{ backgroundImage: `url(${src})` }}
                />
              ))}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.55, ease: EASE_OUT_QUART, delay: 0.08 }}
          >
            {heading && (
              <h2 className="m-0 text-3xl md:text-4xl tracking-tight">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 max-w-[52ch] leading-relaxed text-[#363027]">
                {description}
              </p>
            )}
            {button?.text && (
              <Link
                href={button.URL || '#'}
                target={button.target}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 font-bold text-[#1a140b] hover:bg-amber-300"
              >
                {button.text}
              </Link>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
