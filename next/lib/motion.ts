import type { Variants } from 'framer-motion';

export const EASE_OUT_QUART: [number, number, number, number] = [
  0.25, 1, 0.5, 1,
];
export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_QUART },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: EASE_OUT_QUART },
  },
};

export const staggerCards: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

export const staggerItems: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export const viewport = { once: true, amount: 0.15 };
