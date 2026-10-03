import { brand, disciplines, nav } from "@/lib/content";

/** Black footer divided into blueprint cells by #333 rules. */
export function Footer() {
  const cell = "border-t border-grey px-6 py-8 md:border-t-0 md:border-l md:first:border-l-0";

  return (
    <footer className="bg-black text-white">
      {/* md:px-4 + cell px-6 lands the outer text on the 40px page margin */}
      <div className="grid md:grid-cols-4 md:px-4">
        <div className={cell}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em]">{brand.name}</p>
        </div>
        <div className={cell}>
          <p className="type-meta text-white/60">Pages</p>
          <ul className="type-ui mt-6 space-y-4">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="press inline-block hover:text-white/60">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={cell}>
          <p className="type-meta text-white/60">Workflows</p>
          <ul className="type-ui mt-6 space-y-4">
            {disciplines.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className={cell}>
          <p className="type-meta text-white/60">Contact</p>
          <a href={`mailto:${brand.email}`} className="press type-ui mt-6 inline-block hover:text-white/60">
            {brand.email}
          </a>
        </div>
      </div>
      <div className="type-meta flex justify-between border-t border-grey px-6 py-6 text-white/60 md:px-10">
        <span>© {new Date().getFullYear()} {brand.name}</span>
        <a href="#top" className="press inline-block hover:text-white">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
