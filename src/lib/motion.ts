import type { Transition } from "motion/react";

/** Default critically damped spring for every non-scroll state change. */
export const spring: Transition = { type: "spring", bounce: 0, duration: 0.4 };

/** Reduced-motion fallback: a plain cross-fade. */
export const fade: Transition = { duration: 0.2, ease: "linear" };
