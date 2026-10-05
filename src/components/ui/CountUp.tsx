"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Counts a stat like "48+" up from 0 the first time it scrolls into view.
 * Screen readers get the final value straight away.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  // "48+" → prefix "", number 48, suffix "+"
  const [, prefix = "", digits, suffix = ""] = value.match(/^(\D*)(\d+)(.*)$/) ?? [];

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduced || digits === undefined) {
      el.textContent = value;
      return;
    }
    const controls = animate(0, Number(digits), {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${prefix}${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduced, value, prefix, digits, suffix]);

  return (
    <>
      <span className="sr-only">{value}</span>
      {/* Text is owned by the effect after mount; React only renders the start state. */}
      <span ref={ref} aria-hidden className="tabular-nums">
        {digits === undefined ? value : `${prefix}0${suffix}`}
      </span>
    </>
  );
}
