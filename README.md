# PolySelect — Polymer Material Selection Expert System

A decision-support web app that helps PPE students, product designers, and small
manufacturers choose a polymer for a product — filtered by hard constraints,
ranked by weighted scoring, and explained at every step. Not a chatbot: every
score traces back to a documented formula in `backend/app/recommender.py`.

```
Product Requirements → Hard-Constraint Filter → Weighted Scoring → Ranking
→ Recommendation → Explanation → Manufacturing Process → Cost → Comparison
```

---

## 1. How it actually works

### Backend — FastAPI + SQLAlchemy (`backend/`)

```
backend/
  app/
    database.py      SQLite by default; swap in Postgres/MySQL via .env DATABASE_URL
    models.py         Material ORM model — every property PolySelect scores against
    schemas.py         Pydantic request/response shapes
    seed_data.py        14 polymers (PET, PETG, HDPE, LDPE, PP, PVC, PS, ABS,
                          PLA, PA6, PC, PMMA, POM, TPU) with engineering-approximate
                          property values, seeded automatically on first run
    recommender.py       THE CORE ENGINE — kept separate from the API routes so
                           it can be tested independently (see §2 below)
    main.py                 REST routes that call into the engine
```

**Endpoints:**

| Route | What it does |
|---|---|
| `GET /materials` | List all materials (summary) |
| `GET /materials/{id}` | Full property profile — powers the "Learn More" page |
| `POST /recommend` | Requirements in → ranked, scored, explained materials out |
| `POST /compare` | Side-by-side properties for 2–3 chosen materials |
| `POST /cost` | Raw material cost estimate from weight × quantity × price/kg |
| `POST /process` | Manufacturing process suggestion + reasoning |
| `POST /what-if` | Runs `/recommend` twice (before/after) and diffs the ranking |

Interactive API docs live at `http://localhost:8000/docs` once the server is running.

### Frontend — React + Vite + Tailwind (`frontend/`)

```
frontend/src/
  api.js                Thin fetch wrapper around the backend
  context/AppContext.jsx  Holds the last requirements + recommendation in memory
                            so Selection → Results → Cost/What-If can share state
  components/            NavBar, Footer, ScoreBar, MaterialCard ("spec ticket"), Loader
  pages/
    Home.jsx               Landing page + pipeline explainer
    Selection.jsx            The requirements form (Step 1)
    Results.jsx                Ranked recommendation + why / why-not (Step 2)
    Materials.jsx                Browse all 14 polymers
    MaterialDetail.jsx             Full learning profile per material
    Compare.jsx                     Radar chart + table, 2–3 materials
    CostEstimator.jsx                 Cost calculator + cross-material comparison
    WhatIf.jsx                         Before/after simulator (Step 3)
    About.jsx                           Explains the hard-constraint/soft-preference philosophy
```

## 2. How the recommendation engine works (`recommender.py`)

**Step 1 — Hard constraints.** A material is rejected outright, before any
scoring happens, if it fails something non-negotiable:
- Its max safe operating temperature is below what you specified
- You need food contact and it isn't food-contact approved
- You marked chemical resistance / transparency / UV resistance / sustainability
  as **Required** and the material falls below the minimum threshold

Rejected materials are still shown to you — with the exact reason — in the
"Why Not the Others?" section of the Results page.

**Step 2 — Weighted soft-preference scoring.** Every material that survives
gets scored 0–100 across seven factors (Strength, Temperature, Chemical
Resistance, Cost, Flexibility, Transparency, Sustainability). Each factor has
a default weight (matching the project spec's example: 25/20/15/15/10/5/10)
that you can override via the "Advanced: Adjust Scoring Weights" panel on the
Selection page. Each factor's contribution is a documented formula — e.g.
Temperature rewards a *safety margin* above your stated requirement rather
than just a pass/fail; Cost is scored relative to your chosen budget band;
Flexibility scores *closeness* to your requested level rather than "more is
always better." Full formulas are commented in the code.

**Step 3 — Rank & explain.** Materials are sorted by total score. The top
pick and every alternative get a "why" checklist generated from which
factors it scored well on, plus a full points-per-factor breakdown you can
see as bar charts on the Results page.

**What-If** simply runs this whole pipeline twice — once for your "before"
requirements, once for "after" — and diffs the resulting rankings to show
you exactly which materials moved and why. Nothing about it is hard-coded;
it's the same engine, called twice.

## 3. Design

Minimal, engineering-datasheet aesthetic: a soft paper background with a
faint drafting grid, Space Grotesk for headings, IBM Plex Sans for body
text, and IBM Plex Mono for all data/scores/specs (so numbers always read
like measurements, not just text). The signature visual is the "spec
ticket" card — every recommended material renders like a lab specimen tag,
with a die-cut corner notch, a perforated divider, and a monospace
match-percentage readout. Fully responsive down to mobile.

---

## 4. Running it locally (Windows / PowerShell)

### Backend

```powershell
cd polyselect\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API starts at `http://127.0.0.1:8000` and seeds its own SQLite database
(`polyselect.db`) on first run — nothing else to configure. Swap in
Postgres/MySQL later by creating a `.env` file with `DATABASE_URL=...`.

### Frontend

Open a **second** PowerShell window:

```powershell
cd polyselect\frontend
npm install
npm run dev
```

Open `http://localhost:5173`. It talks to the backend via `VITE_API_URL`,
already set to `http://localhost:8000` in `frontend/.env`.

### Quick smoke test

With the backend running, visit `http://127.0.0.1:8000/docs` — you should
see 14 materials come back from `GET /materials` and a ranked list from
`POST /recommend`.

---

## 5. What's implemented vs. what's next

**Implemented:** material database (14 polymers), hard-constraint filter,
weighted scoring engine, ranked recommendations with explanations, why-not
reasoning, material comparison (table + radar chart), cost estimator,
manufacturing process recommendation, and the What-If simulator.

**Natural next additions** (not built yet, but the architecture supports
them cleanly): an admin panel for CRUD on materials (the `Material` model
and `/materials` routes are already structured for it), a student quiz
module, and swapping SQLite for Postgres for multi-user deployment
(one env var change, see `database.py`).
