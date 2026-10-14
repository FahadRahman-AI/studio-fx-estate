"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { chapters, heroDurationSeconds, heroTags } from "@/lib/content";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const timecode = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Phones get a 9:16 crop, everything else the full 16:9 frame. Matches Tailwind's `md` breakpoint. */
const MOBILE_QUERY = "(max-width: 47.99rem)";
const MOBILE_VIDEO = "/videos/hero-mobile.mp4";
const MOBILE_POSTER = "/videos/hero-mobile.webp";
const DESKTOP_VIDEO = "/videos/hero-desktop.mp4";
const DESKTOP_POSTER = "/videos/hero-desktop.webp";

/**
 * Raw HTML so `muted` reaches the server-rendered markup — React never emits that
 * attribute, and iOS Safari only autoplays when it is present before any JS runs.
 * The poster <picture> sits behind the video, and the video stays transparent until
 * it fires `playing`: iOS can paint a blocked video (Low Power Mode) as an opaque
 * black layer above its siblings. <source> media queries mean each device downloads
 * only the file it shows.
 */
const HERO_MEDIA_HTML = `<picture><source media="${MOBILE_QUERY}" srcset="${MOBILE_POSTER}"><img src="${DESKTOP_POSTER}" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover"></picture><video autoplay muted loop playsinline preload="auto" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover" style="opacity:0;transition:opacity .3s" onplaying="this.style.opacity=1"><source src="${MOBILE_VIDEO}" type="video/mp4" media="${MOBILE_QUERY}"><source src="${DESKTOP_VIDEO}" type="video/mp4"></video>`;

export function Hero() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const roomRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  // Loop the video; the headline stays put and the bottom strip follows playback.
  useEffect(() => {
    const video = mediaRef.current!.querySelector("video")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    video.muted = true;
    const play = () => {
      if (!reduced && video.paused) video.play().catch(() => {});
    };
    if (reduced) video.pause();
    else play();

    // Low Power Mode blocks autoplay until the first tap; iOS also pauses
    // inline video when the tab is backgrounded. Retry on both.
    const onVisible = () => document.visibilityState === "visible" && play();
    window.addEventListener("touchend", play, { passive: true });
    window.addEventListener("click", play);
    document.addEventListener("visibilitychange", onVisible);

    const tick = () => {
      if (!video.duration) return;
      const p = video.currentTime / video.duration;
      const active = chapters.findIndex((c) => p >= c.from && p < c.to);
      segmentRefs.current.forEach((seg, i) => {
        const c = chapters[i];
        if (seg) seg.style.transform = `scaleX(${clamp01((p - c.from) / (c.to - c.from))})`;
      });
      if (timeRef.current) timeRef.current.textContent = timecode(p * heroDurationSeconds);
      if (roomRef.current) roomRef.current.textContent = active >= 0 ? chapters[active].word : "Approach";
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("touchend", play);
      window.removeEventListener("click", play);
      document.removeEventListener("visibilitychange", onVisible);
      video.pause();
    };
  }, []);

  return (
    <section id="top" aria-label="Walkthrough" className="relative h-svh overflow-hidden bg-black text-white">
      {/* Dev-only: React may log a hydration diff here when `onplaying` has already revealed the video. */}
      <div ref={mediaRef} dangerouslySetInnerHTML={{ __html: HERO_MEDIA_HTML }} />
      {/* Flat scrim so white type holds contrast over bright footage */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-black/25" />

      <div className="page-grid absolute inset-x-0 bottom-40 z-10 md:bottom-44">
        <p className="type-meta col-span-12 mb-6 md:col-span-3">Sector: Luxury real estate</p>
        <h1 className="type-h1 col-span-12 md:col-span-11">AI tours of luxury homes</h1>
        <p className="type-body col-span-12 mt-6 max-w-[48ch] text-white/80 md:col-span-6">
          We combine architectural art direction with generative AI to turn the photos, renders
          and plans you already have into fluid cinematic walkthroughs. No cameras, crews or
          drones on site.
        </p>
      </div>

      {/* Bottom strip: disciplines, room + timecode, progress, CTA */}
      <div className="material-dark absolute inset-x-0 bottom-0 z-10 border-t border-white/20">
        <div className="page-grid items-center py-4">
          <ul className="type-meta col-span-3 hidden gap-4 lg:flex">
            {heroTags.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="type-meta col-span-6 flex gap-4 whitespace-nowrap sm:col-span-4 lg:col-span-2">
            <span ref={roomRef} className="w-20">Approach</span>
            <span>
              <span ref={timeRef}>00:00</span>
              <span className="hidden sm:inline"> / {timecode(heroDurationSeconds)}</span>
            </span>
          </p>
          <div className="col-span-4 hidden gap-1 sm:flex lg:col-span-5" aria-hidden>
            {chapters.map((c, i) => (
              <span key={c.word} className="relative h-px bg-white/25" style={{ flexGrow: c.to - c.from }}>
                <span
                  ref={(el) => {
                    segmentRefs.current[i] = el;
                  }}
                  className="absolute inset-0 origin-left bg-white"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            ))}
          </div>
          <a
            href="#book"
            className="press type-ui col-span-6 justify-self-end whitespace-nowrap bg-white px-4 py-3 text-black sm:col-span-4 lg:col-span-2"
          >
            Commission<span className="hidden sm:inline"> a tour</span> +
          </a>
        </div>
      </div>
    </section>
  );
}
