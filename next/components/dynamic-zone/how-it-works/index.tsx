'use client';

import { IconSettings } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import React from 'react';

import { Container } from '../../container';
import { Heading } from '../../elements/heading';
import { Subheading } from '../../elements/subheading';
import { FeatureIconContainer } from '../feature-icon-container';
import { Card } from './card';
import { fadeUp, viewport } from '@/lib/motion';

export const HowItWorks = ({
  heading,
  sub_heading,
  steps,
}: {
  heading: string;
  sub_heading: string;
  steps: any;
}) => {
  return (
    <div>
      <Container className="py-20 max-w-7xl mx-auto  relative z-40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
        >
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
            <IconSettings className="h-6 w-6 text-white" />
          </FeatureIconContainer>
          <Heading className="pt-4">{heading}</Heading>
          <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        </motion.div>

        {steps &&
          steps.map(
            (item: { title: string; description: string }, index: number) => (
              <Card
                title={item.title}
                description={item.description}
                index={index + 1}
                key={'card' + index}
              />
            )
          )}
      </Container>
    </div>
  );
};
