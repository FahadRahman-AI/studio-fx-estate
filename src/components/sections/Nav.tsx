"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { brand, nav } from "@/lib/content";
import { fade, spring } from "@/lib/motion";
import { buttonPrimary } from "@/components/ui/button";

export function Nav() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const offset = reduced ? 0 : -12;

  return (
    <header className="material fixed inset-x-0 top-0 z-50 border-b border-line text-black">
      <nav aria-label="Main" className="page-grid h-16 items-center">
        <a href="#top" className="press col-span-6 justify-self-start text-[13px] font-semibold uppercase tracking-[0.1em] md:col-span-3">
          {brand.name}
        </a>

        <ul className="col-span-9 hidden items-center justify-end gap-8 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="press type-ui inline-block text-grey hover:text-black">
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#book" className={`${buttonPrimary} px-4 py-3`}>
              Commission a tour +
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="press type-ui col-span-6 justify-self-end border border-black px-4 py-3 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            id="mobile-menu"
            // Enters and exits along the same path: down from the bar, back up into it.
            initial={{ opacity: 0, y: offset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: offset }}
            transition={reduced ? fade : spring}
            className="border-t border-line px-6 pb-6 md:hidden"
          >
            {[...nav, { label: "Commission a tour", href: "#book" }].map((item) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="press type-h3 block py-4 uppercase"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
