"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AE, CA, EU, GB, US } from "country-flag-icons/react/3x2";
import { currencies, type CurrencyCode } from "@/lib/currency";
import { fade, spring } from "@/lib/motion";

const flags: Record<CurrencyCode, typeof GB> = { USD: US, GBP: GB, EUR: EU, AED: AE, CAD: CA };

function Flag({ code }: { code: CurrencyCode }) {
  const Svg = flags[code];
  return (
    <span aria-hidden className="inline-flex h-3 w-[18px] shrink-0 overflow-hidden border border-line">
      <Svg className="h-full w-full" />
    </span>
  );
}

type Props = { value: CurrencyCode; onChange: (code: CurrencyCode) => void; disabled?: boolean };

/** Flag button that opens a listbox of display currencies. */
export function CurrencyPicker({ value, onChange, disabled }: Props) {
  const reduced = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const selectedIndex = currencies.findIndex((c) => c.code === value);

  const openList = () => {
    setActive(selectedIndex);
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) button.current?.focus();
  };
  const choose = (i: number) => {
    onChange(currencies[i].code);
    close();
  };

  // Focus the list when it opens; close on any click outside.
  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const onButtonKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openList();
    }
  };

  const onListKey = (e: KeyboardEvent) => {
    const last = currencies.length - 1;
    if (e.key === "ArrowDown") setActive((i) => Math.min(last, i + 1));
    else if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(last);
    else if (e.key === "Enter" || e.key === " ") choose(active);
    else if (e.key === "Escape") close();
    else if (e.key === "Tab") close(false);
    else return;
    if (e.key !== "Tab") e.preventDefault();
  };

  const offset = reduced ? 0 : -6;

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`Currency: ${currencies[selectedIndex].name}. Change currency`}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKey}
        className="press type-ui inline-flex items-center gap-3 border border-line bg-white px-3 py-3 hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Flag code={value} />
        {value}
        <motion.svg
          aria-hidden
          viewBox="0 0 10 6"
          className="h-1.5 w-2.5"
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduced ? { duration: 0 } : spring}
        >
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={list}
            id={`${id}-list`}
            role="listbox"
            tabIndex={-1}
            aria-label="Currency"
            aria-activedescendant={`${id}-${currencies[active].code}`}
            onKeyDown={onListKey}
            // Enters and exits along the same path: down from the button, back up into it.
            initial={{ opacity: 0, y: offset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: offset }}
            transition={reduced ? fade : spring}
            className="absolute left-0 top-full z-20 mt-px w-60 border border-line bg-white outline-none md:left-auto md:right-0"
          >
            {currencies.map((c, i) => {
              const selected = c.code === value;
              return (
                <li
                  key={c.code}
                  id={`${id}-${c.code}`}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={`flex cursor-pointer items-center gap-3 border-b border-line px-4 py-3 last:border-b-0 ${
                    i === active ? "bg-off-white" : ""
                  }`}
                >
                  <Flag code={c.code} />
                  <span className="type-ui w-9 text-black">{c.code}</span>
                  <span className="flex-1 text-[12px] text-grey">{c.name}</span>
                  {selected && (
                    <span aria-hidden className="type-ui text-black">
                      ✓
                    </span>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
