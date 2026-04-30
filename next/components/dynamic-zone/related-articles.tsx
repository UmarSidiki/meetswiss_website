'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { BlogCardVertical } from '../blog-card';
import { fadeUp, staggerCards, viewport } from '@/lib/motion';

export const RelatedArticles = ({
  heading,
  sub_heading,
  articles,
  locale,
}: {
  heading: string;
  sub_heading: string;
  articles: any[];
  locale: string;
}) => {
  return (
    <div className="mt-12 pb-20">
      <motion.h2
        className="text-2xl font-medium text-[#f5f1e8] mb-10 [font-family:var(--font-luxury),ui-serif,Georgia,serif]"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
      >
        {heading}
      </motion.h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-10"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerCards}
      >
        {articles.map((article) => (
          <motion.div key={article.title} variants={fadeUp}>
            <BlogCardVertical article={article} locale={locale} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
