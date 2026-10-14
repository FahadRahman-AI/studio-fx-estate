"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters, heroDurationSeconds, heroTags } from "@/lib/content";
import { heroFrames } from "@/lib/frames";
import { drawWalkthrough } from "@/lib/placeholderScene";

gsap.registerPlugin(ScrollTrigger);

const MAX_DPR = 2;
const GLIDE = 48; // px each overlay line travels on enter and on exit

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const timecode = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Phones get a looping video instead of the scroll-scrubbed canvas. Matches Tailwind's `md` breakpoint. */
const MOBILE_QUERY = "(max-width: 47.99rem)";
const MOBILE_VIDEO = "/videos/hero-mobile.mp4";

const MOBILE_POSTER = "/frames/hero/mobile-poster.webp";

/**
 * Raw HTML so `muted` reaches the server-rendered markup — React never emits that
 * attribute, and iOS Safari only autoplays when it is present before any JS runs.
 * The <img> sits behind the video, and the video stays transparent until it fires
 * `playing`: iOS can paint a blocked video (Low Power Mode) as an opaque black
 * layer above its siblings. The <source> media query keeps desktop browsers from
 * downloading the file.
 */
const MOBILE_VIDEO_HTML = `<img src="${MOBILE_POSTER}" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover"><video autoplay muted loop playsinline preload="auto" poster="${MOBILE_POSTER}" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover" style="opacity:0;transition:opacity .3s" onplaying="this.style.opacity=1"><source src="${MOBILE_VIDEO}" type="video/mp4" media="${MOBILE_QUERY}"></video>`;

