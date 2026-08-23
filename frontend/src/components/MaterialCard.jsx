import { Link } from "react-router-dom";

/**
 * The signature visual element of PolySelect: each ranked result renders as
 * a lab specimen / datasheet "ticket" — a match-percentage readout up top,
 * a perforated divider, then the explanation checklist below.
 */
export default function MaterialCard({ rank, ranked, highlight = false }) {
  const m = ranked.material;
  const pct = Math.round(ranked.total_score);

  return (
    <div
      className={`card relative overflow-hidden ${
        highlight ? "border-teal shadow-[0_0_0_1px_#146356]" : ""
      }`}
    >
      {/* corner notch */}
      <div className="absolute -top-3 -right-3 w-6 h-6 bg-paper rotate-45 border-b border-l border-line" />

      <div className="p-5 flex items-start justify-between gap-4">
        <div>
          {rank && (
            <span className="eyebrow">
              {highlight ? "Top Recommendation" : `Alternative #${rank}`}
            </span>
          )}
          <h3 className="font-display text-2xl font-semibold mt-0.5">{m.abbreviation}</h3>
          <p className="text-sm text-inkfaint">{m.name}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-3xl font-semibold text-teal leading-none">{pct}%</div>
          <div className="font-mono text-[10px] text-inkfaint tracking-wide uppercase">match</div>
        </div>
      </div>

      {/* perforated divider */}
      <div
        className="h-px mx-5"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, #C7D1C9 0 6px, transparent 6px 12px)" }}
      />

      <div className="p-5 pt-4">
        <ul className="space-y-1.5 mb-4">
          {ranked.why.slice(0, 4).map((w, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink">
              <span className="font-mono text-teal mt-0.5">✓</span>
              {w}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          <Link to={`/materials/${m.id}`} className="btn-secondary !px-4 !py-2 text-sm">
            Learn more
          </Link>
          <Link to="/compare" state={{ addMaterialId: m.id }} className="btn-secondary !px-4 !py-2 text-sm">
            Add to compare
          </Link>
        </div>
      </div>
    </div>
  );
}
