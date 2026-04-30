'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { Container } from '../container';
import { AmbientColor } from '../decorations/ambient-color';
import { Button } from '../elements/button';
import { EASE_OUT_QUART, viewport } from '@/lib/motion';

export const CTA = ({
  heading,
  sub_heading,
  CTAs,
  locale,
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
}) => {
  return (
    <div className="relative py-40">
      <AmbientColor />
      <Container className="flex flex-col md:flex-row justify-between items-center w-full px-8">
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
        >
          <motion.h2 className="text-[#f5f1e8] text-xl text-center md:text-left md:text-3xl font-medium [font-family:var(--font-luxury),ui-serif,Georgia,serif] mx-auto md:mx-0 max-w-xl">
            {heading}
          </motion.h2>
          <p className="max-w-md mt-8 text-center md:text-left text-sm md:text-base mx-auto md:mx-0 text-[#c8bfa8]">
            {sub_heading}
          </p>
        </motion.div>
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5, ease: EASE_OUT_QUART, delay: 0.1 }}
        >
          {CTAs &&
            CTAs.map((cta, index) => (
              <Button
                as={Link}
                key={index}
                href={`/${locale}${cta.URL}`}
                variant={cta.variant}
                className="py-3"
              >
                {cta.text}
              </Button>
            ))}
        </motion.div>
      </Container>
    </div>
  );
};
