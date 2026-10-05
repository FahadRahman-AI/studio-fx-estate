"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pipeline } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

const ACTIVE = "#000000";
const MUTED = "#a3a3a3";
/** Height of the fixed nav; the pinned column sits just below it. */
const NAV_OFFSET = 64;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Pinned process visualiser. On desktop the left column pins and shows the
 * active phase number while the phases scroll up on the right. Lenis drives
 * ScrollTrigger (see SmoothScroll), so every trigger here follows the smooth
 * scroll. Mobile and no-JS get a plain stacked list.
 */
export function AIProcessTimeline() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(
      { desktop: "(min-width: 48rem)", reduce: "(prefers-reduced-motion: reduce)" },
      (ctx) => {
        const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
        if (!desktop) return;

        const q = gsap.utils.selector(el);
        const pin = q("[data-pin]")[0];
        const counter = q("[data-counter]")[0];
        const numerals = q("[data-numeral]");
        const steps = q("[data-step]");
        const duration = reduce ? 0 : 0.35;

        gsap.set(steps, { color: MUTED });
        gsap.set(steps[0], { color: ACTIVE });
        gsap.set(numerals, { autoAlpha: 0, yPercent: 40 });
        gsap.set(numerals[0], { autoAlpha: 1, yPercent: 0 });

        let active = 0;
        const activate = (next: number) => {
          if (next === active) return;
          const dir = next > active ? 1 : -1;
          const tl = gsap.timeline({ defaults: { duration, ease: "power3.out", overwrite: "auto" } });
          tl.to(numerals[active], { autoAlpha: 0, yPercent: -40 * dir }, 0)
            .fromTo(numerals[next], { autoAlpha: 0, yPercent: 40 * dir }, { autoAlpha: 1, yPercent: 0 }, 0)
            .to(steps[active], { color: MUTED }, 0)
            .to(steps[next], { color: ACTIVE }, 0);
          // Fast scrolls skip phases; clear any numeral still mid-transition.
          numerals.forEach((n, i) => {
            if (i !== active && i !== next) tl.to(n, { autoAlpha: 0 }, 0);
          });
          counter.textContent = pad(next + 1);
          active = next;
        };

        const start = `top top+=${NAV_OFFSET}`;

        ScrollTrigger.create({ trigger: el, start, end: "bottom bottom", pin, pinSpacing: false });

        gsap.fromTo(
          q("[data-progress]"),
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start, end: "bottom bottom", scrub: true } },
        );

        steps.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => self.isActive && activate(i),
          });

          if (!reduce) {
            gsap.fromTo(
              step.querySelector("[data-content]"),
              { y: 48 },
              { y: 0, ease: "none", scrollTrigger: { trigger: step, start: "top bottom", end: "top center", scrub: true } },
            );
          }
        });
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div id="work" ref={root} className="page-grid mt-24 scroll-mt-16 md:mt-40">
      <div className="col-span-12 grid border-y border-line md:grid-cols-12">
        {/* Pinned numeral: desktop only */}
        <div className="hidden border-r border-line md:col-span-5 md:block">
          <div data-pin className="flex h-[calc(100svh-4rem)] flex-col justify-between py-10 pr-6">
            <p className="text-[10px] tracking-widest text-grey uppercase">
              AI process — Phase <span data-counter>01</span> / {pad(pipeline.length)}
            </p>
            <div aria-hidden className="relative overflow-hidden">
              {pipeline.map((s, i) => (
                <span
                  key={s.title}
                  data-numeral
                  className={`${i === 0 ? "block" : "invisible absolute inset-0"} text-[clamp(8rem,20vw,20rem)] leading-[0.8] font-semibold tracking-[-0.06em] tabular-nums`}
                >
                  {pad(i + 1)}
                </span>
              ))}
            </div>
            <div aria-hidden className="relative h-px bg-line">
              <span data-progress className="absolute inset-0 origin-left bg-black" />
            </div>
          </div>
        </div>

        <ol aria-label="AI production pipeline" className="md:col-span-7">
          {pipeline.map((s, i) => (
            <li
              key={s.title}
              data-step
              className="flex items-center border-t border-line py-16 first:border-t-0 md:min-h-[65svh] md:pl-10"
            >
              <div data-content className="w-full">
                <p className="text-[10px] tracking-widest uppercase">{s.meta}</p>
                <p aria-hidden className="mt-6 text-[4rem] leading-none font-semibold tracking-[-0.05em] md:hidden">
                  {pad(i + 1)}
                </p>
                <h3 className="mt-6 text-[clamp(2.75rem,6vw,6.5rem)] leading-[0.9] font-semibold tracking-[-0.04em] uppercase md:mt-10">
                  {s.title}
                </h3>
                <p className="type-body mt-6 max-w-[44ch]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
