import { pricing } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { buttonPrimary, buttonSecondary } from "@/components/ui/button";

/** Packages in the same hairline grid as the archive: one cell per tier. */
export function Pricing() {
  return (
    <Section id="pricing" index={4} label="Pricing (USD)" title="Packages">
      <div className="page-grid">
        {/* gap-px over a line-coloured fill draws every 1px rule between cells */}
        <ul className="col-span-12 grid grid-cols-12 gap-px border border-line bg-line">
          {pricing.map((p, i) => (
            <li key={p.name} className="col-span-12 flex flex-col bg-white md:col-span-4">
              <div className="type-meta flex items-center justify-between gap-4 border-b border-line px-4 py-3 md:px-6">
                <span className="text-grey">{String(i + 1).padStart(2, "0")}</span>
                {p.popular && <span>Most Popular</span>}
              </div>

              <div className="px-4 pt-8 md:px-6">
                <h3 className="type-h3">{p.name}</h3>
                <p className="mt-2">
                  <span className="type-h3">{p.price}</span>
                  <span className="type-meta ml-2 text-grey">{p.per}</span>
                </p>
              </div>

              <ul className="mt-8 border-t border-line">
                {p.features.map((f) => (
                  <li key={f} className="type-body border-b border-line px-4 py-3 text-grey md:px-6">
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-auto px-4 py-6 md:px-6">
                <a href="#book" className={`${p.popular ? buttonPrimary : buttonSecondary} px-5 py-4`}>
                  Commission a tour +
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
