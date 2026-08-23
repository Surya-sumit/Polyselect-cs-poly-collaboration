import { Link } from "react-router-dom";

const PIPELINE = [
  { n: "01", title: "Requirements", desc: "Describe strength, temperature, transparency, cost, and other needs." },
  { n: "02", title: "Hard Filter", desc: "Materials that physically can't meet a requirement are removed first." },
  { n: "03", title: "Weighted Score", desc: "Survivors are scored against your priorities — nothing is arbitrary." },
  { n: "04", title: "Rank & Explain", desc: "See the top pick, alternatives, and exactly why each one scored as it did." },
];

const FEATURES = [
  { to: "/select", title: "Material Selection", desc: "Answer a short requirements form, get a ranked shortlist with explanations." },
  { to: "/compare", title: "Compare Materials", desc: "Line up two or three polymers side-by-side on every key property." },
  { to: "/cost", title: "Cost Estimator", desc: "Estimate raw material cost from part weight, quantity, and price per kg." },
  { to: "/what-if", title: "What-If Simulator", desc: "Change one requirement and watch the ranking recalculate live." },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pt-16 pb-20 grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <span className="eyebrow">Polymer Material Selection Expert System</span>
          <h1 className="text-4xl md:text-5xl font-semibold leading-[1.08] mt-3 mb-5">
            Choose the right polymer<br />for your product.
          </h1>
          <p className="text-inkfaint text-base md:text-lg leading-relaxed max-w-lg mb-8">
            Compare polymer materials on performance, processing, cost, and application
            requirements — filtered by hard constraints, ranked by weighted scoring, and
            explained at every step.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/select" className="btn-primary">Start Material Selection →</Link>
            <Link to="/materials" className="btn-secondary">Explore Materials</Link>
          </div>
          <p className="font-mono text-xs text-inkfaint mt-6">
            An expert decision-support system — not an AI chatbot. Every score traces back to a documented formula.
          </p>
        </div>

        {/* signature spec-ticket preview */}
        <div className="card relative overflow-hidden max-w-sm justify-self-center w-full">
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-paper rotate-45 border-b border-l border-line" />
          <div className="p-5 flex items-start justify-between gap-4">
            <div>
              <span className="eyebrow">Sample Output</span>
              <h3 className="font-display text-2xl font-semibold mt-0.5">PETG</h3>
              <p className="text-sm text-inkfaint">Polyethylene Terephthalate Glycol</p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-mono text-3xl font-semibold text-teal leading-none">89%</div>
              <div className="font-mono text-[10px] text-inkfaint tracking-wide uppercase">match</div>
            </div>
          </div>
          <div className="h-px mx-5" style={{ backgroundImage: "repeating-linear-gradient(90deg, #C7D1C9 0 6px, transparent 6px 12px)" }} />
          <div className="p-5 pt-4 space-y-1.5 text-sm">
            <p className="flex gap-2"><span className="text-teal font-mono">✓</span>Good transparency &amp; chemical resistance</p>
            <p className="flex gap-2"><span className="text-teal font-mono">✓</span>Suitable for the specified temperature</p>
            <p className="flex gap-2"><span className="text-teal font-mono">✓</span>Reasonable material cost</p>
          </div>
        </div>
      </section>

      {/* PIPELINE — a real sequence, so numbering is meaningful here */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-16 border-t border-line">
        <span className="eyebrow">How PolySelect Decides</span>
        <h2 className="text-2xl md:text-3xl font-semibold mt-2 mb-10">The recommendation pipeline</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PIPELINE.map((p) => (
            <div key={p.n} className="card p-5">
              <div className="font-mono text-teal text-sm mb-3">{p.n}</div>
              <h3 className="font-display font-semibold text-lg mb-1.5">{p.title}</h3>
              <p className="text-sm text-inkfaint leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-16 border-t border-line">
        <span className="eyebrow">The Toolkit</span>
        <h2 className="text-2xl md:text-3xl font-semibold mt-2 mb-10">Beyond a single recommendation</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to} className="card p-6 hover:border-teal transition-colors group">
              <h3 className="font-display font-semibold text-lg mb-1.5 group-hover:text-teal transition-colors">
                {f.title} →
              </h3>
              <p className="text-sm text-inkfaint leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
