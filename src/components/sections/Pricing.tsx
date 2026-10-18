import { getRates } from "@/lib/rates";
import { Section } from "@/components/ui/Section";
import { PricingTable } from "@/components/sections/PricingTable";

/** Packages in the same hairline grid as the archive, with live display-currency conversion. */
export async function Pricing() {
  const rates = await getRates();
  return (
    <Section id="pricing" index={4} label="Pricing" title="Packages">
      <PricingTable rates={rates} />
    </Section>
  );
}
