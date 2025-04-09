'use client';
import { cubicBezier, motion } from 'framer-motion';

export const fadeInAnimationVariants = {
  initial: { opacity: 0, y: -100 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ease: cubicBezier(0.6, 0.01, -0.05, 0.95),
      duration: 1,
      staggerChildren: 1.25,
    },
  },
  end: { opacity: 0, y: -100 },
};
