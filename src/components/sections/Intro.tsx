import { featured, intro, stats } from "@/lib/content";
import { Still } from "@/components/ui/Still";

/** Intro statement, featured tour and the numbers list. */
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

      {/* Featured tour */}
      <div id="work" className="page-grid mt-24 scroll-mt-16 md:mt-40">
        <Still ratio="16 / 9" label="Placeholder still — 16:9" className="col-span-12" />
        <div className="col-span-12 mt-6 flex items-baseline justify-between border-b border-line pb-6">
          <h3 className="type-h3">{featured.name}</h3>
          <p className="type-meta text-grey">Featured walkthrough</p>
        </div>
        <dl className="col-span-12 grid grid-cols-2 md:grid-cols-4">
          {featured.specs.map((s, i) => (
            <div
              key={s.label}
              className={`border-b border-line py-6 md:border-b-0 ${i % 2 ? "pl-6" : ""} ${i > 0 ? "md:border-l md:pl-6" : ""} ${i % 2 ? "border-l" : ""}`}
            >
              <dt className="type-meta text-grey">{s.label}</dt>
              <dd className="type-h3 mt-2">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Numbers: vertical blueprint rules between columns */}
      <dl className="page-grid mt-24 md:mt-40">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`col-span-12 flex flex-col-reverse justify-end border-t border-line py-8 md:col-span-4 md:border-t-0 md:py-0 ${i > 0 ? "md:border-l md:pl-6" : ""}`}
          >
            {/* dt before dd for valid markup; column-reverse puts the number on top */}
            <dt className="type-meta mt-4 text-grey">{s.label}</dt>
            <dd className="type-h2">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
