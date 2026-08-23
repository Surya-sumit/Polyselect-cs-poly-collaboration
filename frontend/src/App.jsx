import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Selection from "./pages/Selection.jsx";
import Results from "./pages/Results.jsx";
import Materials from "./pages/Materials.jsx";
import MaterialDetail from "./pages/MaterialDetail.jsx";
import Compare from "./pages/Compare.jsx";
import CostEstimator from "./pages/CostEstimator.jsx";
import WhatIf from "./pages/WhatIf.jsx";
import About from "./pages/About.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/select" element={<Selection />} />
          <Route path="/results" element={<Results />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/materials/:id" element={<MaterialDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/cost" element={<CostEstimator />} />
          <Route path="/what-if" element={<WhatIf />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
