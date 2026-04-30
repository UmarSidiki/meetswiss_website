'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { Container } from '../container';
import { fadeUp, staggerItems, viewport } from '@/lib/motion';

export const Stats = ({
  heading,
  items,
}: {
  heading: string;
  items: { value: string; label: string }[];
}) => {
  if (!items?.length) return null;
  return (
    <section className="bg-[#f5efe0] py-12 text-[#17130d]">
      <Container>
        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
          {heading && (
            <motion.h2
              className="m-0 max-w-[20ch] text-3xl md:text-4xl tracking-tight"
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
            >
              {heading}
            </motion.h2>
          )}
          <motion.div
            className={`grid gap-8 text-right max-md:text-left ${items.length === 2 ? 'grid-cols-2' : items.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'}`}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerItems}
          >
            {items.map((s, i) => (
              <motion.div key={`${s.label}-${i}`} variants={fadeUp}>
                <strong className="block text-3xl md:text-5xl leading-none">
                  {s.value}
                </strong>
                <span className="text-sm text-[#5b4d36]">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
