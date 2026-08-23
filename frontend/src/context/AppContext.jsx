import { createContext, useContext, useState } from "react";

const DEFAULT_REQUIREMENTS = {
  operating_temp_c: null,
  required_strength: "NotImportant",
  flexibility: "NotImportant",
  transparency: "NotImportant",
  food_contact: false,
  chemical_resistance: "NotImportant",
  uv_resistance: "NotImportant",
  budget_level: "NotImportant",
  sustainability_importance: "NotImportant",
  production_volume: "Medium",
  weights: {
    strength: 25,
    temperature: 20,
    chemical_resistance: 15,
    cost: 15,
    flexibility: 10,
    transparency: 5,
    sustainability: 10,
  },
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [requirements, setRequirements] = useState(DEFAULT_REQUIREMENTS);
  const [recommendation, setRecommendation] = useState(null); // last /recommend response
  const [productName, setProductName] = useState("");

  return (
    <AppContext.Provider
      value={{
        requirements,
        setRequirements,
        recommendation,
        setRecommendation,
        productName,
        setProductName,
        DEFAULT_REQUIREMENTS,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
