'use client';

import { IconHelpHexagonFilled } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { FeatureIconContainer } from './feature-icon-container';
import { Container } from '@/components/container';
import { Heading } from '@/components/elements/heading';
import { fadeUp, staggerItems, viewport } from '@/lib/motion';

export const FAQ = ({
  heading,
  sub_heading,
  faqs,
}: {
  heading: string;
  sub_heading: string;
  faqs: any[];
}) => {
  return (
    <Container className="flex flex-col items-center justify-between pb-20">
      <motion.div
        className="relative z-20 py-10 md:pt-40"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
      >
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconHelpHexagonFilled className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading as="h1" className="mt-4">
          {heading}
        </Heading>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-10 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerItems}
      >
        {faqs &&
          faqs.map((faq: { question: string; answer: string }) => (
            <motion.div key={faq.question} variants={fadeUp}>
              <h4 className="text-lg font-semibold text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
                {faq.question}
              </h4>
              <p className="mt-4 leading-relaxed text-[#c8bfa8]">
                {faq.answer}
              </p>
            </motion.div>
          ))}
      </motion.div>
    </Container>
  );
};
