import { processSpanDays, steps } from "@/lib/content";
import { Section } from "@/components/ui/Section";

export function Process() {
  return (
    <Section id="process" index={3} label="Process" title="Seven days, address to film" tone="off-white">
      <div className="page-grid">
        {/* Desktop: one line, marks positioned by day */}
        <div className="relative col-span-12 hidden md:block">
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-black" />
          <ol className="relative h-64">
            {steps.map((s) => {
              const last = s.day === processSpanDays;
              return (
                <li
                  key={s.day}
                  className="absolute top-0 w-[28%]"
                  style={last ? { right: 0 } : { left: `${(s.day / processSpanDays) * 100}%` }}
                >
                  <span aria-hidden className={`absolute -top-2 h-4 w-px bg-black ${last ? "right-0" : "left-0"}`} />
                  <div className={`pt-8 ${last ? "text-right" : ""}`}>
                    <p className="type-meta text-grey">Day {s.day}</p>
                    <h3 className="type-h3 mt-3">{s.title}</h3>
                    <p className="type-body mt-3 text-grey">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobile: the same line, vertical */}
        <ol className="col-span-12 space-y-12 border-l border-black pl-6 md:hidden">
          {steps.map((s) => (
            <li key={s.day} className="relative">
              <span aria-hidden className="absolute top-1.5 -left-6 h-px w-3 bg-black" />
              <p className="type-meta text-grey">Day {s.day}</p>
              <h3 className="type-h3 mt-3">{s.title}</h3>
              <p className="type-body mt-3 text-grey">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
