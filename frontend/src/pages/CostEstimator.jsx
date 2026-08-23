import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api.js";
import { Loader, ErrorNote } from "../components/Loader.jsx";

export default function CostEstimator() {
  const location = useLocation();
  const [materials, setMaterials] = useState(null);
  const [materialId, setMaterialId] = useState(location.state?.materialId || null);
  const [weight, setWeight] = useState(120);
  const [qty, setQty] = useState(1000);
  const [result, setResult] = useState(null);
  const [allCosts, setAllCosts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.listMaterials().then((list) => {
      setMaterials(list);
      if (!materialId && list.length) setMaterialId(list[0].id);
    }).catch((e) => setError(e.message));
  }, []);

  async function handleEstimate(e) {
    e?.preventDefault();
    if (!materialId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.cost({ material_id: materialId, part_weight_g: Number(weight), quantity: Number(qty) });
      setResult(res);

      const all = await Promise.all(
        materials.map((m) => api.cost({ material_id: m.id, part_weight_g: Number(weight), quantity: Number(qty) }))
      );
      setAllCosts(all.sort((a, b) => a.cost_per_product_inr - b.cost_per_product_inr));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!materials) return <Loader label="Loading materials" />;

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-14">
      <span className="eyebrow">Economics</span>
      <h1 className="text-3xl font-semibold mt-2 mb-2">Material Cost Estimator</h1>
      <p className="text-inkfaint mb-8">
        Estimates <strong>raw material cost only</strong> — tooling, labor, and processing cost are excluded.
      </p>

      <form onSubmit={handleEstimate} className="card p-6 grid sm:grid-cols-3 gap-5 mb-10">
        <div>
          <label className="field-label">Material</label>
          <select className="field-select" value={materialId || ""} onChange={(e) => setMaterialId(Number(e.target.value))}>
            {materials.map((m) => <option key={m.id} value={m.id}>{m.abbreviation} — {m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Part weight (g)</label>
          <input type="number" className="field-input" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Quantity</label>
          <input type="number" className="field-input" value={qty} onChange={(e) => setQty(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary sm:col-span-3" disabled={loading}>
          {loading ? "Calculating…" : "Calculate Cost →"}
        </button>
      </form>

      {error && <ErrorNote message={error} />}

      {result && (
        <section className="card p-6 mb-10">
          <span className="eyebrow">{result.material}</span>
          <div className="grid sm:grid-cols-3 gap-6 mt-4">
            <div>
              <div className="font-mono text-[11px] uppercase text-inkfaint">Material required</div>
              <div className="font-mono text-2xl">{result.estimated_material_required_kg} kg</div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase text-inkfaint">Total estimated cost</div>
              <div className="font-mono text-2xl text-teal">₹{result.estimated_total_cost_inr.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase text-inkfaint">Cost / product</div>
              <div className="font-mono text-2xl">₹{result.cost_per_product_inr}</div>
            </div>
          </div>
          <p className="font-mono text-xs text-inkfaint mt-5 pt-5 border-t border-line">{result.note}</p>
        </section>
      )}

      {allCosts && (
        <section>
          <h2 className="text-xl font-semibold mb-1">Cost / Product Across Materials</h2>
          <p className="text-inkfaint text-sm mb-5">Same part weight and quantity, ranked cheapest first.</p>
          <div className="card divide-y divide-line">
            {allCosts.map((c) => (
              <div key={c.material} className="p-4 flex items-center justify-between">
                <span className="font-mono font-semibold">{c.material}</span>
                <span className="font-mono text-sm">₹{c.cost_per_product_inr} / product</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
