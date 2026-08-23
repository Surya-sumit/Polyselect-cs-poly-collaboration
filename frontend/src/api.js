// Thin wrapper around the PolySelect FastAPI backend.
// Set VITE_API_URL in a .env file to point somewhere other than localhost:8000.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

export const api = {
  listMaterials: () => request("/materials"),
  getMaterial: (id) => request(`/materials/${id}`),
  recommend: (requirements) =>
    request("/recommend", { method: "POST", body: JSON.stringify(requirements) }),
  compare: (materialIds) =>
    request("/compare", { method: "POST", body: JSON.stringify({ material_ids: materialIds }) }),
  cost: (payload) => request("/cost", { method: "POST", body: JSON.stringify(payload) }),
  process: (payload) => request("/process", { method: "POST", body: JSON.stringify(payload) }),
  whatIf: (before, after) =>
    request("/what-if", { method: "POST", body: JSON.stringify({ before, after }) }),
};
