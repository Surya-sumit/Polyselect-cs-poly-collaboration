import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../api.js";
import { Loader, ErrorNote } from "../components/Loader.jsx";

const LMH = ["NotImportant", "Low", "Medium", "High"];
const RPN = ["NotImportant", "Preferred", "Required"];

function MiniForm({ title, req, setReq }) {
  const update = (k, v) => setReq((r) => ({ ...r, [k]: v }));
  return (
    <div className="card p-5">
      <span className="eyebrow">{title}</span>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="field-label">Operating temp (°C)</label>
          <input type="number" className="field-input" value={req.operating_temp_c ?? ""} onChange={(e) => update("operating_temp_c", e.target.value === "" ? null : Number(e.target.value))} />
        </div>
        <div>
          <label className="field-label">Strength</label>
          <select className="field-select" value={req.required_strength} onChange={(e) => update("required_strength", e.target.value)}>
            {LMH.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Chemical resistance</label>
          <select className="field-select" value={req.chemical_resistance} onChange={(e) => update("chemical_resistance", e.target.value)}>
            {RPN.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Transparency</label>
          <select className="field-select" value={req.transparency} onChange={(e) => update("transparency", e.target.value)}>
            {RPN.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Budget level</label>
          <select className="field-select" value={req.budget_level} onChange={(e) => update("budget_level", e.target.value)}>
            {LMH.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Food contact</label>
          <label className="flex items-center gap-2 field-select cursor-pointer">
            <input type="checkbox" className="accent-teal w-4 h-4" checked={req.food_contact} onChange={(e) => update("food_contact", e.target.checked)} />
            Required
          </label>
        </div>
      </div>
    </div>
  );
}

function RankColumn({ label, data }) {
  return (
    <div>
      <h3 className="font-display font-semibold mb-3">{label}</h3>
      {data.ranked.length === 0 && <p className="text-sm text-inkfaint font-mono">No material passed hard constraints.</p>}
      <ol className="space-y-2">
        {data.ranked.slice(0, 5).map((r, i) => (
          <li key={r.material.id} className="card p-3 flex items-center justify-between">
            <span className="font-mono text-sm"><span className="text-inkfaint">#{i + 1}</span> {r.material.abbreviation}</span>
            <span className="font-mono text-sm text-teal">{Math.round(r.total_score)}%</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function WhatIf() {
  const { requirements, DEFAULT_REQUIREMENTS } = useApp();
  const [before, setBefore] = useState(requirements || DEFAULT_REQUIREMENTS);
  const [after, setAfter] = useState({ ...(requirements || DEFAULT_REQUIREMENTS) });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.whatIf(before, after);
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
      <span className="eyebrow">Step 3 of 3 — Simulate</span>
      <h1 className="text-3xl font-semibold mt-2 mb-2">What-If Simulator</h1>
      <p className="text-inkfaint mb-10">
        Change a requirement on the right and see exactly how — and why — the ranking shifts.
        This proves the recommendation comes from the live algorithm, not a hard-coded answer.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <MiniForm title="Before" req={before} setReq={setBefore} />
        <MiniForm title="After" req={after} setReq={setAfter} />
      </div>

      <button onClick={run} className="btn-primary mb-10" disabled={loading}>
        {loading ? "Recalculating…" : "Run What-If →"}
      </button>

      {error && <ErrorNote message={error} />}
      {loading && <Loader label="Recalculating ranking" />}

      {result && (
        <>
          <div className="card p-5 mb-8 border-teal">
            <p className="font-display font-semibold text-lg">{result.headline}</p>
            {result.movements.length > 0 && (
              <ul className="mt-3 space-y-1">
                {result.movements.map((m, i) => (
                  <li key={i} className="text-sm font-mono text-inkfaint">→ {m}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <RankColumn label="Before" data={result.before} />
            <RankColumn label="After" data={result.after} />
          </div>
        </>
      )}
    </div>
  );
}
