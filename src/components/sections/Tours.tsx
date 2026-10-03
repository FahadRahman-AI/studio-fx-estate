import { tours } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Still } from "@/components/ui/Still";

/** Staggered grid: alternates cols 1–5 and 7–12, odd items dropped 160px. */
const placement = [
  "md:col-span-5",
  "md:col-span-6 md:col-start-7 md:mt-40",
  "md:col-span-6 md:col-start-2",
  "md:col-span-5 md:col-start-8 md:mt-40",
];

export function Tours() {
  return (
    <Section id="tours" index={2} label="Selected tours" title="Recent walkthroughs">
      <ul className="page-grid gap-y-16 md:gap-y-24">
        {tours.map((t, i) => (
          <li key={t.name} className={`col-span-12 ${placement[i % placement.length]}`}>
            <Still ratio="4 / 5" label="Placeholder still — 4:5" />
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h3 className="type-h3">{t.name}</h3>
              <p className="type-meta shrink-0 text-grey">
                {String(i + 1).padStart(2, "0")} — {t.place} — {t.length}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
