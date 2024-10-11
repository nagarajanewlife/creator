import React, { createContext, useState } from "react";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [formNameC, setFormNameC] = useState(""); // State for formName

  return (
    <DashboardContext.Provider value={{ formNameC, setFormNameC }}>
      {children}
    </DashboardContext.Provider>
  );
};
