/** Flat placeholder for a film still. Swap for next/image once real stills exist. */
export function Still({ ratio, label, className = "" }: { ratio: string; label: string; className?: string }) {
  return (
    <div
      className={`relative border border-line bg-off-white ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <span className="type-meta absolute bottom-4 left-4 text-grey">{label}</span>
    </div>
  );
}
