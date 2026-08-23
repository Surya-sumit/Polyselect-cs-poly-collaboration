import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { api } from "../api.js";
import { Loader, ErrorNote } from "../components/Loader.jsx";

const COLORS = ["#146356", "#C97A2B", "#4B5A54"];

const ROWS = [
  { label: "Tensile strength", key: (m) => `${m.tensile_strength_mpa ?? "—"} MPa`, radar: (m) => m.tensile_strength_score },
  { label: "Max operating temp", key: (m) => `${m.max_operating_temp_c ?? "—"} °C`, radar: (m) => Math.min((m.max_operating_temp_c || 0) / 20, 10) },
  { label: "Flexibility", key: (m) => `${m.flexibility_score}/10`, radar: (m) => m.flexibility_score },
  { label: "Transparency", key: (m) => `${m.transparency_score}/10`, radar: (m) => m.transparency_score },
  { label: "Chemical resistance", key: (m) => `${m.chemical_resistance_score}/10`, radar: (m) => m.chemical_resistance_score },
  { label: "UV resistance", key: (m) => `${m.uv_resistance_score}/10`, radar: (m) => m.uv_resistance_score },
  { label: "Sustainability", key: (m) => `${m.sustainability_score}/10`, radar: (m) => m.sustainability_score },
  { label: "Density", key: (m) => `${m.density_g_cm3} g/cm³`, radar: null },
  { label: "Food contact safe", key: (m) => (m.food_contact_safe ? "Yes" : "No"), radar: null },
  { label: "Recyclability", key: (m) => `${m.recyclability_score}/10`, radar: null },
  { label: "Price / kg", key: (m) => `₹${m.price_per_kg_inr_min}–${m.price_per_kg_inr_max}`, radar: null },
];

const RADAR_ROWS = ROWS.filter((r) => r.radar);

export default function Compare() {
  const location = useLocation();
  const [all, setAll] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [compared, setCompared] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.listMaterials().then((list) => {
      setAll(list);
      const preselect = location.state?.addMaterialId;
      if (preselect) setSelectedIds([preselect]);
    }).catch((e) => setError(e.message));
  }, [location.state]);

  function toggle(id) {
    setSelectedIds((ids) => {
      if (ids.includes(id)) return ids.filter((i) => i !== id);
      if (ids.length >= 3) return ids; // cap at 3
      return [...ids, id];
    });
  }

  async function runCompare() {
    setError(null);
    try {
      const res = await api.compare(selectedIds);
      setCompared(res.materials);
    } catch (e) {
      setError(e.message);
    }
  }

  if (error) return <div className="max-w-6xl mx-auto px-5 md:px-8 py-14"><ErrorNote message={error} /></div>;
  if (!all) return <Loader label="Loading materials" />;

  const radarData = compared
    ? RADAR_ROWS.map((row) => {
        const point = { property: row.label };
        compared.forEach((m) => { point[m.abbreviation] = row.radar(m); });
        return point;
      })
    : [];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
      <span className="eyebrow">Property Comparison</span>
      <h1 className="text-3xl font-semibold mt-2 mb-2">Compare Materials</h1>
      <p className="text-inkfaint mb-8">Pick 2–3 materials to compare side-by-side. Chart values use real database scores.</p>

      <div className="card p-5 mb-8">
        <p className="font-mono text-xs text-inkfaint mb-3">SELECT MATERIALS ({selectedIds.length}/3)</p>
        <div className="flex flex-wrap gap-2">
          {all.map((m) => (
            <button
              key={m.id}
              onClick={() => toggle(m.id)}
              className={`font-mono text-xs px-3 py-1.5 rounded-sm2 border transition-colors ${
                selectedIds.includes(m.id) ? "bg-teal text-white border-teal" : "border-line hover:border-teal"
              }`}
            >
              {m.abbreviation}
            </button>
          ))}
        </div>
        <button
          onClick={runCompare}
          disabled={selectedIds.length < 2}
          className="btn-primary mt-5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Compare {selectedIds.length >= 2 ? `(${selectedIds.length})` : ""} →
        </button>
      </div>

      {compared && (
        <>
          <section className="card p-6 mb-10">
            <h2 className="font-display font-semibold text-lg mb-4">
              {compared.map((m) => m.abbreviation).join(" vs ")}
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#C7D1C9" />
                  <PolarAngleAxis dataKey="property" tick={{ fill: "#4B5A54", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: "#4B5A54", fontSize: 10 }} />
                  {compared.map((m, i) => (
                    <Radar key={m.id} name={m.abbreviation} dataKey={m.abbreviation} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} />
                  ))}
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left p-4 font-mono text-xs uppercase text-inkfaint">Property</th>
                  {compared.map((m) => (
                    <th key={m.id} className="text-left p-4 font-display font-semibold">{m.abbreviation}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0">
                    <td className="p-4 text-inkfaint font-mono text-xs">{row.label}</td>
                    {compared.map((m) => (
                      <td key={m.id} className="p-4 font-mono">{row.key(m)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
