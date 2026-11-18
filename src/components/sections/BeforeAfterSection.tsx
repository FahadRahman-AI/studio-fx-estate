"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Section } from "@/components/ui/Section";

const DETAILS = [
  { label: "Property", value: "Marina Gate 2 Penthouse" },
  { label: "Location", value: "Dubai Marina, UAE" },
  { label: "Format", value: "Full walkthrough + FPV tour" },
];

export function BeforeAfterSection() {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20% 0px" });

  /* Animate slider intro: sweeps 20 → 50 once on enter */
  useEffect(() => {
    if (!isInView) return;
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const from = 20;
    const to = 50;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;
      setPos(from + (to - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView]);

  /* Drag */
  const move = useCallback((clientX: number) => {
    const c = containerRef.current;
    if (!c) return;
    const { left, width } = c.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - left) / width) * 100)));
  }, []);

  const onMouseDown = useCallback(() => { isDragging.current = true; }, []);
  const onMouseMove = useCallback((e: React.MouseEvent) => { if (isDragging.current) move(e.clientX); }, [move]);
  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);
  const onTouchStart = useCallback(() => { isDragging.current = true; }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => { if (isDragging.current) move(e.touches[0].clientX); }, [move]);
  const onTouchEnd = useCallback(() => { isDragging.current = false; }, []);

  return (
    <Section id="case-study" index={3} label="Case study" title="Before & after">
      <div ref={sectionRef} className="page-grid gap-y-8">

        {/* Comparison viewer */}
        <motion.div
          className="col-span-12"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden border border-line bg-off-white"
            style={{ aspectRatio: "16/9", cursor: "col-resize", userSelect: "none", WebkitUserSelect: "none" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* AFTER video — full frame beneath (right side) */}
            <video
              src="/videos/penthouse-after.mp4"
              autoPlay muted loop playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* BEFORE video — clipped to left of slider */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <video
                src="/videos/penthouse-before.mp4"
                autoPlay muted loop playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Divider */}
            <div
              className="pointer-events-none absolute top-0 bottom-0 z-10 w-px bg-black"
              style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
            >
              {/* Handle */}
              <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black">
                <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
                  <path d="M4 4H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M1 4L4 1M1 4L4 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 4L16 1M19 4L16 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Corner labels */}
            <div className="pointer-events-none absolute top-4 left-4 z-10">
              <span className="type-meta material px-2.5 py-1.5 text-grey">After</span>
            </div>
            <div className="pointer-events-none absolute top-4 right-4 z-10">
              <span className="type-meta material-dark px-2.5 py-1.5 text-white">Before</span>
            </div>

            {/* Drag hint */}
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
              <span className="type-meta text-white/40">Drag to compare</span>
            </div>
          </div>
        </motion.div>

        {/* Property details */}
        <motion.div
          className="col-span-12 grid grid-cols-3 gap-px border border-line bg-line"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {DETAILS.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-2 bg-white px-6 py-5">
              <p className="type-meta text-grey">{label}</p>
              <p className="type-body">{value}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </Section>
  );
}
