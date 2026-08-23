import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";
import { Loader, ErrorNote } from "../components/Loader.jsx";
import ScoreBar from "../components/ScoreBar.jsx";

const PROCESS_LABELS = {
  proc_injection_molding: "Injection Molding",
  proc_blow_molding: "Blow Molding",
  proc_extrusion: "Extrusion",
  proc_compression_molding: "Compression Molding",
  proc_thermoforming: "Thermoforming",
  proc_rotational_molding: "Rotational Molding",
  proc_3d_printing: "3D Printing",
};

function Stat({ label, value }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-wide text-inkfaint">{label}</div>
      <div className="font-mono text-sm text-ink">{value ?? "—"}</div>
    </div>
  );
}

export default function MaterialDetail() {
  const { id } = useParams();
  const [m, setM] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setM(null);
    api.getMaterial(id).then(setM).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="max-w-4xl mx-auto px-5 md:px-8 py-14"><ErrorNote message={error} /></div>;
  if (!m) return <Loader label="Loading material profile" />;

  const processes = Object.entries(PROCESS_LABELS).filter(([key]) => m[key]);

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-14">
      <Link to="/materials" className="font-mono text-xs text-teal">← All materials</Link>

      <div className="flex items-start justify-between gap-4 mt-4 mb-2">
        <div>
          <h1 className="text-4xl font-semibold">{m.abbreviation}</h1>
          <p className="text-inkfaint">{m.name} · {m.polymer_type}</p>
        </div>
        <span className="font-mono text-xs border border-line rounded-sm2 px-2 py-1 shrink-0">
          Recycling code {m.recycling_code}
        </span>
      </div>

      <p className="text-ink leading-relaxed mt-6 mb-10">{m.introduction}</p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <section className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Mechanical &amp; Thermal Properties</h2>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <Stat label="Density" value={m.density_g_cm3 ? `${m.density_g_cm3} g/cm³` : null} />
            <Stat label="Tensile strength" value={m.tensile_strength_mpa ? `${m.tensile_strength_mpa} MPa` : null} />
            <Stat label="Melting point" value={m.melting_point_c ? `${m.melting_point_c} °C` : "Amorphous"} />
            <Stat label="Glass transition" value={m.glass_transition_c ? `${m.glass_transition_c} °C` : null} />
            <Stat label="Heat deflection temp" value={m.heat_deflection_c ? `${m.heat_deflection_c} °C` : null} />
            <Stat label="Max operating temp" value={m.max_operating_temp_c ? `${m.max_operating_temp_c} °C` : null} />
          </div>
          <ScoreBar label="Strength" value={m.tensile_strength_score} />
          <ScoreBar label="Impact strength" value={m.impact_strength_score} />
          <ScoreBar label="Flexibility" value={m.flexibility_score} />
          <ScoreBar label="Hardness" value={m.hardness_score} />
          <ScoreBar label="Wear resistance" value={m.wear_resistance_score} />
        </section>

        <section className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Chemical &amp; Sustainability</h2>
          <ScoreBar label="Chemical resist." value={m.chemical_resistance_score} />
          <ScoreBar label="Water resist." value={m.water_resistance_score} />
          <ScoreBar label="UV resist." value={m.uv_resistance_score} />
          <ScoreBar label="Transparency" value={m.transparency_score} />
          <ScoreBar label="Recyclability" value={m.recyclability_score} color="amber" />
          <ScoreBar label="Sustainability" value={m.sustainability_score} color="amber" />
          <div className="flex gap-4 mt-4 pt-4 border-t border-line">
            <span className={`font-mono text-xs px-2 py-1 rounded-sm2 border ${m.food_contact_safe ? "border-teal text-teal" : "border-line text-inkfaint"}`}>
              {m.food_contact_safe ? "✓ Food contact safe" : "✕ Not food-contact approved"}
            </span>
            <span className={`font-mono text-xs px-2 py-1 rounded-sm2 border ${m.biodegradable ? "border-teal text-teal" : "border-line text-inkfaint"}`}>
              {m.biodegradable ? "✓ Biodegradable" : "✕ Not biodegradable"}
            </span>
          </div>
        </section>
      </div>

      <section className="mb-12">
        <h2 className="font-display font-semibold text-lg mb-4">Manufacturing Processes</h2>
        <div className="flex flex-wrap gap-2">
          {processes.map(([key, label]) => (
            <span key={key} className="font-mono text-xs bg-teal/10 text-teal px-3 py-1.5 rounded-sm2">{label}</span>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="font-display font-semibold text-lg mb-3">Advantages</h2>
          <ul className="space-y-1.5">
            {m.advantages.map((a, i) => (
              <li key={i} className="text-sm flex gap-2"><span className="text-teal font-mono">✓</span>{a}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display font-semibold text-lg mb-3">Limitations</h2>
          <ul className="space-y-1.5">
            {m.limitations.map((a, i) => (
              <li key={i} className="text-sm flex gap-2"><span className="text-amber font-mono">!</span>{a}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mb-12">
        <h2 className="font-display font-semibold text-lg mb-3">Typical Applications &amp; Common Products</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {m.applications.map((a) => (
            <span key={a} className="text-xs font-medium bg-white border border-line rounded-sm2 px-3 py-1.5">{a}</span>
          ))}
        </div>
        <p className="text-sm text-inkfaint">{m.common_products.join(" · ")}</p>
      </section>

      <section className="card p-5 mb-8">
        <h2 className="font-mono text-xs uppercase tracking-wide text-inkfaint mb-1">Estimated Material Cost</h2>
        <p className="font-mono text-lg">₹{m.price_per_kg_inr_min} – ₹{m.price_per_kg_inr_max} / kg</p>
      </section>

      <p className="font-mono text-xs text-inkfaint border-t border-line pt-6">{m.source_note}</p>
    </div>
  );
}
