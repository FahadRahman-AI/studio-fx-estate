"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives Lenis from GSAP's ticker so ScrollTrigger and the smooth scroller
 * share one requestAnimationFrame. Skipped entirely for reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: true });
    const offScroll = lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      offScroll();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
