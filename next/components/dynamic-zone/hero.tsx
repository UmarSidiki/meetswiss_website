'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { Cover } from '../decorations/cover';
import ShootingStars from '../decorations/shooting-star';
import StarBackground from '../decorations/star-background';
import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { EASE_OUT_QUART } from '@/lib/motion';

export const Hero = ({
  heading,
  locale,
}: {
  heading: string;
  locale: string;
}) => {
  return (
    <div className="h-screen overflow-hidden relative flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <StarBackground />
        <ShootingStars />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT_QUART, delay: 0.25 }}
        className="relative z-10"
      >
        <Heading
          as="h1"
          className="text-4xl md:text-5xl lg:text-8xl max-w-7xl mx-auto text-center mt-6 py-6"
        >
          {heading}
        </Heading>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-80 w-full bg-gradient-to-t from-charcoal to-transparent" />
    </div>
  );
};
