import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { Loader, ErrorNote } from "../components/Loader.jsx";

export default function Materials() {
  const [materials, setMaterials] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.listMaterials().then(setMaterials).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="max-w-6xl mx-auto px-5 md:px-8 py-14"><ErrorNote message={error} /></div>;
  if (!materials) return <Loader label="Loading polymer database" />;

  const filtered = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.abbreviation.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
      <span className="eyebrow">Knowledge Base</span>
      <h1 className="text-3xl font-semibold mt-2 mb-2">Polymer Materials</h1>
      <p className="text-inkfaint mb-8">{materials.length} materials · click any card for the full learning profile.</p>

      <input
        className="field-input max-w-sm mb-8"
        placeholder="Search by name or abbreviation…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m) => (
          <Link key={m.id} to={`/materials/${m.id}`} className="card p-5 hover:border-teal transition-colors group">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display font-semibold text-xl group-hover:text-teal transition-colors">{m.abbreviation}</h3>
              <span className="font-mono text-[10px] text-inkfaint border border-line rounded-sm2 px-1.5 py-0.5">#{m.recycling_code}</span>
            </div>
            <p className="text-sm text-inkfaint mb-3">{m.name}</p>
            <p className="text-xs text-inkfaint leading-relaxed line-clamp-2">{m.introduction}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
