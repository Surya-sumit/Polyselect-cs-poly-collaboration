import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../api.js";

function Field({ label, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function LevelSelect({ value, onChange, options }) {
  return (
    <select className="field-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o} value={o}>{o.replace(/([A-Z])/g, " $1").trim()}</option>
      ))}
    </select>
  );
}

const LMH = ["NotImportant", "Low", "Medium", "High"];
const RPN = ["NotImportant", "Preferred", "Required"];

export default function Selection() {
  const navigate = useNavigate();
  const { requirements, setRequirements, productName, setProductName, setRecommendation } = useApp();
  const [req, setReq] = useState(requirements);
  const [showWeights, setShowWeights] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (key, value) => setReq((r) => ({ ...r, [key]: value }));
  const updateWeight = (key, value) => setReq((r) => ({ ...r, weights: { ...r.weights, [key]: Number(value) } }));

  const weightTotal = Object.values(req.weights).reduce((a, b) => a + Number(b), 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { ...req, operating_temp_c: req.operating_temp_c === "" ? null : Number(req.operating_temp_c) };
      const result = await api.recommend(payload);
      setRequirements(payload);
      setRecommendation(result);
      navigate("/results");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-14">
      <span className="eyebrow">Step 1 of 3</span>
      <h1 className="text-3xl font-semibold mt-2 mb-2">What are you trying to manufacture?</h1>
      <p className="text-inkfaint mb-10">
        Fill in what you know — leave the rest as "Not Important." Fields marked Required act as
        hard constraints; everything else is a weighted preference.
      </p>

      <form onSubmit={handleSubmit} className="space-y-10">
        <section className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-5">Product Information</h2>
          <Field label="Product / application name (optional)">
            <input
              className="field-input"
              placeholder="e.g. Reusable food container"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Field>
        </section>

        <section className="card p-6 grid sm:grid-cols-2 gap-5">
          <h2 className="font-display font-semibold text-lg sm:col-span-2 mb-1">Performance Requirements</h2>

          <Field label="Operating temperature (°C, max exposure)">
            <input
              type="number"
              className="field-input"
              placeholder="e.g. 60"
              value={req.operating_temp_c ?? ""}
              onChange={(e) => update("operating_temp_c", e.target.value)}
            />
          </Field>

          <Field label="Required strength">
            <LevelSelect value={req.required_strength} onChange={(v) => update("required_strength", v)} options={LMH} />
          </Field>

          <Field label="Flexibility">
            <LevelSelect value={req.flexibility} onChange={(v) => update("flexibility", v)} options={LMH} />
          </Field>

          <Field label="Transparency">
            <LevelSelect value={req.transparency} onChange={(v) => update("transparency", v)} options={RPN} />
          </Field>

          <Field label="Chemical resistance">
            <LevelSelect value={req.chemical_resistance} onChange={(v) => update("chemical_resistance", v)} options={RPN} />
          </Field>

          <Field label="UV resistance (outdoor use)">
            <LevelSelect value={req.uv_resistance} onChange={(v) => update("uv_resistance", v)} options={RPN} />
          </Field>
        </section>

        <section className="card p-6 grid sm:grid-cols-2 gap-5">
          <h2 className="font-display font-semibold text-lg sm:col-span-2 mb-1">Application &amp; Economics</h2>

          <Field label="Food contact application">
            <label className="flex items-center gap-2 field-select cursor-pointer">
              <input
                type="checkbox"
                checked={req.food_contact}
                onChange={(e) => update("food_contact", e.target.checked)}
                className="accent-teal w-4 h-4"
              />
              Requires food-contact approval
            </label>
          </Field>

          <Field label="Production volume">
            <LevelSelect value={req.production_volume} onChange={(v) => update("production_volume", v)} options={["Low", "Medium", "High"]} />
          </Field>

          <Field label="Budget level">
            <LevelSelect value={req.budget_level} onChange={(v) => update("budget_level", v)} options={LMH} />
          </Field>

          <Field label="Sustainability importance">
            <LevelSelect value={req.sustainability_importance} onChange={(v) => update("sustainability_importance", v)} options={RPN} />
          </Field>
        </section>

        <section className="card p-6">
          <button
            type="button"
            onClick={() => setShowWeights((s) => !s)}
            className="flex items-center justify-between w-full font-display font-semibold text-lg"
          >
            Advanced: Adjust Scoring Weights
            <span className="font-mono text-sm text-teal">{showWeights ? "hide" : "show"}</span>
          </button>
          {showWeights && (
            <div className="mt-5 space-y-4">
              <p className="text-xs text-inkfaint font-mono">
                Total: {weightTotal}% {weightTotal !== 100 && "(doesn't need to equal 100 — the engine normalizes to each factor's own scale)"}
              </p>
              {Object.entries(req.weights).map(([key, val]) => (
                <div key={key} className="flex items-center gap-4">
                  <span className="w-40 text-sm font-mono capitalize">{key.replace("_", " ")}</span>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={val}
                    onChange={(e) => updateWeight(key, e.target.value)}
                    className="flex-1 accent-teal"
                  />
                  <span className="w-10 text-right font-mono text-sm">{val}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {error && <p className="font-mono text-sm text-danger">{error}</p>}

        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
          {loading ? "Scoring materials…" : "Get Recommendation →"}
        </button>
      </form>
    </div>
  );
}