/** null during SSR, then true/false; re-renders if the viewport crosses the breakpoint. */
function useIsMobile() {
  return useSyncExternalStore<boolean | null>(
    (onChange) => {
      const mq = window.matchMedia(MOBILE_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => null,
  );
}

/** Load order: first frame, then progressively finer strides so any scrub position has a nearby frame early. */
function loadOrder(count: number) {
  const order: number[] = [0];
  const seen = new Set(order);
  for (let stride = 32; stride >= 1; stride /= 2) {
    for (let i = 0; i < count; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const segmentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const roomRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();

  /** Bottom-strip readout: chapter progress segments, timecode and room name. */
  const updateHud = (p: number, active: number) => {
    segmentRefs.current.forEach((seg, i) => {
      const c = chapters[i];
      if (seg) seg.style.transform = `scaleX(${clamp01((p - c.from) / (c.to - c.from))})`;
    });
    if (timeRef.current) timeRef.current.textContent = timecode(p * heroDurationSeconds);
    if (roomRef.current) roomRef.current.textContent = active >= 0 ? chapters[active].word : "Approach";
  };

  // ── Mobile: loop the video; the headline stays, the HUD follows playback ──
  useEffect(() => {
    if (mobile !== true) return;
    const video = videoWrapRef.current!.querySelector("video")!;
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
      updateHud(p, chapters.findIndex((c) => p >= c.from && p < c.to));
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("touchend", play);
      window.removeEventListener("click", play);
      document.removeEventListener("visibilitychange", onVisible);
      video.pause();
    };
  }, [mobile]);

  // ── Desktop: scroll-scrubbed canvas ──
  useEffect(() => {
    if (mobile !== false) return;
    const section = sectionRef.current!;
    const title = titleRef.current!;
    const chapterEls = chapterRefs.current;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cssW = 0;
    let cssH = 0;
    let progress = 0;
    let canvasProgress = 0;
    let lastDrawn = -1;
    let dirty = true;

    // ── Frame buffer ──────────────────────────────────────
    const { count } = heroFrames;
    const frames: (HTMLImageElement | undefined)[] = new Array(count);
    let cancelled = false;

    if (count > 0) {
      const need = window.innerWidth * Math.min(window.devicePixelRatio, MAX_DPR);
      const width = heroFrames.widths.find((w) => w >= need) ?? heroFrames.widths.at(-1)!;
      (async () => {
        for (const i of loadOrder(count)) {
          if (cancelled) return;
          const img = new Image();
          img.src = heroFrames.path(width, i);
          try {
            await img.decode();
            frames[i] = img;
            dirty = true;
          } catch {
            /* missing frame: nearest neighbour covers it */
          }
        }
      })();
    }

    const nearestLoaded = (target: number) => {
      for (let d = 0; d < count; d++) {
        if (frames[target - d]) return target - d;
        if (frames[target + d]) return target + d;
      }
      return -1;
    };

    const render = () => {
      if (!dirty || cssW === 0) return;
      dirty = false;

      if (count === 0) {
        if (canvasProgress === lastDrawn) return;
        lastDrawn = canvasProgress;
        drawWalkthrough(ctx, cssW, cssH, canvasProgress);
        return;
      }

      const idx = nearestLoaded(Math.round(canvasProgress * (count - 1)));
      if (idx < 0 || idx === lastDrawn) return;
      lastDrawn = idx;
      const img = frames[idx]!;
      // object-fit: cover
      const scale = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cssW - dw) / 2, (cssH - dh) / 2, dw, dh);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      cssW = canvas.clientWidth;
      cssH = canvas.clientHeight;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawn = -1;
      dirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Overlay ───────────────────────────────────────────
    let activeChapter = -2;

    const setChapterState = (p: number) => {
      const active = chapters.findIndex((c) => p >= c.from && p < c.to);

      updateHud(p, active);

      if (reduced) {
        // Static key frame per chapter, swapped with a cross-fade.
        if (active !== activeChapter) {
          activeChapter = active;
          const key = active >= 0 ? (chapters[active].from + chapters[active].to) / 2 : 0;
          canvas.style.opacity = "0";
          window.setTimeout(() => {
            canvasProgress = Math.min(key, 1);
            dirty = true;
            canvas.style.opacity = "1";
          }, 200);
          titleRef.current!.style.opacity = active < 0 ? "1" : "0";
          chapterRefs.current.forEach((el, i) => {
            if (el) el.style.opacity = i === active ? "1" : "0";
          });
        }
        return;
      }

      activeChapter = active;
      canvasProgress = p;
      dirty = true;

      // Title glides up and out along the same vertical path the chapters use.
      const titleOut = smooth(0.01, 0.05, p);
      titleRef.current!.style.opacity = String(1 - titleOut);
      titleRef.current!.style.transform = `translate3d(0, ${-titleOut * GLIDE}px, 0)`;

      chapterRefs.current.forEach((el, i) => {
        if (!el) return;
        const c = chapters[i];
        const local = (p - c.from) / (c.to - c.from);
        const enter = smooth(0, 0.25, local);
        const exit = i === chapters.length - 1 ? 0 : smooth(0.75, 1, local);
        el.style.opacity = String(enter * (1 - exit));
        el.style.transform = `translate3d(0, ${(1 - enter) * GLIDE - exit * GLIDE}px, 0)`;
        el.style.visibility = enter * (1 - exit) > 0.001 ? "visible" : "hidden";
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress = self.progress;
        setChapterState(progress);
      },
    });
    setChapterState(trigger.progress);

    gsap.ticker.add(render);

    return () => {
      cancelled = true;
      gsap.ticker.remove(render);
      trigger.kill();
      ro.disconnect();
      // Leave the overlay in its resting state if we switch to the mobile layout.
      title.style.removeProperty("opacity");
      title.style.removeProperty("transform");
      chapterEls.forEach((el) => {
        if (!el) return;
        el.style.opacity = "0";
        el.style.visibility = "hidden";
      });
    };
  }, [mobile]);


  return (
    <section ref={sectionRef} id="top" aria-label="Walkthrough" className="relative h-svh bg-black md:h-[500svh]">
      <div className="sticky top-0 h-svh overflow-hidden text-white">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full transition-opacity duration-200 ease-linear max-md:hidden"
        />
        {/* Dev-only: React may log a hydration diff here when `onplaying` has already revealed the video. */}
        <div ref={videoWrapRef} className="md:hidden" dangerouslySetInnerHTML={{ __html: MOBILE_VIDEO_HTML }} />
        {/* Flat scrim so white type holds contrast over bright footage */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-black/25" />

        {/* Opening title */}
        <div
          ref={titleRef}
          className="page-grid absolute inset-x-0 bottom-40 z-10 transition-opacity duration-200 motion-safe:transition-none md:bottom-44"
        >
          <p className="type-meta col-span-12 mb-6 md:col-span-3">Sector: Luxury real estate</p>
          <h1 className="type-h1 col-span-12 md:col-span-11">AI tours of luxury homes</h1>
          <p className="type-body col-span-12 mt-6 max-w-[48ch] text-white/80 md:col-span-6">
            We combine architectural art direction with generative AI to turn the photos, renders
            and plans you already have into fluid cinematic walkthroughs. No cameras, crews or
            drones on site.
          </p>
        </div>

        {/* One massive word per room, gliding up through the frame */}
        {chapters.map((c, i) => (
          <div
            key={c.word}
            ref={(el) => {
              chapterRefs.current[i] = el;
            }}
            style={{ opacity: 0, visibility: "hidden" }}
            className="page-grid absolute inset-x-0 bottom-40 z-10 transition-opacity duration-200 motion-safe:transition-none md:bottom-44"
          >
            <p className="type-meta col-span-12 mb-6 md:col-span-3">
              {String(i + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
            </p>
            <p aria-hidden className="type-h1 col-span-12 md:col-span-11">
              {c.word}
            </p>
          </div>
        ))}

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

        {heroFrames.count === 0 && (
          <p className="type-meta absolute top-20 right-6 z-10 text-white/70 md:right-10">Placeholder walkthrough</p>
        )}
      </div>
    </section>
  );
}
