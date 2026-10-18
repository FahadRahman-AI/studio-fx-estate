"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { tours } from "@/lib/content";
import { spring } from "@/lib/motion";
import { Section } from "@/components/ui/Section";

/** Bento blueprint: wide/narrow cells alternate so no two rows line up, then a full-width finale. */
const span = ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-8", "md:col-span-12"];

const pad = (n: number) => String(n).padStart(2, "0");

type Tour = (typeof tours)[number];

function ArchiveCard({ tour, index }: { tour: Tour; index: number }) {
  const video = useRef<HTMLVideoElement>(null);
  const cell = span[index % span.length];
  // A full-width 16:9 frame is taller than most laptop screens, so the finale goes 21:9 on desktop.
  const frame = cell === "md:col-span-12" ? "aspect-video md:aspect-[21/9]" : "aspect-video";
  const reduced = useReducedMotion();

  const play = () => {
    if (!reduced && tour.video) video.current?.play().catch(() => {});
  };

  // Touch screens have no hover, so loop while the card is on screen instead.
  // iOS Low Power Mode rejects play() until a user gesture, so any tap on the
  // page retries the cards that are currently visible.
  useEffect(() => {
    const el = video.current;
    if (!el || reduced || !tour.video || window.matchMedia("(hover: hover)").matches) return;
    let visible = false;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    const retry = () => visible && el.paused && el.play().catch(() => {});
    window.addEventListener("touchend", retry, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("touchend", retry);
    };
  }, [reduced, tour.video]);

  const pause = () => video.current?.pause();

  return (
    <li className={`col-span-12 flex flex-col bg-white ${cell}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line px-4 py-3 text-[10px] tracking-widest whitespace-nowrap uppercase md:px-6">
        <span>Location: {tour.place}</span>
        <span className="text-grey">Pipeline: {tour.pipeline}</span>
      </div>

      <div className="overflow-hidden p-4 md:p-6">
        <motion.div
          className={`${frame} bg-off-white`}
          whileHover={reduced ? undefined : { scale: 0.98 }}
          whileTap={reduced ? undefined : { scale: 0.98 }}
          transition={spring}
          onHoverStart={play}
          onHoverEnd={pause}
          onTap={play}
        >
          <video
            ref={video}
            src={tour.video}
            poster={tour.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`${tour.name} walkthrough`}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      <div className="mt-auto flex items-baseline justify-between gap-4 border-t border-line px-4 py-4 md:px-6">
        <h3 className="type-h3">{tour.name}</h3>
        <p className="shrink-0 text-[10px] tracking-widest text-grey uppercase">
          {pad(index + 1)} — Runtime {tour.length}
        </p>
      </div>
    </li>
  );
}

/** Archive of recent walkthroughs: muted 16:9 loops in a hairline bento grid. */
export function VideoArchiveGrid() {
  return (
    <Section id="tours" index={2} label="Output: Walkthroughs" title="Generative archive">
      <div className="page-grid">
        {/* gap-px over a line-coloured fill draws every 1px rule between cells */}
        <ul className="col-span-12 grid grid-cols-12 gap-px border border-line bg-line">
          {tours.map((t, i) => (
            <ArchiveCard key={t.name} tour={t} index={i} />
          ))}
        </ul>
      </div>
    </Section>
  );
}
