'use client';

import {
  IconCar,
  IconClock,
  IconLeaf,
  IconLuggage,
  IconShieldCheck,
  IconStar,
  IconUsers,
  IconWallet,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import React from 'react';

import { Container } from '../container';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { fadeUp, staggerCards, viewport } from '@/lib/motion';

const ICON_MAP: Record<string, React.ReactNode> = {
  shield: <IconShieldCheck className="h-7 w-7 text-amber-400" />,
  money: <IconWallet className="h-7 w-7 text-amber-400" />,
  car: <IconCar className="h-7 w-7 text-amber-400" />,
  clock: <IconClock className="h-7 w-7 text-amber-400" />,
  star: <IconStar className="h-7 w-7 text-amber-400" />,
  users: <IconUsers className="h-7 w-7 text-amber-400" />,
  luggage: <IconLuggage className="h-7 w-7 text-amber-400" />,
  leaf: <IconLeaf className="h-7 w-7 text-amber-400" />,
};

export const WhyChooseUs = ({
  heading,
  sub_heading,
  cards,
}: {
  heading: string;
  sub_heading: string;
  cards: { icon: string; title: string; description: string }[];
}) => {
  if (!cards?.length) return null;
  return (
    <section className="bg-[#0a0a0a] py-20">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
        >
          {heading && <Heading>{heading}</Heading>}
          {sub_heading && (
            <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
          )}
        </motion.div>
        <motion.div
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerCards}
        >
          {cards.map((card, i) => (
            <motion.article
              key={`${card.title}-${i}`}
              variants={fadeUp}
              className="rounded-2xl border border-amber-400/20 bg-[#0f0f0f] p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
            >
              <span>{ICON_MAP[card.icon] || ICON_MAP.shield}</span>
              <h3 className="mt-3 text-lg font-medium text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
                {card.title}
              </h3>
              <p className="mt-2 leading-relaxed text-[#c8bfa8]">
                {card.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};
