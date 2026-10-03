import { services } from "@/lib/content";
import { Section } from "@/components/ui/Section";

export function Services() {
  return (
    <Section id="services" index={1} label="Services" title="Three ways to film a home" tone="off-white">
      <ol className="page-grid gap-y-0">
        {services.map((s, i) => (
          <li
            key={s.name}
            className={`col-span-12 border-t border-line py-8 md:col-span-4 md:py-10 ${i > 0 ? "md:border-l md:pl-6" : ""}`}
          >
            <p className="type-meta text-grey">
              {String(i + 1).padStart(2, "0")} — {s.count}
            </p>
            <h3 className="type-h3 mt-10 md:mt-24">{s.name}</h3>
            <p className="type-body mt-3 max-w-[40ch] text-grey">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
