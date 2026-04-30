'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import dynamic from 'next/dynamic';
import React, { MouseEvent as ReactMouseEvent, useRef } from 'react';

import Beam from '../../beam';

const CanvasRevealEffect = dynamic(
  () =>
    import('../../ui/canvas-reveal-effect').then((m) => m.CanvasRevealEffect),
  { ssr: false }
);

export const Card = ({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['end end', 'start start'],
  });

  const width = useSpring(useTransform(scrollYProgress, [0, 0.2], [0, 300]), {
    stiffness: 500,
    damping: 90,
  });

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-4 max-w-4xl mx-auto py-20"
    >
      <p className="text-9xl font-bold text-amber-400/10 mt-8 [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
        {'0' + index}
      </p>
      <motion.div
        className="h-px w-full hidden md:block bg-gradient-to-r from-amber-400/10 to-amber-400/30 rounded-full mt-16 relative overflow-hidden"
        style={{ width }}
      >
        <Beam className="top-0" />
      </motion.div>
      <div
        className="group p-8 rounded-md border border-amber-400/15 bg-[#0a0a0a] relative z-40 col-span-2 transition-all duration-300 hover:border-amber-400/30"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="pointer-events-none absolute z-10 -inset-px rounded-md opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            maskImage: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              var(--neutral-900),
              transparent 80%
            )
          `,
          }}
        >
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              [212, 165, 67],
              [180, 132, 50],
            ]}
            dotSize={2}
          />
        </motion.div>

        <p className="text-xl font-medium text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif] relative z-20 mt-2">
          {title}
        </p>
        <p className="text-[#c8bfa8] mt-4 leading-relaxed relative z-20">
          {description}
        </p>
      </div>
    </div>
  );
};
