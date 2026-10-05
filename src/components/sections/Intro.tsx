import { intro, stats } from "@/lib/content";
import { AIProcessTimeline } from "@/components/sections/AIProcessTimeline";
import { CountUp } from "@/components/ui/CountUp";

/** Intro statement, AI process timeline and the numbers list. */
export function Intro() {
  return (
    <section aria-labelledby="intro-title" className="bg-white pt-40 pb-24 md:pt-56 md:pb-40">
      {/* Statement: heading cols 1–7, paragraph cols 9–12 */}
      <div className="page-grid gap-y-10">
        <h2 id="intro-title" className="type-h2 col-span-12 md:col-span-7">
          {intro.title}
        </h2>
        <p className="type-body col-span-12 max-w-[60ch] self-end text-grey md:col-span-4 md:col-start-9">
          {intro.body}
        </p>
      </div>

      <AIProcessTimeline />

      {/* Numbers: vertical blueprint rules between columns */}
      <dl className="page-grid mt-24 md:mt-40">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`col-span-12 flex flex-col-reverse justify-end border-t border-line py-8 md:col-span-4 md:border-t-0 md:py-0 ${i > 0 ? "md:border-l md:pl-6" : ""}`}
          >
            {/* dt before dd for valid markup; column-reverse puts the number on top */}
            <dt className="type-meta mt-4 text-grey">{s.label}</dt>
            <dd className="type-h2">
              <CountUp value={s.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
