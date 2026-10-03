"use client";

import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { brand, shotOptions } from "@/lib/content";
import { fade, spring } from "@/lib/motion";
import { buttonPrimary, buttonSecondary } from "@/components/ui/button";

function Field({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block border-b border-line focus-within:border-black">
      <span className="type-meta text-grey">{label}</span>
      <input {...props} className="type-body w-full bg-transparent py-3 outline-none" />
    </label>
  );
}

export function Book() {
  const reduced = useReducedMotion();
  const [shots, setShots] = useState<string[]>([shotOptions[0]]);
  const [sent, setSent] = useState(false);

  const toggle = (s: string) =>
    setShots((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: send to your booking endpoint (form service, CRM or API route).
    setSent(true);
  };

  const offset = reduced ? 0 : 16;
  const transition = reduced ? fade : spring;

  return (
    <section id="book" aria-labelledby="book-title" className="scroll-mt-16 border-t border-line bg-white py-24 md:py-40">
      <div className="page-grid">
        <p className="type-meta col-span-12 text-grey md:col-span-3">04 — Booking</p>
        <h2 id="book-title" className="type-h1 col-span-12 mt-6 md:mt-0">
          Start your tour
        </h2>
      </div>

      <div className="page-grid mt-16 gap-y-10 md:mt-24">
        <p className="type-body col-span-12 max-w-[40ch] text-grey md:col-span-3">
          Send the address and we’ll reply with a flight plan and fixed quote within one working day.
          Prefer email?{" "}
          <a href={`mailto:${brand.email}`} className="text-black underline underline-offset-4">
            {brand.email}
          </a>
        </p>

        <div className="col-span-12 md:col-span-8 md:col-start-5">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: offset }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: offset }}
                transition={transition}
              >
                <p className="type-h3">Thanks — we’ve got it.</p>
                <p className="type-body mt-3 text-grey">
                  Your flight plan and quote will arrive within one working day.
                </p>
                <button type="button" onClick={() => setSent(false)} className={`${buttonSecondary} mt-10 px-5 py-4`}>
                  Book another property +
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0, y: offset }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: offset }}
                transition={transition}
                className="grid gap-x-6 gap-y-10 md:grid-cols-2"
              >
                <div className="md:col-span-2">
                  <Field label="Property address" name="address" required autoComplete="street-address" />
                </div>
                <Field label="Your name" name="name" required autoComplete="name" />
                <Field label="Email" name="email" type="email" required autoComplete="email" />
                <Field label="Preferred shoot date" name="date" type="date" />
                <Field label="Bedrooms" name="bedrooms" type="number" min={1} inputMode="numeric" />

                <fieldset className="md:col-span-2">
                  <legend className="type-meta text-grey">What should we film?</legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {shotOptions.map((s) => {
                      const on = shots.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(s)}
                          className={`press type-ui border px-4 py-3 ${
                            on ? "border-black bg-black text-white" : "border-line text-grey hover:border-black hover:text-black"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <input type="hidden" name="shots" value={shots.join(", ")} />
                </fieldset>

                <div className="md:col-span-2">
                  <button type="submit" className={`${buttonPrimary} px-5 py-4`}>
                    Send for a flight plan +
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
