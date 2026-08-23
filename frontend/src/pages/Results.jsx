import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import MaterialCard from "../components/MaterialCard.jsx";
import ScoreBar from "../components/ScoreBar.jsx";

export default function Results() {
  const navigate = useNavigate();
  const { recommendation, productName } = useApp();

  if (!recommendation) {
    return (
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-3">No results yet</h1>
        <p className="text-inkfaint mb-6">Run the material selection form first to see a recommendation.</p>
        <Link to="/select" className="btn-primary">Start Material Selection →</Link>
      </div>
    );
  }

  const { ranked, rejected, disclaimer } = recommendation;
  const top = ranked[0];
  const alternatives = ranked.slice(1, 4);

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
      <span className="eyebrow">Step 2 of 3 — Recommendation</span>
      <h1 className="text-3xl font-semibold mt-2 mb-2">
        {productName ? `Results for "${productName}"` : "Recommended Materials"}
      </h1>
      <p className="text-inkfaint mb-10">
        {ranked.length} material{ranked.length !== 1 ? "s" : ""} passed hard constraints · {rejected.length} rejected
      </p>

      {!top && (
        <div className="card p-6 mb-10 border-danger/40 bg-danger/5">
          <p className="text-danger font-medium mb-2">No material satisfies every hard constraint you specified.</p>
          <p className="text-sm text-inkfaint">Try relaxing a "Required" field or the operating temperature — see the rejection reasons below.</p>
        </div>
      )}

      {top && (
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 mb-14">
          <MaterialCard rank={1} ranked={top} highlight />

          <div className="card p-6">
            <span className="eyebrow">Why {top.material.abbreviation}?</span>
            <h2 className="font-display font-semibold text-lg mt-1 mb-5">Score Contribution Breakdown</h2>
            <div className="space-y-1">
              {top.contributions.map((c) => (
                <ScoreBar key={c.factor} label={c.factor} value={c.points} max={c.max_points} displayValue={c.points} />
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-line">
              <Link to="/cost" state={{ materialId: top.material.id }} className="btn-secondary !px-4 !py-2 text-sm">
                Estimate cost →
              </Link>
              <Link to="/what-if" className="btn-secondary !px-4 !py-2 text-sm">
                Run What-If →
              </Link>
              <Link to={`/materials/${top.material.id}`} className="btn-secondary !px-4 !py-2 text-sm">
                Full material profile →
              </Link>
            </div>
          </div>
        </div>
      )}

      {alternatives.length > 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-6">Alternative Materials</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {alternatives.map((r, i) => (
              <MaterialCard key={r.material.id} rank={i + 2} ranked={r} />
            ))}
          </div>
        </section>
      )}

      {rejected.length > 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-1">Why Not the Others?</h2>
          <p className="text-inkfaint text-sm mb-6">
            These materials were removed by a hard constraint before scoring even began.
          </p>
          <div className="card divide-y divide-line">
            {rejected.map((r) => (
              <div key={r.abbreviation} className="p-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="font-mono font-semibold text-sm w-16 shrink-0">{r.abbreviation}</span>
                <span className="text-sm text-inkfaint">{r.reason}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="font-mono text-xs text-inkfaint border-t border-line pt-6">{disclaimer}</p>

      <button onClick={() => navigate("/select")} className="btn-secondary mt-8">
        ← Adjust Requirements
      </button>
    </div>
  );
}
