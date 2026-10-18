import { processSpanHours, steps } from "@/lib/content";
import { Section } from "@/components/ui/Section";

export function Process() {
  return (
    <Section id="process" index={3} label="Pipeline" title="48 hours to build and deliver" tone="off-white">
      <div className="page-grid">
        {/* Desktop: one line with a tick at each step's true position; text sits in equal
            columns (first left, middle centred, last right) so it can never overlap. */}
        <div className="col-span-12 hidden md:block">
          <div aria-hidden className="relative h-px bg-black">
            {steps.map((s) => (
              <span
                key={s.hour}
                className="absolute -top-2 h-4 w-px -translate-x-1/2 bg-black first:translate-x-0 last:-translate-x-full"
                style={{ left: `${(s.hour / processSpanHours) * 100}%` }}
              />
            ))}
          </div>
          <ol className="grid gap-x-10" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
            {steps.map((s, i) => {
              const align = i === 0 ? "text-left" : i === steps.length - 1 ? "text-right" : "text-center";
              return (
                <li key={s.hour} className={`pt-8 ${align}`}>
                  <p className="type-meta text-grey">Hour {s.hour}</p>
                  <h3 className="type-h3 mt-3">{s.title}</h3>
                  <p className="type-body mt-3 text-grey">{s.body}</p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobile: the same line, vertical */}
        <ol className="col-span-12 space-y-12 border-l border-black pl-6 md:hidden">
          {steps.map((s) => (
            <li key={s.hour} className="relative">
              <span aria-hidden className="absolute top-1.5 -left-6 h-px w-3 bg-black" />
              <p className="type-meta text-grey">Hour {s.hour}</p>
              <h3 className="type-h3 mt-3">{s.title}</h3>
              <p className="type-body mt-3 text-grey">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
