import type { ReactNode } from "react";

type Props = {
  id: string;
  index: number;
  label: string;
  title: string;
  tone?: "white" | "off-white";
  children: ReactNode;
};

/** Blueprint section: hairline on top, index label in columns 1–3, heading from column 4. */
export function Section({ id, index, label, title, tone = "white", children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-16 border-t border-line py-24 md:py-40 ${tone === "off-white" ? "bg-off-white" : "bg-white"}`}
    >
      <div className="page-grid gap-y-6">
        <p className="type-meta col-span-12 text-grey md:col-span-3">
          {String(index).padStart(2, "0")} — {label}
        </p>
        <h2 id={`${id}-title`} className="type-h2 col-span-12 md:col-span-9">
          {title}
        </h2>
      </div>
      <div className="mt-16 md:mt-24">{children}</div>
    </section>
  );
}
